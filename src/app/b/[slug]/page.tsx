import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {
  BoardNav,
  Crumb,
  ThemedPage,
  ThreadCards,
  ThreadRows,
  type BoardSummary,
} from "@/components/theme/themed-page";
import type { HomeThread } from "@/components/home/types";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { getLikedThreadIds } from "@/lib/likes";
import { prisma } from "@/lib/db";
import { sortByHot } from "@/lib/hot";
import { sortByRising } from "@/lib/rising";
import { errorMessage } from "@/lib/messages";
import { boardPageHref, parsePage, THREADS_PER_PAGE, totalPages } from "@/lib/pagination";
import { parseSuggestedTags } from "@/lib/tags";
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";

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
  const [{ slug }, { error, sort, page }, theme, locale] = await Promise.all([
    params,
    searchParams,
    getTheme(),
    getLocale(),
  ]);
  const copy = t(locale).shell;
  const sortCopy = t(locale).sort;
  const order = sort === "hot" || sort === "rising" ? sort : "latest";

  const [board, user] = await Promise.all([
    prisma.board.findUnique({
      where: { slug },
      include: { _count: { select: { threads: { where: { isDeleted: false } } } } },
    }),
    getCurrentUser(),
  ]);

  if (!board) notFound();

  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
    select: {
      slug: true,
      name: true,
      kind: true,
      _count: { select: { threads: { where: { isDeleted: false } } } },
    },
  });
  const summaries: BoardSummary[] = boards.map((row) => ({
    slug: row.slug,
    name: row.name,
    count: row._count.threads,
    kind: row.kind,
  }));

  const where = { boardId: board.id, isDeleted: false };
  const requestedPage = parsePage(page);
  let currentPage = 1;
  let pageCount = 1;
  let threads: BoardThread[] = [];

  if (order === "latest") {
    pageCount = totalPages(board._count.threads);
    currentPage = Math.min(requestedPage, pageCount);
    threads = await prisma.thread.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { lastPostAt: "desc" }],
      skip: (currentPage - 1) * THREADS_PER_PAGE,
      take: THREADS_PER_PAGE,
      include: THREAD_INCLUDE,
    });
  } else {
    const candidates = await prisma.thread.findMany({
      where,
      orderBy: { lastPostAt: "desc" },
      take: 100,
      include: THREAD_INCLUDE,
    });
    const ranked = candidates.map((thread) => ({
      ...thread,
      replyCount: Math.max(thread._count.posts - 1, 0),
    }));
    const sorted =
      order === "hot"
        ? sortByHot(ranked).slice(0, THREADS_PER_PAGE)
        : sortByRising(ranked).slice(0, THREADS_PER_PAGE);
    threads = sorted.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }

  const ids = threads.map((thread) => thread.id);
  const [bookmarked, liked] = await Promise.all([
    getBookmarkedThreadIds(user?.id, ids),
    getLikedThreadIds(user?.id, ids),
  ]);
  const list: HomeThread[] = threads.map((thread) => ({
    id: thread.id,
    title: thread.title,
    board: thread.board,
    author: thread.author,
    tags: thread.tags,
    likeCount: thread.likeCount,
    bookmarkCount: thread.bookmarkCount,
    liked: liked.has(thread.id),
    replyCount: Math.max(0, thread._count.posts - 1),
    lastPostAt: thread.lastPostAt,
    bookmarked: bookmarked.has(thread.id),
    isUnread: false,
    excerpt: "",
  }));
  const errorText = errorMessage(error, "ja");
  const suggested = parseSuggestedTags(board.suggestedTags).slice(0, 5);

  const sortHref = (next: string) => {
    const params = new URLSearchParams();
    if (next !== "latest") params.set("sort", next);
    const qs = params.toString();
    return qs ? `/b/${board.slug}?${qs}` : `/b/${board.slug}`;
  };

  const heading =
    order === "rising" ? copy.feed.rising : order === "hot" ? copy.feed.hot : copy.feed.latest;

  return (
    <ThemedPage theme={theme} username={user?.username ?? null} active="boards" boardSlug={board.slug}>
      <main>
        <section className="banner">
          <div className="page-head">
            <Crumb items={[{ href: "/", label: copy.boards }, { label: board.name }]} />
            <h1>{board.name}</h1>
            <p className="lede">{board.description}</p>
            <div className="row-meta">
              <span className={`pill kind ${board.kind === "COMMUNITY" ? "comm" : ""}`}>
                {board.kind === "COMMUNITY" ? copy.communityTag : copy.official}
              </span>
              <span className="pill">{copy.posts(board._count.threads)}</span>
              {suggested.map((tag) => (
                <Link className="pill" href={`/?q=${encodeURIComponent(`#${tag}`)}`} key={tag}>#{tag}</Link>
              ))}
              <Link className="pill pill-action" href={`/new?board=${board.slug}`}>{copy.newThread}</Link>
            </div>
          </div>
        </section>

        <div className="feed-cols">
          <aside className="feed-side">
            <div>
              <h2 className="side-title">{copy.boards}</h2>
              <BoardNav boards={summaries} activeSlug={board.slug} />
            </div>
          </aside>

          <div className="feed-body">
            <div className="feed-bar">
              <h2><span className="tick" />{heading}</h2>
              <span className="hub-sort">
                <Link className={order === "latest" ? "on" : ""} href={sortHref("latest")}>{sortCopy.latest}</Link>
                <Link className={order === "hot" ? "on" : ""} href={sortHref("hot")}>{sortCopy.hot}</Link>
                <Link className={order === "rising" ? "on" : ""} href={sortHref("rising")}>{sortCopy.rising}</Link>
              </span>
            </div>

            {errorText ? <p className="notice error">{errorText}</p> : null}

            {list.length === 0 ? (
              <p className="empty">
                {copy.empty.none}
                <br />
                <Link href={`/new?board=${board.slug}`}>{copy.newThread}</Link>
              </p>
            ) : theme === "light" ? (
              <ThreadCards threads={list} />
            ) : (
              <ThreadRows threads={list} />
            )}

            {order === "latest" && pageCount > 1 ? (
              <nav className="pager">
                {currentPage > 1 ? (
                  <Link href={boardPageHref(board.slug, { page: currentPage - 1, sort: order })}>← {locale === "ja" ? "前へ" : "Prev"}</Link>
                ) : null}
                <span>{currentPage} / {pageCount}</span>
                {currentPage < pageCount ? (
                  <Link href={boardPageHref(board.slug, { page: currentPage + 1, sort: order })}>{locale === "ja" ? "次へ" : "Next"} →</Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </main>
    </ThemedPage>
  );
}
