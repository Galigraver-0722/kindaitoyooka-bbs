import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ThreadRow } from "@/components/thread-row";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { prisma } from "@/lib/db";
import { sortByHot } from "@/lib/hot";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import {
  boardPageHref,
  parsePage,
  THREADS_PER_PAGE,
  totalPages,
} from "@/lib/pagination";
import { getUnreadThreadIds } from "@/lib/read-state";

export const dynamic = "force-dynamic";

const THREAD_INCLUDE = {
  board: { select: { slug: true, name: true } },
  author: { select: { username: true } },
  tags: { select: { name: true } },
  _count: { select: { posts: true } },
} satisfies Prisma.ThreadInclude;

type BoardThread = Prisma.ThreadGetPayload<{ include: typeof THREAD_INCLUDE }>;

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; sort?: string; page?: string }>;
}) {
  const [{ slug }, { error, sort, page }, locale] = await Promise.all([
    params,
    searchParams,
    getLocale(),
  ]);
  const order = sort === "hot" ? "hot" : "latest";
  const m = t(locale);

  const [board, user] = await Promise.all([
    prisma.board.findUnique({
      where: { slug },
      include: {
        _count: { select: { threads: { where: { isDeleted: false } } } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!board) {
    notFound();
  }

  const where = { boardId: board.id, isDeleted: false };
  const requestedPage = parsePage(page);
  let currentPage = 1;
  let pageCount = 1;
  let totalCount = 0;
  let threads: BoardThread[] = [];

  if (order === "hot") {
    // "Hot" is computed in application code over the top 100 candidates, so
    // paginate the ranked list instead of the database query.
    const candidates = await prisma.thread.findMany({
      where,
      orderBy: { lastPostAt: "desc" },
      take: 100,
      include: THREAD_INCLUDE,
    });

    const ranked = sortByHot(
      candidates.map((thread) => ({
        ...thread,
        replyCount: Math.max(thread._count.posts - 1, 0),
      })),
    ).sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

    totalCount = ranked.length;
    pageCount = totalPages(totalCount);
    currentPage = Math.min(requestedPage, pageCount);
    threads = ranked.slice(
      (currentPage - 1) * THREADS_PER_PAGE,
      currentPage * THREADS_PER_PAGE,
    );
  } else {
    totalCount = board._count.threads;
    pageCount = totalPages(totalCount);
    currentPage = Math.min(requestedPage, pageCount);

    threads = await prisma.thread.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { lastPostAt: "desc" }],
      skip: (currentPage - 1) * THREADS_PER_PAGE,
      take: THREADS_PER_PAGE,
      include: THREAD_INCLUDE,
    });
  }

  const [unread, bookmarked] = await Promise.all([
    getUnreadThreadIds(user?.id, threads),
    getBookmarkedThreadIds(user?.id, threads.map((thread) => thread.id)),
  ]);
  const errorText = errorMessage(error, locale);

  return (
    <main className="shell page">
      <Breadcrumbs
        items={[
          { href: "/", label: m.board.breadcrumb },
          { label: board.name },
        ]}
      />

      <header className="mt-8 grid gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="title-page">{board.name}</h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.85] text-muted">
            {board.description}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <div className="text-right">
            <p
              className="font-mono text-[26px] leading-none tabular-nums"
              aria-label={m.board.visibleThreads(board._count.threads)}
            >
              {String(board._count.threads).padStart(2, "0")}
            </p>
          </div>
          <Link href={`/new?board=${board.slug}`} className="btn btn-primary">
            {m.board.newThread}
          </Link>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <div className="flex gap-6">
          <Link
            href={`/b/${board.slug}?sort=latest`}
            className={`-mb-px border-b-2 pb-3 text-[13.5px] transition-colors ${
              order === "latest"
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m.sort.latest}
          </Link>
          <Link
            href={`/b/${board.slug}?sort=hot`}
            className={`-mb-px border-b-2 pb-3 text-[13.5px] transition-colors ${
              order === "hot"
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m.sort.hot}
          </Link>
        </div>
        <span className="meta pb-3">
          {String(currentPage).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
        </span>
      </div>

      {errorText ? <p className="notice notice-error mt-6">{errorText}</p> : null}

      {totalCount === 0 ? (
        <p className="mt-6 border-t border-line pt-6 text-[14px] text-muted">
          {m.board.empty}
        </p>
      ) : (
        <ol className="mt-4 border-t border-line">
          {threads.map((thread, index) => (
            <ThreadRow
              key={thread.id}
              index={(currentPage - 1) * THREADS_PER_PAGE + index + 1}
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

      {pageCount > 1 ? (
        <nav
          className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-4"
          aria-label={m.board.pageStatus(currentPage, pageCount)}
        >
          {currentPage > 1 ? (
            <Link
              href={boardPageHref(board.slug, { page: currentPage - 1, sort: order })}
              className="btn-quiet"
            >
              ← {m.board.pagePrevious}
            </Link>
          ) : (
            <span />
          )}
          <span className="meta">
            {String(currentPage).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
          </span>
          {currentPage < pageCount ? (
            <Link
              href={boardPageHref(board.slug, { page: currentPage + 1, sort: order })}
              className="btn-quiet"
            >
              {m.board.pageNext} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </main>
  );
}
