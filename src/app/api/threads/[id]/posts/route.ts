import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isSameOrigin, seeOther } from "@/lib/http";
import { validateBody } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${id}`)}`);
  }

  const thread = await prisma.thread.findUnique({
    where: { id },
    select: { id: true, isLocked: true, isDeleted: true },
  });

  if (!thread || thread.isDeleted) {
    return seeOther(request, "/?error=not-found");
  }
  if (thread.isLocked) {
    return seeOther(request, `/t/${id}?error=thread-locked`);
  }

  const data = await request.formData();
  const bodyValue = data.get("body");
  const body = typeof bodyValue === "string" ? bodyValue.trim() : "";

  if (!validateBody(body)) {
    return seeOther(request, `/t/${id}?error=invalid-input`);
  }

  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: { threadId: id, authorId: user.id, body },
      select: { id: true, createdAt: true },
    });

    await tx.thread.update({
      where: { id },
      data: { lastPostAt: created.createdAt },
    });

    return created;
  });

  return seeOther(request, `/t/${id}#p-${post.id}`);
}
