import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
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
  author: { select: { username: true } },
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

  const unread = await getUnreadThreadIds(user?.id, threads);
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
            className={`-mb-px border-b-2 pb-3 text-[12px] transition-colors ${
              order === "latest"
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m.sort.latest}
          </Link>
          <Link
            href={`/b/${board.slug}?sort=hot`}
            className={`-mb-px border-b-2 pb-3 text-[12px] transition-colors ${
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
        <p className="mt-10 border-t border-line pt-10 text-[13px] text-muted">
          {m.board.empty}
        </p>
      ) : (
        <ol className="mt-2 divide-y divide-line">
          {threads.map((thread, index) => (
            <li key={thread.id}>
              <Link
                href={`/t/${thread.id}`}
                className="group row-hover -mx-3 grid grid-cols-[2.2rem_1fr] gap-4 px-3 py-5 sm:grid-cols-[2.75rem_1fr]"
              >
                <span className="num pt-1">
                  {String((currentPage - 1) * THREADS_PER_PAGE + index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {thread.isPinned ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                        {m.board.pinned}
                      </span>
                    ) : null}
                    {thread.isLocked ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {m.board.locked}
                      </span>
                    ) : null}
                    {unread.has(thread.id) ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {m.board.unread}
                      </span>
                    ) : null}
                    <time className="meta">{formatDateTime(thread.lastPostAt, locale)}</time>
                  </div>
                  <h2 className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.012em] text-ink transition-colors duration-150 group-hover:text-accent">
                    {thread.title}
                  </h2>
                  <p className="mt-1 text-[12px] text-muted">
                    {m.board.threadMeta(
                      thread.author.username,
                      Math.max(thread._count.posts - 1, 0),
                    )}
                  </p>
                </div>
              </Link>
            </li>
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
