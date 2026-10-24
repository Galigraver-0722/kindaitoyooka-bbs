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
  if (!isModerator(user)) {
    return seeOther(request, `/t/${id}?error=forbidden`);
  }

  const thread = await prisma.thread.findUnique({
    where: { id },
    select: { isLocked: true, isDeleted: true },
  });

  if (!thread || thread.isDeleted) {
    return seeOther(request, `/t/${id}?error=thread-not-found`);
  }

  const locking = !thread.isLocked;

  await prisma.$transaction(async (tx) => {
    await tx.thread.update({ where: { id }, data: { isLocked: locking } });
    await recordAudit(tx, {
      actorId: user.id,
      action: locking ? "thread.lock" : "thread.unlock",
      targetType: "thread",
      targetId: id,
    });
  });

  return seeOther(request, `/t/${id}`);
}
