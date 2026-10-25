import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { validateReportReason } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
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

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${post.threadId}`)}`);
  }

  const limit = await checkRateLimit(
    `report:${user.id}`,
    RATE_LIMITS.report.limit,
    RATE_LIMITS.report.windowMs,
  );
  if (!limit.allowed) {
    return seeOther(request, `/t/${post.threadId}?error=rate-limited`);
  }

  if (!validateReportReason(reason)) {
    return seeOther(request, `/t/${post.threadId}?error=report-invalid`);
  }

  // One open report per reader and post: a second click must not stack a
  // duplicate in the moderator queue. The partial unique index is the backstop
  // for two clicks racing each other.
  const open = await prisma.report.findFirst({
    where: { reporterId: user.id, postId, resolvedAt: null },
    select: { id: true },
  });

  if (!open) {
    try {
      await prisma.report.create({
        data: { reporterId: user.id, postId, reason, source: "USER" },
      });
    } catch {
      // A concurrent insert hit `Report_one_open_per_reporter_post`; the first
      // report already carries the information, so this is not an error.
    }
  }

  if (open) {
    return seeOther(request, `/t/${post.threadId}?notice=already-reported`);
  }

  return seeOther(request, `/t/${post.threadId}?notice=reported`);
}
