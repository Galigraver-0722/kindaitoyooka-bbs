export type HighlightPart = { text: string; hit: boolean };

/** Strip the leading `#` used for tag searches and trim. */
export function normalizeHighlightTerm(term: string | undefined): string {
  return (term ?? "").trim().replace(/^#/, "").slice(0, 100);
}

/**
 * Split text into alternating plain and matching parts. Case-insensitive, and
 * returns a single plain part when there is nothing to mark, so callers can
 * render the common case without extra nodes.
 */
export function splitHighlight(text: string, term: string | undefined): HighlightPart[] {
  const needle = normalizeHighlightTerm(term);
  if (!needle) return [{ text, hit: false }];

  const lowerText = text.toLocaleLowerCase();
  const lowerNeedle = needle.toLocaleLowerCase();
  const parts: HighlightPart[] = [];
  let cursor = 0;

  let index = lowerText.indexOf(lowerNeedle);
  while (index !== -1) {
    if (index > cursor) parts.push({ text: text.slice(cursor, index), hit: false });
    parts.push({ text: text.slice(index, index + needle.length), hit: true });
    cursor = index + needle.length;
    index = lowerText.indexOf(lowerNeedle, cursor);
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts.length > 0 ? parts : [{ text, hit: false }];
}
