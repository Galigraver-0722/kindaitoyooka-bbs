import { getCurrentUser } from "@/lib/auth";
import { detectSensitiveText } from "@/lib/content-filter";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther, wantsJson } from "@/lib/http";
import { getLocale } from "@/lib/i18n";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { parseTagInput } from "@/lib/tags";
import { formatDateTime } from "@/lib/format";
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

  const limit = await checkRateLimit(
    `reply:${user.id}`,
    RATE_LIMITS.reply.limit,
    RATE_LIMITS.reply.windowMs,
  );
  if (!limit.allowed) {
    return seeOther(request, `/t/${id}?error=rate-limited`);
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
  const tags = parseTagInput(formText(data, "tags"));
  const parentValue = formText(data, "parentId");

  let parentId: string | null = null;

  if (parentValue) {
    const parent = await prisma.post.findUnique({
      where: { id: parentValue },
      select: { id: true, parentId: true, threadId: true, isDeleted: true },
    });

    if (!parent || parent.threadId !== id || parent.isDeleted) {
      return seeOther(request, `/t/${id}?error=invalid-input`);
    }

    let depth = 0;
    let cursor: { parentId: string | null } | null = parent;
    while (cursor?.parentId && depth < 10) {
      cursor = await prisma.post.findUnique({
        where: { id: cursor.parentId },
        select: { parentId: true },
      });
      depth += 1;
    }
    if (depth >= 10) {
      return seeOther(request, `/t/${id}?error=invalid-input`);
    }

    parentId = parent.id;
  }

  if (!validateBody(body)) {
    return seeOther(request, `/t/${id}?error=invalid-input`);
  }

  const flagged = detectSensitiveText(body, tags.join(" "));

  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: { threadId: id, authorId: user.id, body, parentId },
      select: { id: true, createdAt: true },
    });

    await tx.thread.update({
      where: { id },
      data: {
        lastPostAt: created.createdAt,
        ...(tags.length > 0
          ? {
              tags: {
                connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
              },
            }
          : {}),
      },
    });

    if (flagged.length > 0) {
      await tx.report.create({
        data: {
          postId: created.id,
          reason: `Auto-detected: ${flagged.join(", ")}`,
          source: "AUTO",
        },
      });
    }

    return created;
  });

  if (wantsJson(request)) {
    const author = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true, role: true, avatarColor: true, avatarRing: true },
    });

    return Response.json(
      {
        comment: {
          id: post.id,
          number: "",
          body,
          author: author ?? {
            username: user.username,
            role: user.role,
            avatarColor: null,
            avatarRing: null,
          },
          createdAt: formatDateTime(post.createdAt, await getLocale()),
          likeCount: 0,
          liked: false,
          children: [],
        },
      },
      { status: 201 },
    );
  }

  return seeOther(request, `/t/${id}#p-${post.id}`);
}
