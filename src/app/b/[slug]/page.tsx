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
import { prisma } from "@/lib/db";
import { sortByHot } from "@/lib/hot";
import { sortByRising } from "@/lib/rising";
import { errorMessage } from "@/lib/messages";
import { boardPageHref, parsePage, THREADS_PER_PAGE, totalPages } from "@/lib/pagination";
import { parseSuggestedTags } from "@/lib/tags";
import { getTheme } from "@/lib/theme";

export const dynamic = "force-dynamic";

const THREAD_INCLUDE = {
  board: { select: { slug: true, name: true } },
  author: { select: { username: true } },
  tags: { select: { name: true } },
  _count: { select: { posts: true } },
} satisfies Prisma.ThreadInclude;

type BoardThread = Prisma.ThreadGetPayload<{ include: typeof THREAD_INCLUDE }>;

const num = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; sort?: string; page?: string }>;
}) {
  const [{ slug }, { error, sort, page }, theme] = await Promise.all([
    params,
    searchParams,
    getTheme(),
  ]);
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
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      _count: { select: { threads: { where: { isDeleted: false } } } },
    },
  });
  const summaries: BoardSummary[] = boards.map((row) => ({
    slug: row.slug,
    name: row.name,
    count: row._count.threads,
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

  const bookmarked = await getBookmarkedThreadIds(user?.id, threads.map((thread) => thread.id));
  const list: HomeThread[] = threads.map((thread) => ({
    id: thread.id,
    title: thread.title,
    board: thread.board,
    author: thread.author,
    tags: thread.tags,
    likeCount: thread.likeCount,
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

  return (
    <ThemedPage theme={theme} username={user?.username ?? null} active="boards">
      <main>
        <section className="banner">
          <div className="page-head">
            <Crumb items={[{ href: "/", label: "ホーム" }, { label: board.name }]} />
            <h1>{board.name}</h1>
            <p className="lede">{board.description}</p>
            <div className="row-meta">
              <span className="pill">{num(board._count.threads)} スレッド</span>
              {suggested.map((tag) => (
                <Link className="pill" href={`/?q=${encodeURIComponent(`#${tag}`)}`} key={tag}>#{tag}</Link>
              ))}
              <Link className="pill pill-action" href={`/new?board=${board.slug}`}>＋ 投稿する</Link>
            </div>
          </div>
        </section>

        <div className="feed-cols">
          <aside className="feed-side">
            <div>
              <h2 className="side-title">ボード</h2>
              <BoardNav boards={summaries} activeSlug={board.slug} />
            </div>
          </aside>

          <div className="feed-body">
            <div className="feed-bar">
              <h2><span className="tick" />{order === "rising" ? "急上昇" : order === "hot" ? "人気" : "新しい順"}</h2>
              <span className="hub-sort">
                <Link className={order === "latest" ? "on" : ""} href={sortHref("latest")}>新着</Link>
                <Link className={order === "hot" ? "on" : ""} href={sortHref("hot")}>人気</Link>
                <Link className={order === "rising" ? "on" : ""} href={sortHref("rising")}>急上昇</Link>
              </span>
            </div>

            {errorText ? <p className="notice error">{errorText}</p> : null}

            {list.length === 0 ? (
              <p className="empty">
                {order === "rising"
                  ? "いま急上昇しているスレッドはありません。"
                  : order === "hot"
                    ? "まだ人気のスレッドがありません。"
                    : "このボードにはまだスレッドがありません。最初の 1 本を立ててみませんか。"}
                {order === "latest" ? (
                  <>
                    <br />
                    <Link href={`/new?board=${board.slug}`}>＋ 投稿する</Link>
                  </>
                ) : null}
              </p>
            ) : theme === "light" ? (
              <ThreadCards threads={list} />
            ) : (
              <ThreadRows threads={list} />
            )}

            {order === "latest" && pageCount > 1 ? (
              <nav className="pager">
                {currentPage > 1 ? (
                  <Link href={boardPageHref(board.slug, { page: currentPage - 1, sort: order })}>← 前へ</Link>
                ) : null}
                <span>{currentPage} / {pageCount}</span>
                {currentPage < pageCount ? (
                  <Link href={boardPageHref(board.slug, { page: currentPage + 1, sort: order })}>次へ →</Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </main>
    </ThemedPage>
  );
}
