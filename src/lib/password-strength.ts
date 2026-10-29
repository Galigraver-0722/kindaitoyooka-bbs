/**
 * How far a password gets towards the advice shown under the field.
 *
 * Two different things are measured and must not be confused:
 *   - `longEnough` is the only *requirement*; the server refuses anything
 *     shorter, so the form can say "not yet".
 *   - `score` is advice. A short-but-required password is accepted; it simply
 *     shows one bar.
 *
 * Kept pure so the labels under the field can be tested without a browser.
 */
export type PasswordStrength = {
  /** 0 = too short, 1 = weak, 2 = fair, 3 = strong. */
  score: 0 | 1 | 2 | 3;
  longEnough: boolean;
  /** Code points, not UTF-16 units, so one emoji does not count as two. */
  length: number;
  /** How many of letters / digits / other characters appear, 0–3. */
  variety: number;
};

export function passwordStrength(value: string, minLength = 8): PasswordStrength {
  const chars = [...value];
  const length = chars.length;
  const variety = [
    /\p{L}/u.test(value),
    /\p{Nd}/u.test(value),
    /[^\p{L}\p{Nd}\s]/u.test(value),
  ].filter(Boolean).length;

  const longEnough = length >= minLength;
  if (!longEnough) {
    return { score: 0, longEnough, length, variety };
  }

  const score = variety >= 3 || (length >= 16 && variety >= 2) ? 3 : variety === 2 ? 2 : 1;
  return { score: score as 1 | 2 | 3, longEnough, length, variety };
}
