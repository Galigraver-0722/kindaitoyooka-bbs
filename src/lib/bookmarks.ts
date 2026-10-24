import { prisma } from "@/lib/db";

/** One query for the bookmark icons on a list of threads. */
export async function getBookmarkedThreadIds(
  userId: string | undefined,
  threadIds: string[],
): Promise<Set<string>> {
  if (!userId || threadIds.length === 0) {
    return new Set();
  }

  const rows = await prisma.threadBookmark.findMany({
    where: { userId, threadId: { in: threadIds } },
    select: { threadId: true },
  });

  return new Set(rows.map((row) => row.threadId));
}
