import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { formatDateTime } from "@/lib/format";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { markThreadRead } from "@/lib/read-state";
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";
import { buildThreadTree, countComments, type TreeNode } from "@/lib/thread-tree";

export const dynamic = "force-dynamic";

const heart = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
  </svg>
);
const bookmark = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
    <path d="M7 4h10v17l-5-4-5 4Z" />
  </svg>
);
const replyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20 15a3 3 0 0 1-3 3H9l-4 3V7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3Z" />
  </svg>
);

type PostRow = {
  id: string;
  parentId: string | null;
  body: string;
  likeCount: number;
  createdAt: Date;
  author: { username: string; role: string };
};

function ReplyForm({
  threadId,
  parentId,
  placeholder,
  submit,
}: {
  threadId: string;
  parentId?: string;
  placeholder: string;
  submit: string;
}) {
  return (
    <form className="reply-form" action={`/api/threads/${threadId}/posts`} method="post">
      {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}
      <textarea name="body" required maxLength={2000} placeholder={placeholder} aria-label={placeholder} rows={3} />
      <button className="btn btn-p" type="submit">{submit}</button>
    </form>
  );
}

function CommentNode({
  node,
  threadId,
  likedPostIds,
  canReply,
  labels,
}: {
  node: TreeNode<PostRow>;
  threadId: string;
  likedPostIds: Set<string>;
  canReply: boolean;
  labels: { reply: string; placeholder: string; submit: string };
}) {
  const { post } = node;
  const liked = likedPostIds.has(post.id);

  return (
    <div className="cmt" id={`p-${post.id}`}>
      <div className="cmt-head">
        <span className="cmt-no">{node.number}</span>
        <span className="cmt-who">
          <span className="dot">{post.author.username.slice(0, 1).toUpperCase()}</span>
          {post.author.username}
        </span>
        <span className="cmt-time">{formatDateTime(post.createdAt, "ja")}</span>
        {post.author.role !== "STUDENT" ? (
          <span className="pill role">{post.author.role === "ADMIN" ? "管理者" : "モデレーター"}</span>
        ) : null}
      </div>

      <div className="cmt-body">{post.body}</div>

      <div className="acts cmt-acts">
        <form action={`/api/posts/${post.id}/like`} method="post" className="contents">
          <button className={`act like${liked ? " on" : ""}`} aria-pressed={liked} aria-label="like">
            {heart}<span>{post.likeCount}</span>
          </button>
        </form>
        {canReply ? (
          <details className="reply-box">
            <summary className="act reply-btn">{replyIcon}<span>{labels.reply}</span></summary>
            <ReplyForm threadId={threadId} parentId={post.id} placeholder={labels.placeholder} submit={labels.submit} />
          </details>
        ) : null}
      </div>

      {node.children.length > 0 ? (
        <div className="cmt-kids">
          {node.children.map((child) => (
            <CommentNode
              key={child.post.id}
              node={child}
              threadId={threadId}
              likedPostIds={likedPostIds}
              canReply={canReply}
              labels={labels}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const [{ id }, { error, notice }, theme, locale] = await Promise.all([
    params,
    searchParams,
    getTheme(),
    getLocale(),
  ]);
  const copy = t(locale).shell;

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
  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);
  const canReply = Boolean(user) && !thread.isLocked;

  const root = thread.posts[0];
  const tree = buildThreadTree(thread.posts.slice(1));
  const totalComments = countComments(tree);
  const labels = { reply: copy.reply, placeholder: copy.replyPlaceholder, submit: copy.replySend };

  return (
    <ThemedPage
      theme={theme}
      username={user?.username ?? null}
      active="thread"
      boardSlug={thread.board.slug}
    >
      <main>
        <div className="page-head">
          <Crumb
            items={[
              { href: "/", label: copy.boards },
              { href: `/b/${thread.board.slug}`, label: thread.board.name },
              { label: thread.title },
            ]}
          />
          <h1>{thread.title}</h1>
          <div className="row-meta">
            <span className="pill">{thread.author.username}</span>
            <span className="pill">{formatDateTime(thread.createdAt, "ja")}</span>
            <span className="pill">{copy.comments(totalComments)}</span>
            {thread.isLocked ? <span className="pill">{locale === "ja" ? "ロック中" : "Locked"}</span> : null}
            {thread.tags.map((tag) => (
              <Link className="pill" href={`/?q=${encodeURIComponent(`#${tag.name}`)}`} key={tag.name}>
                #{tag.name}
              </Link>
            ))}
          </div>
          <div className="detail-actions">
            <form action={`/api/threads/${thread.id}/like`} method="post">
              <button className={`act act-lg like${likedThread ? " on" : ""}`} aria-pressed={likedThread} aria-label="like">
                {heart}<span>{thread.likeCount}</span>
              </button>
            </form>
            <form action={`/api/threads/${thread.id}/bookmark`} method="post">
              <button className={`act act-lg save${bookmarked ? " on" : ""}`} aria-pressed={bookmarked} aria-label={bookmarked ? "saved" : "save"}>
                {bookmark}<span>{thread.bookmarkCount}</span>
              </button>
            </form>
            {canEdit ? <Link className="btn" href={`/t/${thread.id}/edit`}>{locale === "ja" ? "編集する" : "Edit"}</Link> : null}
            {canModerate ? <Link className="btn" href="/moderation">{locale === "ja" ? "モデレーション" : "Moderation"}</Link> : null}
          </div>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}
        {noticeText ? <p className="notice">{noticeText}</p> : null}

        {root ? (
          <article className="root-post" id={`p-${root.id}`}>
            <div className="root-head">
              <span className="root-no">0</span>
              <span className="cmt-who">
                <span className="dot">{root.author.username.slice(0, 1).toUpperCase()}</span>
                {root.author.username}
              </span>
              <span className="cmt-time">{formatDateTime(root.createdAt, "ja")}</span>
              <span className="root-tag">{copy.rootPost}</span>
            </div>
            <div className="root-body">{root.body}</div>
            <div className="acts cmt-acts">
              <form action={`/api/posts/${root.id}/like`} method="post" className="contents">
                <button className={`act like${likedPostIds.has(root.id) ? " on" : ""}`} aria-pressed={likedPostIds.has(root.id)} aria-label="like">
                  {heart}<span>{root.likeCount}</span>
                </button>
              </form>
              {canReply ? (
                <details className="reply-box">
                  <summary className="act reply-btn">{replyIcon}<span>{copy.reply}</span></summary>
                  <ReplyForm threadId={thread.id} placeholder={copy.replyPlaceholder} submit={copy.replySend} />
                </details>
              ) : null}
            </div>
          </article>
        ) : null}

        <div className="feed-bar comments-head">
          <h2><span className="tick" />{copy.comments(totalComments)}</h2>
        </div>

        {tree.length === 0 ? (
          <p className="empty">{copy.noComments}</p>
        ) : (
          <div className="cmt-tree">
            {tree.map((node) => (
              <CommentNode
                key={node.post.id}
                node={node}
                threadId={thread.id}
                likedPostIds={likedPostIds}
                canReply={canReply}
                labels={labels}
              />
            ))}
          </div>
        )}

        {thread.isLocked ? (
          <p className="notice">{locale === "ja" ? "このスレッドはロックされています。新しい返信はできません。" : "This thread is locked."}</p>
        ) : canReply ? (
          <div className="form-card">
            <h2>{copy.reply}</h2>
            <ReplyForm threadId={thread.id} placeholder={copy.replyPlaceholder} submit={copy.replySend} />
          </div>
        ) : (
          <p className="notice">
            {copy.loginToReply} <Link href="/login">{t(locale).nav.logIn}</Link>
          </p>
        )}
      </main>
    </ThemedPage>
  );
}
