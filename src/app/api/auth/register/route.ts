import { createSession, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS, requestIp } from "@/lib/rate-limit";
import { safeNextPath, validateEmail, validatePassword, validateUsername } from "@/lib/validation";

function failure(request: Request, code: string, next: string) {
  const params = new URLSearchParams({ error: code });
  if (next !== "/") {
    params.set("next", next);
  }
  return seeOther(request, `/register?${params.toString()}`);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await request.formData();
  const username = formText(data, "username").toLowerCase();
  const email = formText(data, "email").toLowerCase();
  const passwordValue = data.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const next = safeNextPath(formText(data, "next"), "/");

  const limit = checkRateLimit(
    `register:${requestIp(request)}`,
    RATE_LIMITS.register.limit,
    RATE_LIMITS.register.windowMs,
  );
  if (!limit.allowed) {
    return failure(request, "rate-limited", next);
  }

  if (
    !validateUsername(username) ||
    !validatePassword(password) ||
    (email !== "" && !validateEmail(email))
  ) {
    return failure(request, "invalid-input", next);
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, ...(email ? [{ email }] : [])] },
    select: { username: true, email: true },
  });

  if (existing?.username === username) {
    return failure(request, "username-taken", next);
  }
  if (email && existing?.email === email) {
    return failure(request, "email-taken", next);
  }

  // The first account to register becomes the administrator. This makes a fresh
  // self-hosted install usable without a manual database edit.
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "ADMIN" : "STUDENT";

  const user = await prisma.user.create({
    data: {
      username,
      email: email || null,
      passwordHash: await hashPassword(password),
      role,
    },
    select: { id: true },
  });

  const { token, expiresAt } = await createSession(user.id);
  const response = seeOther(request, next);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
