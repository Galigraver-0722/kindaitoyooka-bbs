import { canRemoveContent } from "@/lib/admin";
import { recordAudit } from "@/lib/audit";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

const HOLD_DAYS = 90;

/** Toggle a safety hold on a post. The hold pauses purge, not public hiding. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }
  const actor = await getCurrentUser();
  if (!actor || !canRemoveContent(actor)) {
    return seeOther(request, "/admin?error=forbidden");
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, safetyHoldUntil: true },
  });
  if (!post) {
    return seeOther(request, "/admin?tab=content&error=not-found");
  }

  const held = Boolean(post.safetyHoldUntil && post.safetyHoldUntil > new Date());
  const until = held ? null : new Date(Date.now() + HOLD_DAYS * 24 * 60 * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.post.update({ where: { id }, data: { safetyHoldUntil: until } });
    await recordAudit(tx, {
      actorId: actor.id,
      action: held ? "safety.release" : "safety.hold",
      targetType: "post",
      targetId: id,
      details: { until: until?.toISOString() ?? null },
    });
  });

  return seeOther(request, "/admin?tab=content");
}
