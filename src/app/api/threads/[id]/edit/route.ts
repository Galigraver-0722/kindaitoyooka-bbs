import { getCurrentUser } from "@/lib/auth";
import { scanPost } from "@/lib/content-filter";
import { recordBlockedAttempt } from "@/lib/content-guard";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { formText, isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";
import { parseTagInput } from "@/lib/tags";
import { validateBody, validateTitle } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?next=${encodeURIComponent(`/t/${id}/edit`)}`);
  }

  const thread = await prisma.thread.findUnique({
    where: { id },
    select: {
      id: true,
      authorId: true,
      createdAt: true,
      isDeleted: true,
      isLocked: true,
      posts: { orderBy: { createdAt: "asc" }, take: 1, select: { id: true } },
    },
  });

  if (!thread || thread.isDeleted) {
    return seeOther(request, "/?error=not-found");
  }
  if (!canEditThread(user.id, thread)) {
    return seeOther(request, `/t/${id}?error=edit-not-allowed`);
  }

  const data = await request.formData();
  const title = formText(data, "title");
  const bodyValue = data.get("body");
  const body = typeof bodyValue === "string" ? bodyValue.trim() : "";
  const tags = parseTagInput(formText(data, "tags"));

  if (!validateTitle(title) || !validateBody(body)) {
    return seeOther(request, `/t/${id}/edit?error=invalid-input`);
  }

  const openingPost = thread.posts[0];
  const scan = scanPost([
    { field: "title", text: title },
    { field: "body", text: body },
    { field: "tags", text: tags.join(" ") },
  ]);

  if (scan.blocked.length > 0) {
    await recordBlockedAttempt({
      userId: user.id,
      surface: "edit",
      hit: scan.blocked[0],
      texts: [title, body, tags.join(" ")],
    });
    return seeOther(request, `/t/${id}/edit?error=blocked-word`);
  }

  const flagged = scan.flagged.map((hit) => hit.term);

  await prisma.$transaction(async (tx) => {
    await tx.thread.update({
      where: { id },
      data: { title, editedAt: new Date() },
    });

    if (openingPost) {
      await tx.post.update({
        where: { id: openingPost.id },
        data: { body },
      });
    }

    await tx.thread.update({ where: { id }, data: { tags: { set: [] } } });
    if (tags.length > 0) {
      await tx.thread.update({
        where: { id },
        data: {
          tags: {
            connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
          },
        },
      });
    }

    if (flagged.length > 0 && openingPost) {
      const alreadyFlagged = await tx.report.findFirst({
        where: { postId: openingPost.id, source: "AUTO", resolvedAt: null },
        select: { id: true },
      });

      if (!alreadyFlagged) {
        await tx.report.create({
          data: {
            postId: openingPost.id,
            reason: `Auto-detected: ${flagged.join(", ")}`,
            source: "AUTO",
          },
        });
      }
    }
  });

  return seeOther(request, `/t/${id}?notice=thread-edited`);
}
