import { prisma } from "@/lib/db";

/**
 * Called when a thread page renders. The write is idempotent and only stores a
 * timestamp, so it is safe to repeat on every view.
 *
 * The stored markers are what a future "new replies" badge will read; the lists
 * do not render a badge yet, so nothing consumes them today.
 */
export async function markThreadRead(userId: string, threadId: string): Promise<void> {
  await prisma.threadRead.upsert({
    where: { userId_threadId: { userId, threadId } },
    update: { lastReadAt: new Date() },
    create: { userId, threadId },
  });
}
