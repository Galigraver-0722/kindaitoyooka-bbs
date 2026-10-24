import Link from "next/link";
import { ThreadRow } from "@/components/thread-row";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { noticeMessage } from "@/lib/messages";
import { getUnreadThreadIds } from "@/lib/read-state";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ notice }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);

  const [boards, recentThreads, user] = await Promise.all([
    prisma.board.findMany({
      where: { isArchived: false },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { threads: { where: { isDeleted: false } } } },
      },
    }),
    prisma.thread.findMany({
      where: { isDeleted: false },
      orderBy: { lastPostAt: "desc" },
      take: 8,
      include: {
        board: { select: { slug: true, name: true } },
        author: { select: { username: true } },
        tags: { select: { name: true } },
        _count: { select: { posts: true } },
      },
    }),
    getCurrentUser(),
  ]);

  const [unread, bookmarked] = await Promise.all([
    getUnreadThreadIds(user?.id, recentThreads),
    getBookmarkedThreadIds(user?.id, recentThreads.map((thread) => thread.id)),
  ]);
  const signedOutNotice = noticeMessage(notice, locale);

  return (
    <main className="shell page">
      {signedOutNotice ? (
        <p className="notice notice-success mb-10">{signedOutNotice}</p>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div>
          <p className="eyebrow">{m.home.eyebrow}</p>
          <h1 className="hero-title mt-3">{m.home.title}</h1>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.85] text-muted">
            {m.home.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/new" className="btn btn-primary">
              {m.home.startThread}
            </Link>
            <Link href="#boards" className="btn btn-secondary">
              {m.home.browseBoards}
            </Link>
          </div>
        </div>

        <aside
          id="boards"
          className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="eyebrow">{m.home.boards}</h2>
            <span className="num">{String(boards.length).padStart(2, "0")}</span>
          </div>

          <ol className="mt-3">
            {boards.map((board) => (
              <li key={board.id} className="border-t border-line first:border-t-0">
                <Link href={`/b/${board.slug}`} className="group block py-2.5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-ink transition-colors group-hover:text-accent">
                      {board.name}
                    </span>
                    <span className="num">{String(board._count.threads).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-[12.5px] text-muted">
                    {board.description}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="mt-8 border-t border-line pt-5 sm:mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="title-section">{m.home.recent}</h2>
          <span className="meta">{m.home.newestThreads(recentThreads.length)}</span>
        </div>

        {recentThreads.length === 0 ? (
          <p className="mt-6 border-t border-line pt-6 text-[14px] text-muted">{m.home.empty}</p>
        ) : (
          <ol className="mt-4 border-t border-line">
            {recentThreads.map((thread, index) => (
              <ThreadRow
                key={thread.id}
                index={index + 1}
                date={thread.lastPostAt}
                locale={locale}
                thread={{
                  ...thread,
                  replyCount: Math.max(thread._count.posts - 1, 0),
                  isUnread: unread.has(thread.id),
                  bookmarked: user ? bookmarked.has(thread.id) : undefined,
                }}
              />
            ))}
          </ol>
        )}
      </section>

      <section className="mt-8 border-t border-line pt-5 sm:mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="title-section">{m.home.rulesTitle}</h2>
          <span className="eyebrow">01—03</span>
        </div>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {m.home.rules.map((rule, index) => (
            <li key={rule} className="border-t border-line pt-4">
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2.5 text-[14px] leading-[1.85] text-ink/80">{rule}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
