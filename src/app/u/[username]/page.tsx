import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemedPage, ThreadCards, ThreadRows, Crumb } from "@/components/theme/themed-page";
import { LogoutButton } from "@/components/theme/logout-button";
import type { HomeThread } from "@/components/home/types";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedThreadIds } from "@/lib/bookmarks";
import { getLikedThreadIds } from "@/lib/likes";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { readableInk } from "@/lib/color";
import { noticeMessage } from "@/lib/messages";
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

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ username }, { notice }, theme, locale] = await Promise.all([
    params,
    searchParams,
    getTheme(),
    getLocale(),
  ]);

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

  const [viewer, threads, threadCount, postCount] = await Promise.all([
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
  const isOwner = viewer?.id === profile.id;
  const noticeText = noticeMessage(notice, locale);
  const avatarColor = profile.avatarColor ?? undefined;
  const avatarRing = profile.avatarRing ?? undefined;

  return (
    <ThemedPage theme={theme} username={viewer?.username ?? null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "プロフィール" }]} />
          <div className="profile-head">
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
              <h1>{profile.username}</h1>
              <p className="lede">
                {profile.bio ?? "このユーザーが立てたスレッドと活動の記録です。"}
              </p>
            </div>
          </div>
          <div className="row-meta">
            <span className="pill">{roleLabel}</span>
            <span className="pill">参加 {formatDateTime(profile.createdAt, "ja")}</span>
            <span className="pill">{threadCount} スレッド</span>
            <span className="pill">{postCount} 投稿</span>
          </div>
          <div className="account-bar">
            {viewer ? (
              <>
                <span className="account-name">@{viewer.username}</span>
                <LogoutButton
                  label="ログアウト"
                  title="ログアウトしますか？"
                  text="この端末からログアウトします。書きかけの内容は保存されません。あとでまたログインできます。"
                  confirm="ログアウト"
                  cancel="キャンセル"
                />
              </>
            ) : (
              <>
                <Link className="btn btn-p" href={`/login?next=${encodeURIComponent(`/u/${profile.username}`)}`}>ログイン</Link>
                <Link className="btn" href="/register">新規登録</Link>
              </>
            )}
          </div>
        </div>

        {noticeText ? <p className="notice">{noticeText}</p> : null}

        {isOwner ? (
          <details className="profile-edit">
            <summary className="btn">プロフィールを編集</summary>
          <form className="form-card profile-form" action="/api/profile" method="post">
            <h2>プロフィールを編集</h2>
            <label className="field-label" htmlFor="bio">自己紹介</label>
            <textarea id="bio" name="bio" maxLength={200} rows={4} defaultValue={profile.bio ?? ""} placeholder="部活、好きな科目、ひとこと。" />
            <p className="hint">{profile.bio?.length ?? 0} / 200</p>

            <div className="color-row">
              <label className="color-field">
                <span className="field-label">アイコンの色</span>
                <input type="color" name="avatarColor" defaultValue={profile.avatarColor ?? "#12BFD1"} />
              </label>
              <label className="color-field">
                <span className="field-label">枠の色</span>
                <input type="color" name="avatarRing" defaultValue={profile.avatarRing ?? "#062330"} />
              </label>
              <span
                className="profile-ava preview"
                aria-hidden="true"
                style={{
                  background: avatarColor ?? "var(--sky)",
                  borderColor: avatarRing ?? "var(--line)",
                  color: readableInk(avatarColor),
                }}
              >
                {profile.username.slice(0, 1).toUpperCase()}
              </span>
            </div>

            <div className="form-foot">
              <button className="btn btn-p" type="submit">保存する</button>
            </div>
          </form>
          </details>
        ) : null}

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
