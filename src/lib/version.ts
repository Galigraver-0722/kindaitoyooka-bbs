/**
 * The version shown in the header and returned by `/health`.
 *
 * It duplicates `package.json` on purpose: importing JSON into both the server
 * and the client bundle is easy to get wrong, and a test
 * (`tests/version.test.ts`) fails when the two disagree. The channel is a
 * deliberate constant, not an environment variable, so a build cannot claim to
 * be beta on one machine and stable on another.
 */
export const VERSION = "0.1.0";

/** `beta` while the site is in internal testing; flip to `stable` to ship. */
export const CHANNEL: "beta" | "stable" = "beta";

export const IS_BETA = CHANNEL === "beta";

/**
 * The one string the UI shows: `v.beta0.1.0` while testing, `v0.1.0` once the
 * channel is stable. The dot after `v` is deliberate; it keeps the channel and
 * the number readable without a second label.
 */
export function versionTag(): string {
  return CHANNEL === "beta" ? `v.beta${VERSION}` : `v${VERSION}`;
}
