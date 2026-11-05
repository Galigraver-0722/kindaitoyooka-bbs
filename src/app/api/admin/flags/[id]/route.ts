import { canRemoveContent } from "@/lib/admin";
import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

/**
 * Resolve a metadata flag. `clear` removes a profile bio, `archive` hides a
 * community board; both also close the flag. `resolve` only closes it.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const actor = await getCurrentUser();
  if (!actor || !isModerator(actor)) {
    return seeOther(request, "/admin?error=forbidden");
  }

  const { id } = await params;
  const data = await request.formData();
  const action = String(data.get("action") ?? "");

  const flag = await prisma.moderationFlag.findUnique({ where: { id } });
  if (!flag || flag.status !== "OPEN") {
    return seeOther(request, "/admin?tab=flags&error=not-found");
  }

  const close = {
    status: "RESOLVED",
    resolvedAt: new Date(),
    resolvedById: actor.id,
  };

  try {
    await prisma.$transaction(async (tx) => {
      if (action === "clear") {
        if (flag.targetType !== "PROFILE" || !canRemoveContent(actor)) {
          throw new Error("forbidden");
        }
        await tx.user.update({ where: { id: flag.targetId }, data: { bio: null } });
        await recordAudit(tx, {
          actorId: actor.id,
          action: "profile.bio.clear",
          targetType: "user",
          targetId: flag.targetId,
          details: { flagId: flag.id },
        });
      } else if (action === "archive") {
        if (flag.targetType !== "BOARD" || !canRemoveContent(actor)) {
          throw new Error("forbidden");
        }
        await tx.board.update({ where: { id: flag.targetId }, data: { isArchived: true } });
        await recordAudit(tx, {
          actorId: actor.id,
          action: "board.archive",
          targetType: "board",
          targetId: flag.targetId,
          details: { flagId: flag.id },
        });
      } else if (action !== "resolve") {
        throw new Error("invalid action");
      }

      await tx.moderationFlag.update({ where: { id: flag.id }, data: close });
    });
  } catch {
    return seeOther(request, "/admin?tab=flags&error=forbidden");
  }

  return seeOther(request, "/admin?tab=flags");
}
