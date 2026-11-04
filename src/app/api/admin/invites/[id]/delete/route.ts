import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { revokeInviteById } from "@/lib/invites";

const BACK = "/admin?tab=invites";

/** Revoke a code that has not been used. Used codes are kept as evidence. */
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
  const removed = await revokeInviteById(id);
  if (!removed) {
    return seeOther(request, `${BACK}&error=invite-not-found`);
  }

  await recordAudit(prisma, {
    actorId: user.id,
    action: "invite.revoke",
    targetType: "invite",
    targetId: id,
  });

  return seeOther(request, `${BACK}&notice=invite-revoked`);
}
