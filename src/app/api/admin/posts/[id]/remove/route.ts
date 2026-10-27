import { canRemoveContent } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

/** Remove a post from the console. Same soft delete as the public route, but returns to the console. */
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
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, threadId: true, isDeleted: true },
  });
  if (!post) {
    return seeOther(request, "/admin?tab=content&error=not-found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.post.update({ where: { id }, data: { isDeleted: true } });
    await recordAudit(tx, {
      actorId: actor.id,
      action: "post.remove",
      targetType: "post",
      targetId: id,
      details: { threadId: post.threadId, from: "console" },
    });
  });

  return seeOther(request, "/admin?tab=content&notice=post-removed");
}
