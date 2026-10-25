import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, sameHostPath, seeOther, wantsJson } from "@/lib/http";
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
  const json = wantsJson(request);
  if (!user) {
    if (json) {
      return Response.json({ error: "login-required" }, { status: 401 });
    }
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${thread.id}`)}`);
  }

  const limit = await checkRateLimit(
    `bookmark:${user.id}`,
    RATE_LIMITS.bookmark.limit,
    RATE_LIMITS.bookmark.windowMs,
  );
  if (!limit.allowed) {
    if (json) {
      return Response.json({ error: "rate-limited" }, { status: 429 });
    }
    const back = sameHostPath(request, `/t/${thread.id}`);
    const separator = back.includes("?") ? "&" : "?";
    return seeOther(request, `${back}${separator}error=rate-limited`);
  }

  let active = false;
  let count = 0;

  await prisma.$transaction(async (tx) => {
    const key = { userId_threadId: { userId: user.id, threadId: thread.id } };
    const existing = await tx.threadBookmark.findUnique({ where: key });
    active = !existing;

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

    const updated = await tx.thread.findUniqueOrThrow({
      where: { id: thread.id },
      select: { bookmarkCount: true },
    });
    count = updated.bookmarkCount;
  });

  if (json) {
    return Response.json({ active, count });
  }

  return seeOther(request, sameHostPath(request, `/t/${thread.id}`));
}
