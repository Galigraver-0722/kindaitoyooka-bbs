import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { getLocale } from "@/lib/i18n";

/**
 * Archive or restore a board. Administrators only: closing a club's board is a
 * site-level decision, not day-to-day moderation.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) {
    return seeOther(request, "/moderation?error=forbidden");
  }

  const { id } = await params;
  const data = await request.formData();
  const action = formText(data, "action") === "restore" ? "restore" : "archive";
  const locale = await getLocale();
  const notice = action === "archive" ? "board-archived" : "board-restored";

  const board = await prisma.board.findUnique({ where: { id }, select: { slug: true, isArchived: true } });
  if (!board) {
    return seeOther(request, `/moderation?error=board-not-found`);
  }

  await prisma.board.update({
    where: { id },
    data: { isArchived: action === "archive" },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: action === "archive" ? "board.archive" : "board.restore",
      targetType: "board",
      targetId: id,
      details: `${locale === "ja" ? "手動" : "Manual"} ${action} of /b/${board.slug}`,
    },
  });

  return seeOther(request, `/moderation?notice=${notice}`);
}
