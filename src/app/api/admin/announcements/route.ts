import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { isAnnouncementKind, parsePublishedAt } from "@/lib/announcements";
import { validateAnnouncement } from "@/lib/validation";

const BACK = "/admin?tab=announcements";

/** Create an announcement. Only administrators may write them. */
export async function POST(request: Request) {
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

  const data = await request.formData();
  const titleJa = formText(data, "titleJa");
  const titleEn = formText(data, "titleEn");
  const bodyJa = formText(data, "bodyJa");
  const bodyEn = formText(data, "bodyEn");
  const kindValue = formText(data, "kind");
  const publishedAt = parsePublishedAt(formText(data, "publishedAt"));
  const isPublished = formText(data, "status") === "published";

  if (!validateAnnouncement({ titleJa, titleEn, bodyJa, bodyEn }) || !publishedAt) {
    return seeOther(request, `${BACK}&error=announcement-invalid`);
  }

  const announcement = await prisma.$transaction(async (tx) => {
    const created = await tx.announcement.create({
      data: {
        publishedAt,
        kind: isAnnouncementKind(kindValue) ? kindValue : "notice",
        titleJa,
        titleEn,
        bodyJa,
        bodyEn,
        // A draft is saved but never rendered; the panel only reads published rows.
        isPublished,
        createdById: user.id,
      },
      select: { id: true },
    });

    await recordAudit(tx, {
      actorId: user.id,
      action: "announcement.create",
      targetType: "announcement",
      targetId: created.id,
      details: { title: titleJa, published: isPublished },
    });

    return created;
  });

  return seeOther(request, `${BACK}&notice=announcement-created&edit=${announcement.id}`);
}
