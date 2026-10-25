import { getCurrentUser, isModerator } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?error=login-required&next=${encodeURIComponent(`/t/${id}`)}`);
  }
  const thread = await prisma.thread.findUnique({
    where: { id },
    select: { isDeleted: true, authorId: true, board: { select: { slug: true } } },
  });

  if (!thread || thread.isDeleted) {
    return seeOther(request, `/t/${id}?error=thread-not-found`);
  }

  // Authors may remove their own thread; moderators may remove anyone's.
  if (!isModerator(user) && thread.authorId !== user.id) {
    return seeOther(request, `/t/${id}?error=forbidden`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.thread.update({ where: { id }, data: { isDeleted: true } });
    await recordAudit(tx, {
      actorId: user.id,
      action: "thread.remove",
      targetType: "thread",
      targetId: id,
      details: { board: thread.board.slug },
    });
  });

  return seeOther(request, `/b/${thread.board.slug}`);
}
