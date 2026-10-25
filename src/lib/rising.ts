export type RisingInput = {
  likeCount: number;
  replyCount: number;
  lastPostAt: Date;
};

/** Only threads active inside this window can be "rising". */
export const RISING_WINDOW_HOURS = 72;

/**
 * Velocity-based ranking for the "急上昇" sort.
 *
 * A thread's score is the engagement it collected per hour of its recent life,
 * with a six-hour head start so a brand new thread with two replies is not
 * buried under a day-old thread with three. Old threads score zero and drop out
 * of the list entirely.
 */
export function risingScore(input: RisingInput, now = Date.now()): number {
  const ageHours = Math.max(0, (now - input.lastPostAt.getTime()) / 3_600_000);
  if (ageHours > RISING_WINDOW_HOURS) {
    return 0;
  }

  const engagement = input.likeCount * 2 + input.replyCount * 3 + 1;

  return engagement / (ageHours + 6);
}

export function sortByRising<T extends RisingInput>(items: T[], now = Date.now()): T[] {
  return items
    .map((item) => ({ item, score: risingScore(item, now) }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.item.lastPostAt.getTime() - a.item.lastPostAt.getTime(),
    )
    .map((row) => row.item);
}
