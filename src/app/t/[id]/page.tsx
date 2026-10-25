import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { formatDateTime } from "@/lib/format";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { markThreadRead } from "@/lib/read-state";
import { getTheme } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const [{ id }, { error, notice }, theme] = await Promise.all([
    params,
    searchParams,
    getTheme(),
  ]);

  const [thread, user] = await Promise.all([
    prisma.thread.findUnique({
      where: { id },
      include: {
        board: { select: { slug: true, name: true } },
        author: { select: { username: true } },
        tags: { select: { name: true } },
        posts: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { username: true, role: true } } },
        },
      },
    }),
    getCurrentUser(),
  ]);

  if (!thread || thread.isDeleted) notFound();
  if (user) await markThreadRead(user.id, thread.id);

  const [likedPostIds, bookmarked, likedThread] = user
    ? await Promise.all([
        prisma.postLike
          .findMany({
            where: { userId: user.id, postId: { in: thread.posts.map((post) => post.id) } },
            select: { postId: true },
          })
          .then((rows) => new Set(rows.map((row) => row.postId))),
        prisma.threadBookmark
          .findUnique({
            where: { userId_threadId: { userId: user.id, threadId: thread.id } },
            select: { userId: true },
          })
          .then(Boolean),
        prisma.threadLike
          .findUnique({
            where: { userId_threadId: { userId: user.id, threadId: thread.id } },
            select: { userId: true },
          })
          .then(Boolean),
      ])
    : ([new Set<string>(), false, false] as const);

  const canModerate = isModerator(user);
  const canEdit = canEditThread(user?.id, thread);
  const errorText = errorMessage(error, "ja");
  const noticeText = noticeMessage(notice, "ja");

  return (
    <ThemedPage theme={theme} username={user?.username ?? null} active="boards">
      <main>
        <div className="page-head">
          <Crumb
            items={[
              { href: "/", label: "ボード" },
              { href: `/b/${thread.board.slug}`, label: thread.board.name },
              { label: thread.title },
            ]}
          />
          <h1>{thread.title}</h1>
          <div className="row-meta">
            <span className="pill">{thread.author.username}</span>
            <span className="pill">{formatDateTime(thread.createdAt, "ja")}</span>
            <span className="pill">{Math.max(0, thread.posts.length - 1)} 返信</span>
            {thread.isLocked ? <span className="pill">ロック中</span> : null}
            {thread.tags.map((tag) => (
              <Link className="pill" href={`/?q=${encodeURIComponent(`#${tag.name}`)}`} key={tag.name}>
                #{tag.name}
              </Link>
            ))}
          </div>
          <div className="detail-actions">
            <form action={`/api/threads/${thread.id}/like`} method="post">
              <button className={`act act-lg like${likedThread ? " on" : ""}`} aria-pressed={likedThread} aria-label="いいね">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="act-icon">
                  <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
                </svg>
                <span>{thread.likeCount}</span>
              </button>
            </form>
            <form action={`/api/threads/${thread.id}/bookmark`} method="post">
              <button className={`act act-lg save${bookmarked ? " on" : ""}`} aria-pressed={bookmarked} aria-label={bookmarked ? "保存済み" : "保存"}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" className="act-icon">
                  <path d="M7 4h10v17l-5-4-5 4Z" />
                </svg>
                <span>{thread.bookmarkCount}</span>
              </button>
            </form>
            {canEdit ? <Link className="btn" href={`/t/${thread.id}/edit`}>編集する</Link> : null}
            {canModerate ? <Link className="btn" href="/moderation">モデレーション</Link> : null}
          </div>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}
        {noticeText ? <p className="notice">{noticeText}</p> : null}

        {thread.posts.map((post, index) => (
          <article className="post" key={post.id}>
            <div className="post-head">
              <span className="who">
                <span className="dot">{post.author.username.slice(0, 1).toUpperCase()}</span>
                {post.author.username}
              </span>
              <span>#{String(index + 1).padStart(2, "0")}</span>
              <span>{formatDateTime(post.createdAt, "ja")}</span>
              {post.author.role !== "STUDENT" ? <span>{post.author.role === "ADMIN" ? "管理者" : "モデレーター"}</span> : null}
            </div>
            <div className="post-body">{post.body}</div>
            <div className="post-foot">
              <span className={`metric${likedPostIds.has(post.id) ? " liked" : ""}`}>♥ {post.likeCount}</span>
            </div>
          </article>
        ))}

        {user ? (
          thread.isLocked ? (
            <p className="notice">このスレッドはロックされています。新しい返信はできません。</p>
          ) : (
            <form className="form-card" action={`/api/threads/${thread.id}/posts`} method="post">
              <h2>返信する</h2>
              <textarea name="body" required maxLength={2000} placeholder="返信を書く" aria-label="返信" />
              <div className="form-foot">
                <button className="btn btn-p" type="submit">返信を送る</button>
                <span className="hint">{user.username} として投稿されます。</span>
              </div>
            </form>
          )
        ) : (
          <p className="notice">
            返信するには <Link href="/login">ログイン</Link> してください。
          </p>
        )}
      </main>
    </ThemedPage>
  );
}
