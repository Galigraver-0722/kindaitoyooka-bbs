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

/** `v0.1.0`, for places that show the number without the channel. */
export function versionNumber(): string {
  return `v${VERSION}`;
}
