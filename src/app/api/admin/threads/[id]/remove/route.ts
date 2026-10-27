import { canRemoveContent } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

/** Remove a whole thread from the console; it disappears from boards and search. */
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
  const thread = await prisma.thread.findUnique({
    where: { id },
    select: { id: true, boardId: true },
  });
  if (!thread) {
    return seeOther(request, "/admin?tab=content&error=not-found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.thread.update({ where: { id }, data: { isDeleted: true } });
    await recordAudit(tx, {
      actorId: actor.id,
      action: "thread.remove",
      targetType: "thread",
      targetId: id,
      details: { boardId: thread.boardId, from: "console" },
    });
  });

  return seeOther(request, "/admin?tab=content&notice=thread-removed");
}
