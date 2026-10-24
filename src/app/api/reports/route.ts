import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { validateReportReason } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login?error=login-required");
  }

  const data = await request.formData();
  const postId = formText(data, "postId");
  const reason = formText(data, "reason");

  const post = postId
    ? await prisma.post.findUnique({ where: { id: postId }, select: { threadId: true } })
    : null;

  if (!post) {
    return seeOther(request, "/?error=not-found");
  }

  if (!validateReportReason(reason)) {
    return seeOther(request, `/t/${post.threadId}?error=report-invalid`);
  }

  await prisma.report.create({
    data: { reporterId: user.id, postId, reason },
  });

  return seeOther(request, `/t/${post.threadId}?notice=reported`);
}
