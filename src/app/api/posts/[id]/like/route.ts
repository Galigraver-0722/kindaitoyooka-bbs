import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther, wantsJson } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, threadId: true, isDeleted: true },
  });

  if (!post || post.isDeleted) {
    return seeOther(request, "/?error=not-found");
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${post.threadId}`)}`);
  }

  const json = wantsJson(request);
  const limit = checkRateLimit(
    `like:${user.id}`,
    RATE_LIMITS.like.limit,
    RATE_LIMITS.like.windowMs,
  );
  if (!limit.allowed) {
    if (json) {
      return Response.json({ error: "rate-limited" }, { status: 429 });
    }
    return seeOther(request, `/t/${post.threadId}?error=rate-limited`);
  }

  let active = false;
  let count = 0;

  await prisma.$transaction(async (tx) => {
    const key = { userId_postId: { userId: user.id, postId: post.id } };
    const existing = await tx.postLike.findUnique({ where: key });
    active = !existing;

    if (existing) {
      await tx.postLike.delete({ where: key });
      await tx.post.update({ where: { id: post.id }, data: { likeCount: { decrement: 1 } } });
      await tx.thread.update({
        where: { id: post.threadId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      await tx.postLike.create({ data: { userId: user.id, postId: post.id } });
      await tx.post.update({ where: { id: post.id }, data: { likeCount: { increment: 1 } } });
      await tx.thread.update({
        where: { id: post.threadId },
        data: { likeCount: { increment: 1 } },
      });
    }

    const updated = await tx.post.findUniqueOrThrow({
      where: { id: post.id },
      select: { likeCount: true },
    });
    count = updated.likeCount;
  });

  if (json) {
    return Response.json({ active, count });
  }

  return seeOther(request, `/t/${post.threadId}#p-${post.id}`);
}
