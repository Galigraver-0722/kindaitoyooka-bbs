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
import { openingPostExcerpt } from "@/lib/excerpt";
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
  const copy = t(locale).pages.profile;
  const pages = t(locale).pages;
  const roles = t(locale).pages.role;

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
        posts: { orderBy: { createdAt: "asc" }, take: 1, select: { body: true, isDeleted: true } },
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
    excerpt: openingPostExcerpt(thread.posts[0]),
  }));

  const replies = replyRows
    .filter((row) => row.thread.posts[0]?.id !== row.id)
    .slice(0, 20);

  const roleLabel = profile.role === "ADMIN" ? roles.admin : profile.role === "MODERATOR" ? roles.moderator : roles.student;
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
          <Crumb items={[{ href: "/", label: pages.home }, { label: t(locale).profile.title }]} />

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
                {profile.bio ?? copy.guestBio}
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
                    labels={{
                      edit: copy.edit,
                      title: copy.editTitle,
                      close: copy.close,
                      bio: copy.bio,
                      bioPlaceholder: copy.bioPlaceholder,
                      avatarColor: copy.avatarColor,
                      ringColor: copy.ringColor,
                      cancel: copy.cancel,
                      save: copy.save,
                    }}
                  />
                  <LogoutButton
                    label={copy.logout}
                    title={copy.logoutTitle}
                    text={copy.logoutText}
                    confirm={copy.logout}
                    cancel={copy.cancel}
                  />
                </>
              ) : viewer ? (
                <Link className="btn" href={`/u/${viewer.username}`}>{copy.ownPage}</Link>
              ) : (
                <>
                  <Link className="btn btn-p" href={`/login?next=${encodeURIComponent(baseHref)}`}>{copy.login}</Link>
                  <Link className="btn" href="/register">{copy.register}</Link>
                </>
              )}
            </div>

            <div className="board-stats profile-stats">
              <div className="bs">
                <span>{copy.threads}</span>
                <b>{threadCount}</b>
              </div>
              <div className="bs">
                <span>{copy.posts}</span>
                <b>{postCount}</b>
              </div>
              <div className="bs">
                <span>{copy.likes}</span>
                <b>{likeSum._sum.likeCount ?? 0}</b>
              </div>
              <div className="bs">
                <span>{copy.joined}</span>
                <b>{profile.createdAt.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")}</b>
              </div>
            </div>
          </section>

          {noticeText ? <p className="notice">{noticeText}</p> : null}

          <div className="hub-tabs profile-tabs">
            <Link className={view === "threads" ? "on" : ""} href={tabHref("threads")}>{copy.threads}</Link>
            <Link className={view === "replies" ? "on" : ""} href={tabHref("replies")}>{copy.replies}</Link>
          </div>

          {view === "threads" ? (
            list.length === 0 ? (
              <p className="empty">{copy.noThreads}</p>
            ) : theme === "light" ? (
              <ThreadCards threads={list} locale={locale} />
            ) : (
              <ThreadRows threads={list} locale={locale} />
            )
          ) : replies.length === 0 ? (
            <p className="empty">{copy.noReplies}</p>
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
                    <span>{timeAgo(reply.createdAt, locale)}</span>
                    {reply.parentId ? <span className="reply-kind">{copy.replyTag}</span> : null}
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
