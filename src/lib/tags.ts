export const MAX_TAGS_PER_POST = 5;

// A hashtag starts after whitespace or punctuation, not inside a word or a URL.
// Unicode letters and numbers are allowed, so #文化祭 and #数学 work.
const HASHTAG_PATTERN = /(?<![A-Za-z0-9_/?.&=%])#([\p{L}\p{N}_]{1,30})/gu;

/** Extract normalized, deduplicated hashtags from titles and bodies. */
export function parseHashtags(...texts: string[]): string[] {
  const found = new Set<string>();

  for (const text of texts) {
    for (const match of text.normalize("NFKC").matchAll(HASHTAG_PATTERN)) {
      found.add(match[1].toLowerCase());
      if (found.size >= MAX_TAGS_PER_POST) {
        return [...found];
      }
    }
  }

  return [...found];
}

export function tagSearchHref(tag: string): string {
  return `/search?tag=${encodeURIComponent(tag)}`;
}
