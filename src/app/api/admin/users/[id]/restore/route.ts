import { canRestore } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

/** Undo a suspension. The reason is kept in the audit log, not on the account. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const actor = await getCurrentUser();
  if (!actor) {
    return seeOther(request, "/login?next=/admin");
  }

  const { id } = await params;
  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, isSuspended: true },
  });
  if (!target) {
    return seeOther(request, "/admin?tab=users&error=not-found");
  }

  const decision = canRestore(actor, target);
  if (!decision.ok) {
    const code = decision.reason === "self" ? "self" : "forbidden";
    return seeOther(request, `/admin?tab=users&error=${code}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: { isSuspended: false, suspendedAt: null, suspendedReason: null },
    });
    await recordAudit(tx, {
      actorId: actor.id,
      action: "user.restore",
      targetType: "user",
      targetId: id,
    });
  });

  return seeOther(request, "/admin?tab=users&notice=user-restored");
}
