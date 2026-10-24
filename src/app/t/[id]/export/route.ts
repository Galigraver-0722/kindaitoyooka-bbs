import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getLocale()]);
  const m = t(locale);

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      board: { select: { name: true } },
      author: { select: { username: true } },
      tags: { select: { name: true }, orderBy: { name: "asc" } },
      posts: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { username: true } } },
      },
    },
  });

  if (!thread || thread.isDeleted) {
    return new Response("Not found", { status: 404 });
  }

  const header = [
    thread.title,
    "",
    `${m.exportThread.board}: ${thread.board.name}`,
    `${m.exportThread.author}: ${thread.author.username}`,
    `${m.exportThread.created}: ${formatDateTime(thread.createdAt, locale)}`,
  ];

  if (thread.tags.length > 0) {
    header.push(`${m.exportThread.tags}: ${thread.tags.map((tag) => `#${tag.name}`).join(" ")}`);
  }

  const posts = thread.posts.map((post) => {
    const meta = `${post.author.username} · ${formatDateTime(post.createdAt, locale)}`;
    const body = post.isDeleted ? m.exportThread.removed : post.body;
    return `${meta}\n\n${body}`;
  });

  const text = `${header.join("\n")}\n\n${m.exportThread.separator}\n\n${posts.join(
    `\n\n${m.exportThread.separator}\n\n`,
  )}\n`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="thread-${thread.id}.txt"`,
      "Cache-Control": "no-store",
    },
  });
}
