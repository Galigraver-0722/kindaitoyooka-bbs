import { cookies } from "next/headers";
import { recordAudit } from "@/lib/audit";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { createInviteCodes } from "@/lib/invites";

const BACK = "/admin?tab=invites";

/**
 * Create registration codes from the console. The plaintext codes are shown
 * once: they go into a short-lived HttpOnly cookie so that the redirect does not
 * put them in the URL, where they would land in history and logs.
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
  const rawCount = String(data.get("count") ?? "1");
  const count = Math.min(50, Math.max(1, Number.parseInt(rawCount, 10) || 1));
  const note = String(data.get("note") ?? "").trim().slice(0, 120) || null;

  const codes = await createInviteCodes(count, note);
  await recordAudit(prisma, {
    actorId: user.id,
    action: "invite.create",
    targetType: "invite",
    targetId: codes[0] ? `batch:${count}` : `batch:${count}`,
    details: { count, note },
  });

  const jar = await cookies();
  jar.set("invite_batch", codes.join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 120,
  });

  return seeOther(request, `${BACK}&notice=invite-created`);
}
