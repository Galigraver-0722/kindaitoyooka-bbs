import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";

const BACK = "/admin?tab=announcements";

/** Remove an announcement. The audit row keeps the fact that it existed. */
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
  const existing = await prisma.announcement.findUnique({
    where: { id },
    select: { id: true, titleJa: true },
  });
  if (!existing) {
    return seeOther(request, `${BACK}&error=announcement-not-found`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.announcement.delete({ where: { id } });
    await recordAudit(tx, {
      actorId: user.id,
      action: "announcement.delete",
      targetType: "announcement",
      targetId: id,
      details: { title: existing.titleJa },
    });
  });

  return seeOther(request, `${BACK}&notice=announcement-deleted`);
}
