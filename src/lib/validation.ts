/**
 * Usernames may be written in any script: Japanese, Latin, Cyrillic, Hangul.
 * Letters, decimal digits and the underscore only — no spaces, no punctuation,
 * and no combining or bidi control characters, which would let one name be
 * displayed as another. Length is checked against `LIMITS` separately.
 */
export const USERNAME_PATTERN = /^[\p{L}\p{Nd}_]+$/u;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  usernameMin: 3,
  usernameMax: 20,
  passwordMin: 8,
  passwordMax: 200,
  titleMin: 3,
  titleMax: 120,
  bodyMax: 10_000,
  reasonMin: 3,
  reasonMax: 500,
} as const;

/**
 * Stored form of a username: NFKC (so a full-width "Ａ" and "A" are one
 * account), trimmed, lowercased (a no-op for Japanese, keeps Latin
 * case-insensitive). Registration, login and the scripts all go through this.
 */
export function normalizeUsername(value: string): string {
  return value.normalize("NFKC").trim().toLowerCase();
}

export function validateUsername(value: string): boolean {
  const normalized = normalizeUsername(value);
  if (normalized.length < LIMITS.usernameMin || normalized.length > LIMITS.usernameMax) {
    return false;
  }
  return USERNAME_PATTERN.test(normalized);
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
