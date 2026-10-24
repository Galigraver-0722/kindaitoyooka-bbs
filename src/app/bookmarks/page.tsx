import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThreadRow } from "@/components/thread-row";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";

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
        <p className="mt-6 border-t border-line pt-6 text-[14px] text-muted">
          {m.bookmarks.empty}
        </p>
      ) : (
        <ol className="mt-4 border-t border-line">
          {items.map(({ thread, createdAt }, index) => (
            <ThreadRow
              key={thread.id}
              index={index + 1}
              date={thread.lastPostAt}
              dateLabel={m.bookmarks.savedAt(formatDateTime(createdAt, locale))}
              locale={locale}
              hideWhenInactive
              thread={{
                ...thread,
                replyCount: Math.max(thread._count.posts - 1, 0),
                bookmarked: true,
              }}
            />
          ))}
        </ol>
      )}
    </main>
  );
}
