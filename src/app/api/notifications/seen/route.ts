import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther, wantsJson } from "@/lib/http";

/**
 * Mark the notification inbox as read. The events themselves are derived from
 * existing rows; only this timestamp is stored.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    if (wantsJson(request)) {
      return Response.json({ error: "login-required" }, { status: 401 });
    }
    return seeOther(request, "/login");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { notificationsSeenAt: new Date() },
  });

  if (wantsJson(request)) {
    return Response.json({ ok: true });
  }

  return seeOther(request, "/");
}
