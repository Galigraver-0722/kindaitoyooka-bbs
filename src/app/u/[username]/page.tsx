import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemedPage, ThreadCards, ThreadRows, Crumb } from "@/components/theme/themed-page";
import { LogoutButton } from "@/components/theme/logout-button";
import { ProfileEditor } from "@/components/theme/profile-editor";
import type { HomeThread } from "@/components/home/types";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { getLikedThreadIds } from "@/lib/likes";
import { prisma } from "@/lib/db";
import { readableInk } from "@/lib/color";
import { noticeMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";
import { timeAgo } from "@/lib/time-ago";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const [{ username }, locale] = await Promise.all([params, getLocale()]);
  return { title: `${username} · ${t(locale).profile.title}` };
}

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ notice?: string; tab?: string }>;
}) {
  const [{ username }, { notice, tab }, theme, locale] = await Promise.all([
    params,
    searchParams,
    getTheme(),
    getLocale(),
  ]);
  const view = tab === "replies" ? "replies" : "threads";

  const profile = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      bio: true,
      avatarColor: true,
      avatarRing: true,
    },
  });
  if (!profile) notFound();

  const [viewer, threads, threadCount, postCount, likeSum, replyRows] = await Promise.all([
    getCurrentUser(),
    prisma.thread.findMany({
      where: { authorId: profile.id, isDeleted: false },
      orderBy: { lastPostAt: "desc" },
      take: 20,
      include: {
        board: { select: { slug: true, name: true } },
        author: { select: { username: true, avatarColor: true, avatarRing: true } },
        tags: { select: { name: true } },
        _count: { select: { posts: true } },
      },
    }),
    prisma.thread.count({ where: { authorId: profile.id, isDeleted: false } }),
    prisma.post.count({ where: { authorId: profile.id, isDeleted: false } }),
    prisma.thread.aggregate({
      where: { authorId: profile.id, isDeleted: false },
      _sum: { likeCount: true },
    }),
    prisma.post.findMany({
      where: { authorId: profile.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: {
        id: true,
        body: true,
        createdAt: true,
        parentId: true,
        thread: {
          select: {
            id: true,
            title: true,
            board: { select: { name: true } },
            posts: { take: 1, orderBy: { createdAt: "asc" }, select: { id: true } },
          },
        },
      },
    }),
  ]);

  const ids = threads.map((thread) => thread.id);
  const [bookmarked, liked] = await Promise.all([
    getBookmarkedThreadIds(viewer?.id, ids),
    getLikedThreadIds(viewer?.id, ids),
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

  const replies = replyRows
    .filter((row) => row.thread.posts[0]?.id !== row.id)
    .slice(0, 20);

  const roleLabel = profile.role === "ADMIN" ? "管理者" : profile.role === "MODERATOR" ? "モデレーター" : "生徒";
  const isOwner = viewer?.id === profile.id;
  const noticeText = noticeMessage(notice, locale);
  const avatarColor = profile.avatarColor ?? undefined;
  const avatarRing = profile.avatarRing ?? undefined;
  const baseHref = `/u/${profile.username}`;
  const tabHref = (next: "threads" | "replies") => (next === "threads" ? baseHref : `${baseHref}?tab=replies`);

  return (
    <ThemedPage theme={theme} username={viewer?.username ?? null}>
      <main>
        <div className="profile-page">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "プロフィール" }]} />

          <section className="profile-banner">
            <span
              className="profile-ava"
              style={{
                background: avatarColor ?? "var(--sky)",
                borderColor: avatarRing ?? "var(--line)",
                color: readableInk(avatarColor),
              }}
            >
              {profile.username.slice(0, 1).toUpperCase()}
            </span>

            <div className="profile-copy">
              <div className="profile-title">
                <h1>{profile.username}</h1>
                <span className="profile-role">{roleLabel}</span>
              </div>
              <p className="profile-handle">@{profile.username}</p>
              <p className="profile-bio">
                {profile.bio ?? "このユーザーが立てたスレッドと活動の記録です。"}
              </p>
            </div>

            <div className="profile-actions">
              {isOwner ? (
                <>
                  <ProfileEditor
                    username={profile.username}
                    bio={profile.bio ?? ""}
                    avatarColor={profile.avatarColor ?? "#12BFD1"}
                    avatarRing={profile.avatarRing ?? "#062330"}
                  />
                  <LogoutButton
                    label="ログアウト"
                    title="ログアウトしますか？"
                    text="この端末からログアウトします。書きかけの内容は保存されません。あとでまたログインできます。"
                    confirm="ログアウト"
                    cancel="キャンセル"
                  />
                </>
              ) : viewer ? (
                <Link className="btn" href={`/u/${viewer.username}`}>自分のページ</Link>
              ) : (
                <>
                  <Link className="btn btn-p" href={`/login?next=${encodeURIComponent(baseHref)}`}>ログイン</Link>
                  <Link className="btn" href="/register">新規登録</Link>
                </>
              )}
            </div>

            <div className="board-stats profile-stats">
              <div className="bs">
                <span>スレッド</span>
                <b>{threadCount}</b>
              </div>
              <div className="bs">
                <span>投稿</span>
                <b>{postCount}</b>
              </div>
              <div className="bs">
                <span>いいね</span>
                <b>{likeSum._sum.likeCount ?? 0}</b>
              </div>
              <div className="bs">
                <span>参加</span>
                <b>{profile.createdAt.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")}</b>
              </div>
            </div>
          </section>

          {noticeText ? <p className="notice">{noticeText}</p> : null}

          <div className="hub-tabs profile-tabs">
            <Link className={view === "threads" ? "on" : ""} href={tabHref("threads")}>スレッド</Link>
            <Link className={view === "replies" ? "on" : ""} href={tabHref("replies")}>返信</Link>
          </div>

          {view === "threads" ? (
            list.length === 0 ? (
              <p className="empty">まだスレッドを立てていません。</p>
            ) : theme === "light" ? (
              <ThreadCards threads={list} />
            ) : (
              <ThreadRows threads={list} />
            )
          ) : replies.length === 0 ? (
            <p className="empty">まだ返信していません。</p>
          ) : (
            <div className="profile-replies">
              {replies.map((reply) => (
                <article className="profile-reply" key={reply.id}>
                  <Link className="reply-thread" href={`/t/${reply.thread.id}#p-${reply.id}`}>
                    {reply.thread.title}
                  </Link>
                  <p className="reply-body">{reply.body}</p>
                  <div className="reply-meta">
                    <span>{reply.thread.board.name}</span>
                    <span>{timeAgo(reply.createdAt)}</span>
                    {reply.parentId ? <span className="reply-kind">返信</span> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </ThemedPage>
  );
}
