import { getCurrentUser } from "@/lib/auth";
import { canSuspend } from "@/lib/admin";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";

/**
 * Suspend an account. Suspending deletes every session for the target, so the
 * person is signed out on all devices immediately and cannot sign in again
 * until a moderator restores the account. Nothing is deleted: posts stay.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const actor = await getCurrentUser();
  if (!actor) {
    return seeOther(request, "/login?next=/admin");
  }

  const { id } = await params;
  const data = await request.formData();
  const reason = formText(data, "reason").slice(0, 200);

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, isSuspended: true },
  });
  if (!target) {
    return seeOther(request, "/admin?tab=users&error=not-found");
  }

  const decision = canSuspend(actor, target);
  if (!decision.ok) {
    const code = decision.reason === "self" ? "self" : "forbidden";
    return seeOther(request, `/admin?tab=users&error=${code}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: { isSuspended: true, suspendedAt: new Date(), suspendedReason: reason || null },
    });
    // Force the account out everywhere; a live session would otherwise keep
    // working until it happened to expire.
    await tx.session.deleteMany({ where: { userId: id } });
    await recordAudit(tx, {
      actorId: actor.id,
      action: "user.suspend",
      targetType: "user",
      targetId: id,
      details: { reason },
    });
  });

  return seeOther(request, "/admin?tab=users&notice=user-suspended");
}
