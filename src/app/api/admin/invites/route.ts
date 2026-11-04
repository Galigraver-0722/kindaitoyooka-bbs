import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { issueInviteCode } from "@/lib/invites";

const BACK = "/admin?tab=invites";

/**
 * Issue the registration code. Only one code is active at a time, so issuing a
 * new one retires the old one. The value is stored on the row and shown in the
 * console, so an administrator can read it whenever it is needed.
 */
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
  const note = String(data.get("note") ?? "").trim().slice(0, 120) || null;

  await issueInviteCode(note);
  await recordAudit(prisma, {
    actorId: user.id,
    action: "invite.create",
    targetType: "invite",
    targetId: "active",
    details: { note },
  });

  return seeOther(request, `${BACK}&notice=invite-created`);
}
