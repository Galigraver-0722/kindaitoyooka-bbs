import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { isAnnouncementKind, parsePublishedAt } from "@/lib/announcements";
import { validateAnnouncement } from "@/lib/validation";

const BACK = "/admin?tab=announcements";

/** Edit an announcement in place. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }
  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login?next=/admin");
  }
  if (!isAdmin(user)) {
    return seeOther(request, `${BACK}&error=forbidden`);
  }

  const { id } = await params;
  const existing = await prisma.announcement.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return seeOther(request, `${BACK}&error=announcement-not-found`);
  }

  const data = await request.formData();
  const titleJa = formText(data, "titleJa");
  const titleEn = formText(data, "titleEn");
  const bodyJa = formText(data, "bodyJa");
  const bodyEn = formText(data, "bodyEn");
  const kindValue = formText(data, "kind");
  const publishedAt = parsePublishedAt(formText(data, "publishedAt"));
  const isPublished = formText(data, "status") === "published";

  if (!validateAnnouncement({ titleJa, titleEn, bodyJa, bodyEn }) || !publishedAt) {
    return seeOther(request, `${BACK}&error=announcement-invalid&edit=${id}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.announcement.update({
      where: { id },
      data: {
        publishedAt,
        kind: isAnnouncementKind(kindValue) ? kindValue : "notice",
        titleJa,
        titleEn,
        bodyJa,
        bodyEn,
        isPublished,
      },
    });

    await recordAudit(tx, {
      actorId: user.id,
      action: "announcement.update",
      targetType: "announcement",
      targetId: id,
      details: { title: titleJa, published: isPublished },
    });
  });

  return seeOther(request, `${BACK}&notice=announcement-updated&edit=${id}`);
}
