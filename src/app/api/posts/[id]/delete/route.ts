import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?error=login-required&next=${encodeURIComponent("/moderation")}`);
  }
  if (!isModerator(user)) {
    return seeOther(request, `/t/${id}?error=forbidden`);
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { threadId: true },
  });

  if (!post) {
    return seeOther(request, "/?error=not-found");
  }

  await prisma.post.update({
    where: { id },
    data: { isDeleted: true },
  });

  return seeOther(request, `/t/${post.threadId}`);
}
