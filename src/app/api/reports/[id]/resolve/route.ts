import { getCurrentUser, isModerator } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login?error=login-required&next=%2Fmoderation");
  }
  if (!isModerator(user)) {
    return seeOther(request, "/?error=forbidden");
  }

  const data = await request.formData();
  const action = formText(data, "action");

  const report = await prisma.report.findUnique({
    where: { id },
    select: {
      id: true,
      postId: true,
      post: { select: { isDeleted: true, threadId: true } },
    },
  });

  if (!report) {
    return seeOther(request, "/moderation");
  }

  if (action === "remove") {
    await prisma.$transaction(async (tx) => {
      await tx.post.update({ where: { id: report.postId }, data: { isDeleted: true } });
      await tx.report.update({
        where: { id },
        data: { resolvedAt: new Date(), resolvedById: user.id, resolution: "removed" },
      });
      await recordAudit(tx, {
        actorId: user.id,
        action: "report.remove",
        targetType: "report",
        targetId: id,
        details: { postId: report.postId, threadId: report.post.threadId },
      });
    });
    return seeOther(request, "/moderation");
  }

  if (action === "dismiss") {
    await prisma.$transaction(async (tx) => {
      await tx.report.update({
        where: { id },
        data: { resolvedAt: new Date(), resolvedById: user.id, resolution: "dismissed" },
      });
      await recordAudit(tx, {
        actorId: user.id,
        action: "report.dismiss",
        targetType: "report",
        targetId: id,
        details: { postId: report.postId, threadId: report.post.threadId },
      });
    });
    return seeOther(request, "/moderation");
  }

  return seeOther(request, "/moderation?error=invalid-input");
}
