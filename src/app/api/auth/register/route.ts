import { createSession, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { POLICY_UPDATES } from "@/lib/policies";
import { checkRateLimit, RATE_LIMITS, requestIp } from "@/lib/rate-limit";
import {
  AGREEMENT_FIELDS,
  missingAgreements,
  safeNextPath,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/validation";

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
  // The browser marks all four boxes as required, but that is a convenience: the
  // server decides. A request that skips any of them is refused here.
  const agreements = Object.fromEntries(
    AGREEMENT_FIELDS.map((field) => [field, formText(data, field)]),
  ) as Record<(typeof AGREEMENT_FIELDS)[number], string>;
  const missing = missingAgreements(agreements);

  const limit = await checkRateLimit(
    `register:${requestIp(request) ?? "shared"}`,
    RATE_LIMITS.register.limit,
    RATE_LIMITS.register.windowMs,
  );
  if (!limit.allowed) {
    return failure(request, "rate-limited", next);
  }

  if (missing.length > 0) {
    return failure(request, "terms-required", next);
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
      // Evidence of consent: when, and which version of each document was
      // accepted. The four versions can differ, so each is recorded.
      termsAcceptedAt: new Date(),
      termsVersion: POLICY_UPDATES.terms,
      acceptedPolicies: AGREEMENT_FIELDS.map((field) => {
        const key = field === "agree_terms" ? "terms"
          : field === "agree_rules" ? "rules"
          : field === "agree_privacy" ? "privacy"
          : "moderation";
        return `${key}:${POLICY_UPDATES[key]}`;
      }).join(";"),
    },
    select: { id: true },
  });

  const { token, expiresAt } = await createSession(user.id);
  const response = seeOther(request, next);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
