import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import {
  BoardNav,
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
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).meta.title };
}

export const dynamic = "force-dynamic";

const FEED_INCLUDE = {
  board: { select: { slug: true, name: true } },
  author: { select: { username: true, avatarColor: true, avatarRing: true } },
  tags: { select: { name: true } },
  _count: { select: { posts: true } },
} satisfies Prisma.ThreadInclude;

type FeedRow = Prisma.ThreadGetPayload<{ include: typeof FEED_INCLUDE }>;

const num = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string }>;
}) {
  const [{ q, filter, sort }, theme, locale] = await Promise.all([
    searchParams,
    getTheme(),
    getLocale(),
  ]);
  const user = await getCurrentUser();
  const copy = t(locale).shell;
  const sortCopy = t(locale).sort;

  const query = (q ?? "").trim().slice(0, 100);
  const view = filter === "saved" || filter === "mine" ? filter : "all";
  const order = sort === "hot" || sort === "rising" ? sort : "latest";
  const needsLogin = view !== "all" && !user;

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

  const summaries: BoardSummary[] = boards.map((board) => ({
    slug: board.slug,
    name: board.name,
    count: board._count.threads,
    kind: board.kind,
  }));
  const totalThreads = summaries.reduce((sum, board) => sum + board.count, 0);

  const [totalPosts, saved] = await Promise.all([
    prisma.post.count({ where: { isDeleted: false } }),
    user ? prisma.threadBookmark.count({ where: { userId: user.id } }) : Promise.resolve(0),
  ]);

  let rows: FeedRow[] = [];

  if (!needsLogin) {
    const where: Prisma.ThreadWhereInput = { isDeleted: false };
    if (view === "mine" && user) {
      where.authorId = user.id;
    }
    if (view === "saved" && user) {
      const bookmarks = await prisma.threadBookmark.findMany({
        where: { userId: user.id },
        select: { threadId: true },
      });
      where.id = { in: bookmarks.map((row) => row.threadId) };
    }
    if (query) {
      const term = query.startsWith("#") ? query.slice(1) : query;
      where.OR = [
        { title: { contains: term } },
        { posts: { some: { body: { contains: term }, isDeleted: false } } },
        { tags: { some: { name: { contains: term } } } },
      ];
    }

    rows = await prisma.thread.findMany({
      where,
      orderBy: { lastPostAt: "desc" },
      take: order === "latest" ? 30 : 100,
      include: FEED_INCLUDE,
    });
  }

  if (order !== "latest") {
    const ranked = rows.map((row) => ({
      ...row,
      replyCount: Math.max(0, row._count.posts - 1),
    }));
    rows = order === "hot" ? sortByHot(ranked).slice(0, 30) : sortByRising(ranked).slice(0, 30);
  }

  const ids = rows.map((row) => row.id);
  const [bookmarked, liked] = await Promise.all([
    getBookmarkedThreadIds(user?.id, ids),
    getLikedThreadIds(user?.id, ids),
  ]);

  const list: HomeThread[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    board: row.board,
    author: row.author,
    tags: row.tags,
    likeCount: row.likeCount,
    bookmarkCount: row.bookmarkCount,
    liked: liked.has(row.id),
    replyCount: Math.max(0, row._count.posts - 1),
    lastPostAt: row.lastPostAt,
    bookmarked: bookmarked.has(row.id),
    isUnread: false,
    excerpt: "",
  }));

  const href = (patch: { filter?: string; sort?: string }) => {
    const params = new URLSearchParams();
    const nextView = patch.filter !== undefined ? patch.filter : view;
    const nextSort = patch.sort !== undefined ? patch.sort : order;
    if (query) params.set("q", query);
    if (nextView !== "all") params.set("filter", nextView);
    if (nextSort !== "latest") params.set("sort", nextSort);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  const filters = [
    { key: "all", label: copy.filters.all, href: href({ filter: "" }) },
    { key: "saved", label: copy.filters.saved, href: href({ filter: "saved" }) },
    { key: "mine", label: copy.filters.mine, href: href({ filter: "mine" }) },
  ];

  const heading = query
    ? copy.feed.search(query)
    : view === "saved"
      ? copy.feed.saved
      : view === "mine"
        ? copy.feed.mine
        : order === "rising"
          ? copy.feed.rising
          : order === "hot"
            ? copy.feed.hot
            : copy.feed.latest;

  const emptyText = query
    ? copy.empty.search
    : view === "saved"
      ? copy.empty.saved
      : view === "mine"
        ? copy.empty.mine
        : copy.empty.none;

  const maxBoard = Math.max(1, ...summaries.map((board) => board.count));
  const chartBoards = [...summaries].sort((a, b) => b.count - a.count).slice(0, 5);

  const chart = (
    <div className="chart">
      <div className="chart-head">
        <span>BOARD ACTIVITY</span>
        <b>{num(totalThreads)}</b>
      </div>
      <div className="chart-bars">
        {chartBoards.map((board) => (
          <div className="chart-bar" key={board.slug} title={`${board.name} · ${board.count}`}>
            <i style={{ height: `${18 + Math.round((board.count / maxBoard) * 62)}%` }} />
            <span>{board.name}</span>
          </div>
        ))}
      </div>
      <div className="chart-foot">
        {num(summaries.length)} BOARDS · {num(totalPosts)} REPLIES
      </div>
    </div>
  );

  return (
    <ThemedPage theme={theme} username={user?.username ?? null}>
      <main>
        <section className="cover">
          {theme === "light" ? (
            <div className="cover-copy">
              <div className="eyebrow">
                <span className="sticker"><b>●</b> {copy.threadCount(totalThreads)}</span>
                <span className="sticker">{copy.replyCount(totalPosts)}</span>
                <span className="sticker">{copy.boardCount(summaries.length)}</span>
              </div>
              <h1>{copy.cover.dLead}<mark>{copy.cover.dAccent}</mark>{copy.cover.dTail}</h1>
              <p className="lede">{copy.cover.dLede}</p>
            </div>
          ) : (
            <div className="cover-copy">
              <p className="kicker"><b>[ 01 ]</b> student network / since 2026</p>
              <h1>{copy.cover.bLead}<span className="fade">{copy.cover.bAccent}</span>{copy.cover.bTail}</h1>
              <p className="lede">{copy.cover.bLede}</p>
              <div className="cover-stats">
                <span><b>{num(totalThreads)}</b> THREADS</span>
                <span><b>{num(totalPosts)}</b> REPLIES</span>
                <span><b>{num(summaries.length)}</b> BOARDS</span>
                <span><b>{num(saved)}</b> SAVED</span>
              </div>
            </div>
          )}
          {chart}
        </section>

        <div className="feed-cols">
          <aside className="feed-side">
            <div>
              <h2 className="side-title">{copy.boards}</h2>
              <BoardNav boards={summaries} />
            </div>
          </aside>

          <div className="feed-body">
            <div className="feed-bar">
              <h2><span className="tick" />{heading}</h2>
              <span className="hub-sort">
                <Link className={order === "latest" ? "on" : ""} href={href({ sort: "" })}>{sortCopy.latest}</Link>
                <Link className={order === "hot" ? "on" : ""} href={href({ sort: "hot" })}>{sortCopy.hot}</Link>
                <Link className={order === "rising" ? "on" : ""} href={href({ sort: "rising" })}>{sortCopy.rising}</Link>
              </span>
            </div>

            <div className="hub-tabs">
              {filters.map((tab) => (
                <Link key={tab.key} className={view === tab.key ? "on" : ""} href={tab.href}>
                  {tab.label}
                </Link>
              ))}
              {query ? <Link className="hub-clear" href={href({})}>{copy.clearSearch}</Link> : null}
            </div>

            {needsLogin ? (
              <p className="empty">
                {copy.loginNeeded} <Link href="/login">{t(locale).nav.logIn}</Link>
              </p>
            ) : list.length === 0 ? (
              <p className="empty">{emptyText}</p>
            ) : theme === "light" ? (
              <ThreadCards threads={list} />
            ) : (
              <ThreadRows threads={list} />
            )}
          </div>
        </div>
      </main>
    </ThemedPage>
  );
}
