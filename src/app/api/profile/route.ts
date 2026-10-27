import { getCurrentUser } from "@/lib/auth";
import { scanPost } from "@/lib/content-filter";
import { recordBlockedAttempt } from "@/lib/content-guard";
import { prisma } from "@/lib/db";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Saves the bio and the two avatar colours of the signed-in user. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login");
  }

  const data = await request.formData();
  const bio = formText(data, "bio").slice(0, 200);
  const avatarColorRaw = formText(data, "avatarColor");
  const avatarRingRaw = formText(data, "avatarRing");
  const avatarColor = HEX.test(avatarColorRaw) ? avatarColorRaw.toLowerCase() : null;
  const avatarRing = HEX.test(avatarRingRaw) ? avatarRingRaw.toLowerCase() : null;

  const scan = scanPost([{ field: "bio", text: bio }]);
  if (scan.blocked.length > 0) {
    await recordBlockedAttempt({
      userId: user.id,
      surface: "profile",
      hit: scan.blocked[0],
      texts: [bio],
    });
    return seeOther(request, `/u/${user.username}?error=blocked-word`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { bio: bio || null, avatarColor, avatarRing },
  });

  return seeOther(request, `/u/${user.username}?notice=profile-saved`);
}
