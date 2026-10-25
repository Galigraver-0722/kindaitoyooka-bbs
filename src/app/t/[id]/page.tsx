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
import { buildThreadTree, type TreeNode } from "@/lib/thread-tree";
import { ToggleAction } from "@/components/theme/actions";
import { CommentSection, type CommentData, type CommentLabels } from "@/components/theme/comment";

export const dynamic = "force-dynamic";

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
  author: { username: string; role: string; avatarColor: string | null; avatarRing: string | null };
};

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
          include: { author: { select: { username: true, role: true, avatarColor: true, avatarRing: true } } },
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
  const labels: CommentLabels = {
    reply: copy.reply,
    placeholder: copy.replyPlaceholder,
    submit: copy.replySend,
    collapse: copy.collapse,
    expand: copy.expand,
    foldedSuffix: copy.foldedSuffix,
    commentsSuffix: copy.commentsSuffix,
    admin: locale === "ja" ? "管理者" : "Admin",
    moderator: locale === "ja" ? "モデレーター" : "Moderator",
  };

  const toComment = (node: TreeNode<PostRow>): CommentData => ({
    id: node.post.id,
    number: node.number,
    body: node.post.body,
    author: {
      username: node.post.author.username,
      role: node.post.author.role,
      avatarColor: node.post.author.avatarColor,
      avatarRing: node.post.author.avatarRing,
    },
    createdAt: formatDateTime(node.post.createdAt, "ja"),
    likeCount: node.post.likeCount,
    liked: likedPostIds.has(node.post.id),
    children: node.children.map(toComment),
  });

  const comments = tree.map(toComment);

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
            {thread.isLocked ? <span className="pill">{locale === "ja" ? "ロック中" : "Locked"}</span> : null}
            {thread.tags.map((tag) => (
              <Link className="pill" href={`/?q=${encodeURIComponent(`#${tag.name}`)}`} key={tag.name}>
                #{tag.name}
              </Link>
            ))}
          </div>
          <div className="detail-actions">
            <ToggleAction
              kind="like"
              endpoint={`/api/threads/${thread.id}/like`}
              initialCount={thread.likeCount}
              initialActive={likedThread}
              large
            />
            <ToggleAction
              kind="save"
              endpoint={`/api/threads/${thread.id}/bookmark`}
              initialCount={thread.bookmarkCount}
              initialActive={bookmarked}
              large
            />
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
                <span
                  className="dot"
                  style={{
                    background: root.author.avatarColor ?? undefined,
                    borderColor: root.author.avatarRing ?? undefined,
                  }}
                >
                  {root.author.username.slice(0, 1).toUpperCase()}
                </span>
                {root.author.username}
              </span>
              <span className="cmt-time">{formatDateTime(root.createdAt, "ja")}</span>
              <span className="root-tag">{copy.rootPost}</span>
            </div>
            <div className="root-body">{root.body}</div>
            <div className="acts cmt-acts">
              {canReply ? (
                <a className="act reply-btn" href="#reply-form">
                  {replyIcon}
                  <span>{copy.reply}</span>
                </a>
              ) : null}
            </div>
          </article>
        ) : null}

        {thread.isLocked ? (
          <p className="notice">{locale === "ja" ? "このスレッドはロックされています。新しい返信はできません。" : "This thread is locked."}</p>
        ) : (
          <CommentSection
            threadId={thread.id}
            initial={comments}
            canReply={canReply}
            labels={labels}
            emptyText={copy.noComments}
            loginText={copy.loginToReply}
            loginLabel={t(locale).nav.logIn}
          />
        )}
      </main>
    </ThemedPage>
  );
}
