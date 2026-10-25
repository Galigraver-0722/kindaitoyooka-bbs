import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Cheap "has anything changed" probe for AutoRefresh. One number from a handful
 * of indexed lookups; the client compares it with the value it saw last time.
 *
 * Edits and soft deletions have to move this number too. A new row alone would
 * leave a thread stale after a moderator removes a post, because nothing was
 * created — only an existing row changed. Hence `Post.updatedAt` and
 * `Thread.updatedAt` are part of the maximum.
 */
export async function GET() {
  const [post, thread, threadLike, postLike, bookmark, report] = await Promise.all([
    prisma.post.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.thread.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.threadLike.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    prisma.postLike.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    prisma.threadBookmark.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    // Reports move the moderation queue, which is also a page a moderator can
    // sit on while waiting.
    prisma.report.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);

  const at = Math.max(
    post?.updatedAt.getTime() ?? 0,
    thread?.updatedAt.getTime() ?? 0,
    threadLike?.createdAt.getTime() ?? 0,
    postLike?.createdAt.getTime() ?? 0,
    bookmark?.createdAt.getTime() ?? 0,
    report?.createdAt.getTime() ?? 0,
  );

  return Response.json({ at }, { headers: { "cache-control": "no-store" } });
}
