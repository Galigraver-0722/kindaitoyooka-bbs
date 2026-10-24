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
 * Only allow redirects back into this site. Rejecting `//host` and absolute URLs
 * prevents the login form from becoming an open redirect.
 */
export function safeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
