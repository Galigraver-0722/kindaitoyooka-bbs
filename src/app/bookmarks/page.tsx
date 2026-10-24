import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { tagSearchHref } from "@/lib/tags";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).bookmarks.title };
}

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const m = t(locale);

  if (!user) {
    redirect("/login?next=/bookmarks");
  }

  const rows = await prisma.threadBookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      thread: {
        include: {
          board: { select: { slug: true, name: true } },
          author: { select: { username: true } },
          tags: { select: { name: true } },
          _count: { select: { posts: true } },
        },
      },
    },
  });

  const items = rows.filter((row) => !row.thread.isDeleted);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{m.bookmarks.title}</h1>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          {m.bookmarks.empty}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {items.map(({ thread, createdAt }) => (
            <li key={thread.id} className="px-4 py-4 transition hover:bg-slate-50">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Link
                  href={`/b/${thread.board.slug}`}
                  className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-200"
                >
                  {thread.board.name}
                </Link>
                <span>{m.bookmarks.savedAt(formatDateTime(createdAt, locale))}</span>
              </div>
              <Link
                href={`/t/${thread.id}`}
                className="mt-1 block text-base font-medium text-slate-900 hover:text-indigo-700"
              >
                {thread.title}
              </Link>
              <p className="mt-0.5 text-sm text-slate-500">
                {thread.author.username} · {m.thread.replies(Math.max(thread._count.posts - 1, 0))}
              </p>
              {thread.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {thread.tags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={tagSearchHref(tag.name)}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              <form action={`/api/threads/${thread.id}/bookmark`} method="post" className="mt-3">
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
                >
                  {m.thread.unsave}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
