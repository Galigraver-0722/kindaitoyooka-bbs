import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
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
    select: { id: true, postId: true, post: { select: { isDeleted: true } } },
  });

  if (!report) {
    return seeOther(request, "/moderation");
  }

  if (action === "remove") {
    await prisma.$transaction([
      prisma.post.update({ where: { id: report.postId }, data: { isDeleted: true } }),
      prisma.report.update({
        where: { id },
        data: { resolvedAt: new Date(), resolvedById: user.id, resolution: "removed" },
      }),
    ]);
    return seeOther(request, "/moderation");
  }

  if (action === "dismiss") {
    await prisma.report.update({
      where: { id },
      data: { resolvedAt: new Date(), resolvedById: user.id, resolution: "dismissed" },
    });
    return seeOther(request, "/moderation");
  }

  return seeOther(request, "/moderation?error=invalid-input");
}
