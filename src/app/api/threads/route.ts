import { getCurrentUser } from "@/lib/auth";
import { detectSensitiveText } from "@/lib/content-filter";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { parseTagInput } from "@/lib/tags";
import { validateBody, validateTitle } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login?error=login-required");
  }

  const limit = await checkRateLimit(
    `thread:${user.id}`,
    RATE_LIMITS.threadCreate.limit,
    RATE_LIMITS.threadCreate.windowMs,
  );
  if (!limit.allowed) {
    return seeOther(request, "/new?error=rate-limited");
  }

  const data = await request.formData();
  const boardId = formText(data, "boardId");
  const title = formText(data, "title");
  const bodyValue = data.get("body");
  const body = typeof bodyValue === "string" ? bodyValue.trim() : "";
  const tags = parseTagInput(formText(data, "tags"));

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

  const flagged = detectSensitiveText(title, body, tags.join(" "));

  const thread = await prisma.$transaction(async (tx) => {
    const created = await tx.thread.create({
      data: {
        boardId: board.id,
        authorId: user.id,
        title,
        ...(tags.length > 0
          ? {
              tags: {
                connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
              },
            }
          : {}),
        posts: {
          create: {
            authorId: user.id,
            body,
          },
        },
      },
      select: {
        id: true,
        posts: {
          orderBy: { createdAt: "asc" },
          take: 1,
          select: { id: true },
        },
      },
    });

    const openingPost = created.posts[0];
    if (flagged.length > 0 && openingPost) {
      await tx.report.create({
        data: {
          postId: openingPost.id,
          reason: `Auto-detected: ${flagged.join(", ")}`,
          source: "AUTO",
        },
      });
    }

    return created;
  });

  return seeOther(request, `/t/${thread.id}`);
}
