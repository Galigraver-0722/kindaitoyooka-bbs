/**
 * Switches for features that exist but are not currently shown.
 *
 * Keeping the code behind a flag is deliberate: the composer preview works and
 * is tested, but the request changed to a feed excerpt instead, so it is hidden
 * rather than deleted. Flipping one value brings it back in all three forms.
 */
export const FEATURES = {
  /** Preview toggle under the body field in the compose, edit, and reply forms. */
  postPreview: false,
} as const;
