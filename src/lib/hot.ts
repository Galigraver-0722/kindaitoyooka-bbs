export type HotInput = {
  likeCount: number;
  bookmarkCount: number;
  replyCount: number;
  lastPostAt: Date;
};

/**
 * Popularity used by the "hot" sort. The weights are deliberately simple and
 * visible: a like is worth three replies, a bookmark two, and recent activity
 * gets a small bonus capped at three points over 72 hours.
 */
export function hotScore(input: HotInput, now = Date.now()): number {
  const ageHours = Math.max(0, (now - input.lastPostAt.getTime()) / 3_600_000);
  const recency = Math.max(0, 72 - ageHours) / 24;

  return input.likeCount * 3 + input.bookmarkCount * 2 + input.replyCount + recency;
}

export function sortByHot<T extends HotInput>(items: T[], now = Date.now()): T[] {
  return [...items].sort(
    (a, b) =>
      hotScore(b, now) - hotScore(a, now) ||
      b.lastPostAt.getTime() - a.lastPostAt.getTime(),
  );
}
