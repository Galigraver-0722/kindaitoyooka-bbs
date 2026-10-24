export const MAX_TAGS_PER_POST = 5;

const TAG_TOKEN = /^[\p{L}\p{N}_]{1,30}$/u;

/** Parse a dedicated tag field: space- or comma-separated, leading # optional. */
export function parseTagInput(value: string): string[] {
  const found = new Set<string>();

  for (const raw of value.normalize("NFKC").split(/[\s,、，]+/u)) {
    const tag = raw.replace(/^#+/, "").toLowerCase();
    if (!tag || !TAG_TOKEN.test(tag)) {
      continue;
    }
    found.add(tag);
    if (found.size >= MAX_TAGS_PER_POST) {
      break;
    }
  }

  return [...found];
}

export function tagSearchHref(tag: string): string {
  return `/search?tag=${encodeURIComponent(tag)}`;
}
