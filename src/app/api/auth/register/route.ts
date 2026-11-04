import { createSession, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { POLICY_UPDATES } from "@/lib/policies";
import { findActiveCodeByHash, hashInviteCode, isValidInviteCode, normalizeInviteCode } from "@/lib/invites";
import { checkRateLimit, RATE_LIMITS, requestIp } from "@/lib/rate-limit";
import {
  AGREEMENT_FIELDS,
  missingAgreements,
  safeNextPath,
  normalizeUsername,
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

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const data = await request.formData();
  // NFKC + lowercase: a full-width "Ａ" and "A" are one account, and a Japanese
  // name is stored as typed (the transform is a no-op for kana and kanji).
  const username = normalizeUsername(formText(data, "username"));
  const email = formText(data, "email").toLowerCase();
  const passwordValue = data.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const confirmValue = data.get("passwordConfirm");
  const passwordConfirm = typeof confirmValue === "string" ? confirmValue : "";
  const next = safeNextPath(formText(data, "next"), "/");
  // Membership is invite-only. The code is a product decision from 2026-11-04:
  // the school is not able to check affiliation, so a maintainer or teacher
  // hands out single-use codes instead.
  const invite = normalizeInviteCode(formText(data, "invite"));
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

  if (!isValidInviteCode(invite)) {
    return failure(request, invite === "" ? "invite-required" : "invite-invalid", next);
  }

  if (
    !validateUsername(username) ||
    !validatePassword(password) ||
    (email !== "" && !validateEmail(email))
  ) {
    return failure(request, "invalid-input", next);
  }

  // The confirmation field is compared here as well: the browser check is a
  // convenience, and a request that skips it lands on the same page.
  if (password !== passwordConfirm) {
    return failure(request, "password-mismatch", next);
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

  // The code is shared and reusable: it only has to be the one currently
  // active. Registration records which code was used, for the audit trail.
  const inviteRow = await findActiveCodeByHash(hashInviteCode(invite));
  if (!inviteRow) {
    return failure(request, "invite-invalid", next);
  }

  let user: { id: string };
  try {
    user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
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
    await tx.inviteUse.create({
      data: { codeId: inviteRow.id, userId: created.id },
    });
    return created;
    });
  } catch {
    return failure(request, "invite-invalid", next);
  }

  const { token, expiresAt } = await createSession(user.id);
  const response = seeOther(request, next);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
