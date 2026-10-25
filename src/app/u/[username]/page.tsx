import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemedPage, ThreadCards, ThreadRows, Crumb } from "@/components/theme/themed-page";
import type { HomeThread } from "@/components/home/types";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { getLikedThreadIds } from "@/lib/likes";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getTheme } from "@/lib/theme";
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

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const [{ username }, theme] = await Promise.all([params, getTheme()]);

  const profile = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true, username: true, role: true, createdAt: true },
  });
  if (!profile) notFound();

  const [viewer, threads, threadCount, postCount] = await Promise.all([
    getCurrentUser(),
    prisma.thread.findMany({
      where: { authorId: profile.id, isDeleted: false },
      orderBy: { lastPostAt: "desc" },
      take: 20,
      include: {
        board: { select: { slug: true, name: true } },
        author: { select: { username: true } },
        tags: { select: { name: true } },
        _count: { select: { posts: true } },
      },
    }),
    prisma.thread.count({ where: { authorId: profile.id, isDeleted: false } }),
    prisma.post.count({ where: { authorId: profile.id, isDeleted: false } }),
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
  const roleLabel = profile.role === "ADMIN" ? "管理者" : profile.role === "MODERATOR" ? "モデレーター" : "生徒";

  return (
    <ThemedPage theme={theme} username={viewer?.username ?? null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "プロフィール" }]} />
          <h1>{profile.username}</h1>
          <p className="lede">このユーザーが立てたスレッドと活動の記録です。</p>
          <div className="row-meta">
            <span className="pill">{roleLabel}</span>
            <span className="pill">参加 {formatDateTime(profile.createdAt, "ja")}</span>
            <span className="pill">{threadCount} スレッド</span>
            <span className="pill">{postCount} 投稿</span>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="empty">まだスレッドを立てていません。</p>
        ) : theme === "light" ? (
          <ThreadCards threads={list} />
        ) : (
          <ThreadRows threads={list} />
        )}
      </main>
    </ThemedPage>
  );
}
