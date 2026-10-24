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
    return seeOther(request, `/login?error=login-required&next=${encodeURIComponent("/moderation")}`);
  }
  if (!isModerator(user)) {
    return seeOther(request, `/t/${id}?error=forbidden`);
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { threadId: true },
  });

  if (!post) {
    return seeOther(request, "/?error=not-found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.post.update({ where: { id }, data: { isDeleted: true } });
    await recordAudit(tx, {
      actorId: user.id,
      action: "post.remove",
      targetType: "post",
      targetId: id,
      details: { threadId: post.threadId },
    });
  });

  return seeOther(request, `/t/${post.threadId}`);
}
