import { prisma } from "@/lib/db";

/** Thread ids the viewer has liked, for the small like buttons in lists. */
export async function getLikedThreadIds(
  userId: string | undefined,
  threadIds: string[],
): Promise<Set<string>> {
  if (!userId || threadIds.length === 0) {
    return new Set();
  }

  const rows = await prisma.threadLike.findMany({
    where: { userId, threadId: { in: threadIds } },
    select: { threadId: true },
  });

  return new Set(rows.map((row) => row.threadId));
}
