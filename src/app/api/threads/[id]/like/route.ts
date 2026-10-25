import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, sameHostPath, seeOther, wantsJson } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/** Toggles the viewer's like on a whole thread and keeps `likeCount` in sync. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const thread = await prisma.thread.findUnique({
    where: { id },
    select: { id: true, isDeleted: true },
  });

  if (!thread || thread.isDeleted) {
    return seeOther(request, "/?error=not-found");
  }

  const user = await getCurrentUser();
  const json = wantsJson(request);
  if (!user) {
    if (json) {
      return Response.json({ error: "login-required" }, { status: 401 });
    }
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${id}`)}`);
  }

  const limit = checkRateLimit(
    `like:${user.id}`,
    RATE_LIMITS.like.limit,
    RATE_LIMITS.like.windowMs,
  );
  if (!limit.allowed) {
    if (json) {
      return Response.json({ error: "rate-limited" }, { status: 429 });
    }
    return seeOther(request, `/t/${id}?error=rate-limited`);
  }

  let active = false;
  let count = 0;

  await prisma.$transaction(async (tx) => {
    const key = { userId_threadId: { userId: user.id, threadId: thread.id } };
    const existing = await tx.threadLike.findUnique({ where: key });
    active = !existing;

    if (existing) {
      await tx.threadLike.delete({ where: key });
      await tx.thread.update({ where: { id: thread.id }, data: { likeCount: { decrement: 1 } } });
    } else {
      await tx.threadLike.create({ data: { userId: user.id, threadId: thread.id } });
      await tx.thread.update({ where: { id: thread.id }, data: { likeCount: { increment: 1 } } });
    }

    const updated = await tx.thread.findUniqueOrThrow({
      where: { id: thread.id },
      select: { likeCount: true },
    });
    count = Math.max(0, updated.likeCount);
  });

  if (json) {
    return Response.json({ active, count });
  }

  return seeOther(request, sameHostPath(request, `/t/${thread.id}`));
}
