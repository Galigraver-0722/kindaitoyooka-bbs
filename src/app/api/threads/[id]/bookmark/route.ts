import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, sameHostPath, seeOther } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

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
  if (!user) {
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${thread.id}`)}`);
  }

  const limit = checkRateLimit(
    `bookmark:${user.id}`,
    RATE_LIMITS.bookmark.limit,
    RATE_LIMITS.bookmark.windowMs,
  );
  if (!limit.allowed) {
    const back = sameHostPath(request, `/t/${thread.id}`);
    const separator = back.includes("?") ? "&" : "?";
    return seeOther(request, `${back}${separator}error=rate-limited`);
  }

  await prisma.$transaction(async (tx) => {
    const key = { userId_threadId: { userId: user.id, threadId: thread.id } };
    const existing = await tx.threadBookmark.findUnique({ where: key });

    if (existing) {
      await tx.threadBookmark.delete({ where: key });
      await tx.thread.update({
        where: { id: thread.id },
        data: { bookmarkCount: { decrement: 1 } },
      });
    } else {
      await tx.threadBookmark.create({ data: { userId: user.id, threadId: thread.id } });
      await tx.thread.update({
        where: { id: thread.id },
        data: { bookmarkCount: { increment: 1 } },
      });
    }
  });

  return seeOther(request, sameHostPath(request, `/t/${thread.id}`));
}
