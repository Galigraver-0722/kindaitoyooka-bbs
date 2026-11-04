import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { retireActiveInviteCode } from "@/lib/invites";

const BACK = "/admin?tab=invites";

/** Stop the current code. Nobody can register until a new one is issued. */
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

  const retired = await retireActiveInviteCode();
  if (!retired) {
    return seeOther(request, `${BACK}&error=invite-not-found`);
  }

  await recordAudit(prisma, {
    actorId: user.id,
    action: "invite.revoke",
    targetType: "invite",
    targetId: "active",
  });

  return seeOther(request, `${BACK}&notice=invite-revoked`);
}
