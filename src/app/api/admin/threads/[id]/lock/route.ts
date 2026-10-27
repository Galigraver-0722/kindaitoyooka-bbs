import { canRemoveContent } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

/** Toggle the lock from the console and come back to the console. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const actor = await getCurrentUser();
  if (!actor) {
    return seeOther(request, "/login?next=/admin");
  }
  if (!canRemoveContent(actor)) {
    return seeOther(request, "/admin?error=forbidden");
  }

  const { id } = await params;
  const thread = await prisma.thread.findUnique({ where: { id }, select: { id: true, isLocked: true } });
  if (!thread) {
    return seeOther(request, "/admin?tab=content&error=not-found");
  }

  const next = !thread.isLocked;
  await prisma.$transaction(async (tx) => {
    await tx.thread.update({ where: { id }, data: { isLocked: next } });
    await recordAudit(tx, {
      actorId: actor.id,
      action: next ? "thread.lock" : "thread.unlock",
      targetType: "thread",
      targetId: id,
    });
  });

  return seeOther(request, `/admin?tab=content&notice=${next ? "thread-locked" : "thread-unlocked"}`);
}
