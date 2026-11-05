import { createSession, SESSION_COOKIE, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { checkRateLimit, pruneRateLimits, RATE_LIMITS, requestIp, resetRateLimit } from "@/lib/rate-limit";
import { LIMITS, normalizeUsername, safeNextPath, validateUsername } from "@/lib/validation";

function failure(request: Request, next: string, code = "invalid-credentials") {
  const params = new URLSearchParams({ error: code });
  if (next !== "/") {
    params.set("next", next);
  }
  return seeOther(request, `/login?${params.toString()}`);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const data = await request.formData();
  const rawUsername = formText(data, "username");
  // Reject oversized fields before NFKC or a database key is built. A 20 KB
  // username used to become a permanent 20 KB RateLimit row.
  if (rawUsername.length > LIMITS.usernameMax * 2) {
    return failure(request, safeNextPath(formText(data, "next"), "/"));
  }
  const username = normalizeUsername(rawUsername);
  const passwordValue = data.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const next = safeNextPath(formText(data, "next"), "/");

  if (!username || !validateUsername(username) || password.length > LIMITS.passwordMax || !password) {
    return failure(request, next);
  }

  await pruneRateLimits();
  const ip = requestIp(request);
  // Aggregate bucket: rotating usernames used to buy a fresh bucket per name.
  // `shared` is deliberately conservative; deployments behind a proxy must set
  // TRUST_PROXY=1 so this is a real client bucket, not everyone at once.
  const ipKey = `login-ip:${ip ?? "shared"}`;
  const ipLimit = await checkRateLimit(ipKey, RATE_LIMITS.loginIp.limit, RATE_LIMITS.loginIp.windowMs);
  if (!ipLimit.allowed) {
    return failure(request, next, "rate-limited");
  }
  const accountKey = `login-account:${username}`;
  const accountLimit = await checkRateLimit(
    accountKey,
    RATE_LIMITS.loginAccount.limit,
    RATE_LIMITS.loginAccount.windowMs,
  );
  if (!accountLimit.allowed) {
    return failure(request, next, "rate-limited");
  }
  const loginKey = `login:${ip ?? "shared"}:${username}`;
  const limit = await checkRateLimit(loginKey, RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs);
  if (!limit.allowed) {
    return failure(request, next, "rate-limited");
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, passwordHash: true, isSuspended: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return failure(request, next);
  }

  // Only reached with the correct password: a bystander guessing still sees
  // "wrong username or password", so the suspended state is not probeable.
  if (user.isSuspended) {
    return failure(request, next, "suspended");
  }

  await resetRateLimit(loginKey);

  const { token, expiresAt } = await createSession(user.id);
  const response = seeOther(request, next);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
