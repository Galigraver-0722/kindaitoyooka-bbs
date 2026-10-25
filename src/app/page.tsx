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
  author: { select: { username: true } },
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
  const [{ q, filter, sort }, theme] = await Promise.all([searchParams, getTheme()]);
  const user = await getCurrentUser();

  const query = (q ?? "").trim().slice(0, 100);
  const view = filter === "saved" || filter === "mine" ? filter : "all";
  const order = sort === "hot" || sort === "rising" ? sort : "latest";
  const needsLogin = view !== "all" && !user;

  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      _count: { select: { threads: { where: { isDeleted: false } } } },
    },
  });

  const summaries: BoardSummary[] = boards.map((board) => ({
    slug: board.slug,
    name: board.name,
    count: board._count.threads,
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
    const sorted = order === "hot" ? sortByHot(ranked).slice(0, 30) : sortByRising(ranked).slice(0, 30);
    rows = sorted;
  }

  const bookmarked = await getBookmarkedThreadIds(user?.id, rows.map((row) => row.id));
  const list: HomeThread[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    board: row.board,
    author: row.author,
    tags: row.tags,
    likeCount: row.likeCount,
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
    { key: "all", label: "すべて", href: href({ filter: "" }) },
    { key: "saved", label: "保存", href: href({ filter: "saved" }) },
    { key: "mine", label: "自分の投稿", href: href({ filter: "mine" }) },
  ];

  const heading = query
    ? `「${query}」の検索結果`
    : view === "saved"
      ? "保存したスレッド"
      : view === "mine"
        ? "自分の投稿"
        : order === "rising"
          ? "急上昇"
          : order === "hot"
            ? "人気のスレッド"
            : "新着スレッド";

  return (
    <ThemedPage theme={theme} username={user?.username ?? null}>
      <main>
        {theme === "light" ? (
          <section className="cover">
            <div className="eyebrow">
              <span className="sticker"><b>●</b> {num(totalThreads)} スレッド</span>
              <span className="sticker">{num(totalPosts)} 返信</span>
              <span className="sticker">{num(summaries.length)} ボード</span>
            </div>
            <h1>話そう、<mark>学校のこと</mark>。</h1>
            <p className="lede">質問・部活の連絡・勉強の相談。書いたことは残って、あとから来た人の役に立つ。</p>
          </section>
        ) : (
          <section className="cover">
            <p className="kicker"><b>[ 01 ]</b> student network / since 2026</p>
            <h1>学校の議論は、<span className="fade">止まらない。</span></h1>
            <p className="lede">質問、部活の連絡、進路の相談。書いたことは残り、あとから来た人が読める。</p>
            <div className="cover-stats">
              <span><b>{num(totalThreads)}</b> THREADS</span>
              <span><b>{num(totalPosts)}</b> REPLIES</span>
              <span><b>{num(summaries.length)}</b> BOARDS</span>
              <span><b>{num(saved)}</b> SAVED</span>
            </div>
          </section>
        )}

        <div className="feed-cols">
          <aside className="feed-side">
            <div>
              <h2 className="side-title">ボード</h2>
              <BoardNav boards={summaries} />
            </div>
          </aside>

          <div className="feed-body">
            <div className="feed-bar">
              <h2><span className="tick" />{heading}</h2>
              <span className="hub-sort">
                <Link className={order === "latest" ? "on" : ""} href={href({ sort: "" })}>新着</Link>
                <Link className={order === "hot" ? "on" : ""} href={href({ sort: "hot" })}>人気</Link>
                <Link className={order === "rising" ? "on" : ""} href={href({ sort: "rising" })}>急上昇</Link>
              </span>
            </div>

            <div className="hub-tabs">
              {filters.map((tab) => (
                <Link key={tab.key} className={view === tab.key ? "on" : ""} href={tab.href}>
                  {tab.label}
                </Link>
              ))}
              {query ? <Link className="hub-clear" href={href({})}>検索を解除</Link> : null}
            </div>

            {needsLogin ? (
              <p className="empty">
                この一覧を見るには <Link href="/login">ログイン</Link> してください。
              </p>
            ) : list.length === 0 ? (
              <p className="empty">
                {query ? "該当するスレッドはありません。" : view === "saved" ? "保存したスレッドはまだありません。" : view === "mine" ? "まだ投稿していません。" : "まだスレッドがありません。"}
              </p>
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
