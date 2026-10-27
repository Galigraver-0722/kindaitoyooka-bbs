/**
 * First lines of a post, for the feed.
 *
 * The card and row layouts show the opening of the body so a reader can tell
 * what a thread is about without clicking. The body is stored with its original
 * line breaks, so the excerpt collapses all whitespace (including the ideographic
 * space U+3000, which is common in Japanese drafts) into single spaces, then cuts
 * on a code-point boundary so an emoji or a surrogate pair never gets split.
 */

const TRUNCATE = "…";

export function postExcerpt(body: string, max = 120): string {
  const collapsed = body.replace(/[\s\u3000]+/g, " ").trim();
  if (collapsed.length === 0) {
    return "";
  }

  const points = Array.from(collapsed);
  if (points.length <= max) {
    return collapsed;
  }

  // Drop a trailing space before the ellipsis so the cut does not look accidental.
  return `${points.slice(0, max).join("").trimEnd()}${TRUNCATE}`;
}
