import { prisma } from "@/lib/db";
import type { Hit } from "@/lib/content-filter";

/**
 * Record a write that the filter refused.
 *
 * The post is never created, so there is nothing in `Post` to point at. Without
 * this row a blocked attempt would leave no trace at all: the student sees an
 * error, and a moderator never learns that someone tried. The console lists
 * these under "blocked".
 */
export type BlockSurface = "thread" | "reply" | "edit" | "board" | "profile";

/** 200 characters of the refused text, newlines flattened, for the console. */
export function excerptOf(texts: string[]): string {
  const flat = texts.join(" / ").replace(/\s+/g, " ").trim();
  const points = Array.from(flat);
  return points.length > 200 ? `${points.slice(0, 200).join("")}…` : flat;
}

export async function recordBlockedAttempt(input: {
  userId: string;
  surface: BlockSurface;
  hit: Hit;
  texts: string[];
}): Promise<void> {
  await prisma.blockedAttempt.create({
    data: {
      userId: input.userId,
      surface: input.surface,
      field: input.hit.field,
      words: input.hit.term,
      excerpt: excerptOf(input.texts),
    },
  });
}
