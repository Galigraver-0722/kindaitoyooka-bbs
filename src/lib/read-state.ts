import { prisma } from "@/lib/db";

type ThreadActivity = { id: string; lastPostAt: Date };

/**
 * A thread is unread when the signed-in user has never opened it, or when it
 * received a reply after their last visit. Guests have no read state, so the
 * badge is only rendered for signed-in users.
 */
export async function getUnreadThreadIds(
  userId: string | undefined,
  threads: ThreadActivity[],
): Promise<Set<string>> {
  if (!userId || threads.length === 0) {
    return new Set();
  }

  const reads = await prisma.threadRead.findMany({
    where: { userId, threadId: { in: threads.map((thread) => thread.id) } },
    select: { threadId: true, lastReadAt: true },
  });

  const lastRead = new Map(reads.map((row) => [row.threadId, row.lastReadAt.getTime()]));

  return new Set(
    threads
      .filter((thread) => {
        const readAt = lastRead.get(thread.id);
        return readAt === undefined || thread.lastPostAt.getTime() > readAt;
      })
      .map((thread) => thread.id),
  );
}

/**
 * Called when a thread page renders. The write is idempotent and only stores a
 * timestamp, so it is safe to repeat on every view.
 */
export async function markThreadRead(userId: string, threadId: string): Promise<void> {
  await prisma.threadRead.upsert({
    where: { userId_threadId: { userId, threadId } },
    update: { lastReadAt: new Date() },
    create: { userId, threadId },
  });
}
