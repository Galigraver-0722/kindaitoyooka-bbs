export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  usernameMin: 3,
  usernameMax: 20,
  passwordMin: 10,
  passwordMax: 200,
  titleMin: 3,
  titleMax: 120,
  bodyMax: 10_000,
  reasonMin: 3,
  reasonMax: 500,
} as const;

export function validateUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
}

export function validatePassword(value: string): boolean {
  return value.length >= LIMITS.passwordMin && value.length <= LIMITS.passwordMax;
}

export function validateEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function validateTitle(value: string): boolean {
  return value.length >= LIMITS.titleMin && value.length <= LIMITS.titleMax;
}

export function validateBody(value: string): boolean {
  return value.length > 0 && value.length <= LIMITS.bodyMax;
}

export function validateReportReason(value: string): boolean {
  return value.length >= LIMITS.reasonMin && value.length <= LIMITS.reasonMax;
}

/**
 * Registration is refused unless the terms checkbox was submitted. The form
 * posts `terms=yes`; anything else, including a missing field, is not consent.
 */
/** The four documents a person must accept, and the form field for each. */
export const AGREEMENT_FIELDS = [
  "agree_terms",
  "agree_rules",
  "agree_privacy",
  "agree_moderation",
] as const;

export type AgreementField = (typeof AGREEMENT_FIELDS)[number];

/** Which of the four documents the submission did not accept. */
export function missingAgreements(values: Partial<Record<AgreementField, string>>): AgreementField[] {
  return AGREEMENT_FIELDS.filter((field) => values[field] !== "yes");
}

export function hasAcceptedTerms(value: string): boolean {
  return value === "yes";
}

/**
 * Only allow redirects back into this site.
 *
 * The value is resolved against a fixed origin and kept only when the result
 * still has that origin. Prefix checks alone are not enough: `new URL("/\\evil.com",
 * base)` treats the backslash as an authority marker and lands on `http://evil.com`,
 * and a tab does the same. Comparing origins after parsing closes both, plus
 * absolute URLs and `//host`. Control characters are rejected outright so a
 * header cannot be split.
 */
const NEXT_BASE = "https://next.invalid";

/** Announcements are short by design: a notice, not a document. */
export const ANNOUNCEMENT_LIMITS = { titleMax: 120, bodyMax: 2000 } as const;

export type AnnouncementInput = {
  titleJa: string;
  titleEn: string;
  bodyJa: string;
  bodyEn: string;
};

/**
 * Both languages are required because the panel renders one of them depending
 * on the reader's locale; a missing side would show an empty notice.
 */
export function validateAnnouncement(input: AnnouncementInput): boolean {
  const title = (value: string) =>
    value.length >= 2 && value.length <= ANNOUNCEMENT_LIMITS.titleMax;
  const body = (value: string) => value.length >= 2 && value.length <= ANNOUNCEMENT_LIMITS.bodyMax;

  return (
    title(input.titleJa) && title(input.titleEn) && body(input.bodyJa) && body(input.bodyEn)
  );
}

export function safeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/")) {
    return fallback;
  }
  if (/[\\\u0000-\u001f\u007f]/.test(value)) {
    return fallback;
  }

  let url: URL;
  try {
    url = new URL(value, NEXT_BASE);
  } catch {
    return fallback;
  }

  if (url.origin !== NEXT_BASE) {
    return fallback;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
