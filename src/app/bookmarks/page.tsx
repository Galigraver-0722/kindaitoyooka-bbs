import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { tagSearchHref } from "@/lib/tags";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).bookmarks.title };
}

export const dynamic = "force-dynamic";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, user, locale] = await Promise.all([
    searchParams,
    getCurrentUser(),
    getLocale(),
  ]);
  const m = t(locale);
  const errorText = errorMessage(error, locale);

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
    <main className="shell page">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">{m.bookmarks.title}</p>
        <h1 className="title-page mt-3">{m.bookmarks.title}</h1>
        <p className="meta mt-3">{m.search.resultCount(items.length)}</p>
      </header>

      {errorText ? <p className="notice notice-error mt-6">{errorText}</p> : null}

      {items.length === 0 ? (
        <p className="mt-8 border-t border-line pt-8 text-[13px] text-muted">
          {m.bookmarks.empty}
        </p>
      ) : (
        <ol className="mt-2 divide-y divide-line">
          {items.map(({ thread, createdAt }, index) => (
            <li key={thread.id} className="grid grid-cols-[2.2rem_1fr] gap-4 py-5 sm:grid-cols-[2.75rem_1fr_auto]">
              <span className="num pt-1">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link href={`/b/${thread.board.slug}`} className="eyebrow hover:text-ink">
                    {thread.board.name}
                  </Link>
                  <span className="meta">{m.bookmarks.savedAt(formatDateTime(createdAt, locale))}</span>
                </div>
                <Link
                  href={`/t/${thread.id}`}
                  className="mt-2 block text-[17px] font-medium leading-snug tracking-[-0.012em] text-ink transition-colors hover:text-accent"
                >
                  {thread.title}
                </Link>
                <p className="mt-1 text-[12px] text-muted">
                  {thread.author.username} / {m.thread.replies(Math.max(thread._count.posts - 1, 0))}
                </p>
                {thread.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {thread.tags.map((tag) => (
                      <Link key={tag.name} href={tagSearchHref(tag.name)} className="tag">
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <form action={`/api/threads/${thread.id}/bookmark`} method="post" className="col-start-2 self-start sm:col-start-3">
                <button type="submit" className="btn-quiet">
                  {m.thread.unsave}
                </button>
              </form>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
