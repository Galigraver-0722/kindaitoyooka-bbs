import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Cheap "has anything changed" probe for AutoRefresh. One number, four indexed
 * lookups; the client compares it with the value it saw last time.
 */
export async function GET() {
  const [post, threadLike, postLike, bookmark] = await Promise.all([
    prisma.post.findFirst({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.threadLike.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    prisma.postLike.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    prisma.threadBookmark.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);

  const at = Math.max(
    post?.createdAt.getTime() ?? 0,
    threadLike?.createdAt.getTime() ?? 0,
    postLike?.createdAt.getTime() ?? 0,
    bookmark?.createdAt.getTime() ?? 0,
  );

  return Response.json({ at }, { headers: { "cache-control": "no-store" } });
}
