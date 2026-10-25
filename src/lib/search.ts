/**
 * Search ranking for the feed.
 *
 * The database does the filtering (`contains` over title, tag names, and post
 * bodies) and this module decides the order. The weights are deliberately blunt
 * and documented, so "why is this first" has an answer a reader can check:
 *
 *   title hit  5 each (capped at 3 hits)
 *   tag hit    3 each
 *   body hit   1 each (capped at 5 hits)
 *   + engagement tiebreak (likes + bookmarks + replies, tiny)
 *
 * Exact title equality gets a large bonus, because typing a thread's title is
 * the most common way to look for something read a month ago.
 */
export type SearchInput = {
  title: string;
  tagNames: string[];
  bodies: string[];
  likeCount?: number;
  bookmarkCount?: number;
  replyCount?: number;
};

const TITLE_HIT = 5;
const TAG_HIT = 3;
const BODY_HIT = 1;

export function normalizeTerm(term: string): string {
  return term.trim().toLocaleLowerCase().replace(/^#/, "");
}

function countHits(haystack: string, needle: string): number {
  if (!needle) return 0;
  let hits = 0;
  let index = haystack.toLocaleLowerCase().indexOf(needle);
  while (index !== -1) {
    hits += 1;
    index = haystack.toLocaleLowerCase().indexOf(needle, index + needle.length);
  }
  return hits;
}

export function searchScore(term: string, input: SearchInput): number {
  const needle = normalizeTerm(term);
  if (!needle) return 0;

  const title = input.title.toLocaleLowerCase();
  const titleHits = Math.min(countHits(title, needle), 3);
  const exact = title === needle ? 12 : 0;

  const tagHits = input.tagNames.filter((name) =>
    name.toLocaleLowerCase().includes(needle),
  ).length;

  const bodyHits = Math.min(
    input.bodies.reduce((sum, body) => sum + countHits(body, needle), 0),
    5,
  );

  const engagement =
    (input.likeCount ?? 0) + (input.bookmarkCount ?? 0) + (input.replyCount ?? 0);

  return (
    exact +
    titleHits * TITLE_HIT +
    tagHits * TAG_HIT +
    bodyHits * BODY_HIT +
    Math.min(engagement, 20) / 20
  );
}

/** Stable ordering: score first, then most recent activity. */
export function sortByRelevance<T extends SearchInput & { lastPostAt: Date }>(
  term: string,
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const diff = searchScore(term, b) - searchScore(term, a);
    if (diff !== 0) return diff;
    return b.lastPostAt.getTime() - a.lastPostAt.getTime();
  });
}
