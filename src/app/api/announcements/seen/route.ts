import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther, wantsJson } from "@/lib/http";

/**
 * Mark the announcements panel as read for the signed-in account. Guests have
 * no row to write, so the endpoint answers 401 and the panel simply keeps no
 * dot for them.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    if (wantsJson(request)) {
      return Response.json({ ok: false }, { status: 401 });
    }
    return seeOther(request, "/login");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { announcementsSeenAt: new Date() },
  });

  if (wantsJson(request)) {
    return Response.json({ ok: true });
  }
  return seeOther(request, "/");
}
