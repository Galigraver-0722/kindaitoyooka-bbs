import Link from "next/link";
import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import {
  BoardNav,
  ThemedPage,
  ThreadCards,
  ThreadRows,
  type BoardSummary,
} from "@/components/theme/themed-page";
import type { HomeThread } from "@/components/home/types";
import { openingPostExcerpt } from "@/lib/excerpt";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { getLikedThreadIds } from "@/lib/likes";
import { getUnreadThreadIds } from "@/lib/read-state";
import { sortByRelevance } from "@/lib/search";
import { prisma } from "@/lib/db";
import { sortByHot } from "@/lib/hot";
import { sortByRising } from "@/lib/rising";
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";
import { parsePage, THREADS_PER_PAGE, totalPages } from "@/lib/pagination";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).meta.title };
}

export const dynamic = "force-dynamic";

/** Upper bound on rows pulled for in-app ranking; ~50x the seeded corpus. */
const SEARCH_CANDIDATES = 200;
/** Hot and rising read the newest 100 threads; farther back is archive material. */
const RANKED_CANDIDATES = 100;

const FEED_INCLUDE = {
  board: { select: { slug: true, name: true } },
  author: { select: { username: true, avatarColor: true, avatarRing: true } },
  tags: { select: { name: true } },
  // The opening post only, for the excerpt under the title.
  posts: { orderBy: { createdAt: "asc" }, take: 1, select: { body: true, isDeleted: true } },
  _count: { select: { posts: true } },
} satisfies Prisma.ThreadInclude;

type FeedRow = Prisma.ThreadGetPayload<{ include: typeof FEED_INCLUDE }>;

const num = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string; page?: string }>;
}) {
  const [{ q, filter, sort, page }, theme, locale] = await Promise.all([
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
    prisma.post.count({ where: { isDeleted: false, thread: { isDeleted: false } } }),
    user ? prisma.threadBookmark.count({ where: { userId: user.id } }) : Promise.resolve(0),
  ]);

  let rows: FeedRow[] = [];
  let totalMatches = 0;
  let currentPage = 1;
  let pageCount = 1;

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

    if (!query && order === "latest") {
      // The plain feed is the one view the database can page directly: count
      // the matches, then read only the window the reader asked for.
      totalMatches = await prisma.thread.count({ where });
      pageCount = totalPages(totalMatches);
      currentPage = Math.min(parsePage(page), pageCount);
      rows = await prisma.thread.findMany({
        where,
        orderBy: { lastPostAt: "desc" },
        skip: (currentPage - 1) * THREADS_PER_PAGE,
        take: THREADS_PER_PAGE,
        include: FEED_INCLUDE,
      });
    } else {
      // Search and the ranked views need the candidate set in memory, so they
      // page over the ranked array instead of over the table.
      const candidates = await prisma.thread.findMany({
        where,
        orderBy: { lastPostAt: "desc" },
        take: query ? SEARCH_CANDIDATES : RANKED_CANDIDATES,
        include: FEED_INCLUDE,
      });
      const withReplies = candidates.map((row) => ({
        ...row,
        replyCount: Math.max(0, row._count.posts - 1),
      }));

      if (query) {
        // Keep at most eight bodies per thread for ranking. A single SQL
        // window keeps this bounded; reading every body of every candidate
        // grew linearly with the archive.
        const ids = withReplies.map((row) => row.id);
        const bodies = ids.length === 0 ? [] : await prisma.$queryRaw<
          Array<{ threadId: string; body: string }>
        >(Prisma.sql`
          SELECT "threadId", "body" FROM (
            SELECT "threadId", "body",
              ROW_NUMBER() OVER (PARTITION BY "threadId" ORDER BY "createdAt") AS rn
            FROM "Post"
            WHERE "threadId" IN (${Prisma.join(ids)}) AND "isDeleted" = 0
          ) WHERE rn <= 8
        `);
        const bodiesByThread = new Map<string, string[]>();
        for (const post of bodies) {
          const list = bodiesByThread.get(post.threadId) ?? [];
          if (list.length < 8) list.push(post.body);
          bodiesByThread.set(post.threadId, list);
        }

        const rankable = withReplies.map((row) => ({
          ...row,
          tagNames: row.tags.map((tag) => tag.name),
          bodies: bodiesByThread.get(row.id) ?? [],
        }));

        const ranked = sortByRelevance(query, rankable);
        rows =
          order === "hot" ? sortByHot(ranked) : order === "rising" ? sortByRising(ranked) : ranked;
      } else {
        rows = order === "hot" ? sortByHot(withReplies) : sortByRising(withReplies);
      }

      totalMatches = rows.length;
      pageCount = totalPages(totalMatches);
      currentPage = Math.min(parsePage(page), pageCount);
      rows = rows.slice(
        (currentPage - 1) * THREADS_PER_PAGE,
        currentPage * THREADS_PER_PAGE,
      );
    }
  }

  const ids = rows.map((row) => row.id);
  const [bookmarked, liked, unread] = await Promise.all([
    getBookmarkedThreadIds(user?.id, ids),
    getLikedThreadIds(user?.id, ids),
    getUnreadThreadIds(user?.id, rows),
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
    isUnread: unread.has(row.id),
    excerpt: openingPostExcerpt(row.posts[0]),
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

  const feedPageHref = (target: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (view !== "all") params.set("filter", view);
    if (order !== "latest") params.set("sort", order);
    if (target > 1) params.set("page", String(target));
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
              <h2>
                <span className="tick" />{heading}
                {query ? <span className="feed-count">{copy.searchCount(totalMatches)}</span> : null}
              </h2>
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
              <ThreadCards threads={list} locale={locale} query={query || undefined} />
            ) : (
              <ThreadRows threads={list} locale={locale} query={query || undefined} />
            )}

            {pageCount > 1 ? (
              <nav className="pager" aria-label={t(locale).pages.pager.prev}>
                {currentPage > 1 ? (
                  <Link href={feedPageHref(currentPage - 1)}>← {t(locale).pages.pager.prev}</Link>
                ) : null}
                <span>{currentPage} / {pageCount}</span>
                {currentPage < pageCount ? (
                  <Link href={feedPageHref(currentPage + 1)}>{t(locale).pages.pager.next} →</Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </main>
    </ThemedPage>
  );
}
