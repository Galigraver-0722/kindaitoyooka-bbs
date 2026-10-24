import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { validateBody, validateTitle } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login?error=login-required");
  }

  const data = await request.formData();
  const boardId = formText(data, "boardId");
  const title = formText(data, "title");
  const bodyValue = data.get("body");
  const body = typeof bodyValue === "string" ? bodyValue.trim() : "";

  const board = boardId
    ? await prisma.board.findUnique({
        where: { id: boardId },
        select: { id: true, slug: true, isArchived: true },
      })
    : null;

  const backToNew = (code: string) => {
    const params = new URLSearchParams({ error: code });
    if (board) {
      params.set("board", board.slug);
    }
    return seeOther(request, `/new?${params.toString()}`);
  };

  if (!board || board.isArchived) {
    return backToNew("board-not-found");
  }
  if (!validateTitle(title) || !validateBody(body)) {
    return backToNew("invalid-input");
  }

  const thread = await prisma.thread.create({
    data: {
      boardId: board.id,
      authorId: user.id,
      title,
      posts: {
        create: {
          authorId: user.id,
          body,
        },
      },
    },
    select: { id: true },
  });

  return seeOther(request, `/t/${thread.id}`);
}
