import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { formatDateTime } from "@/lib/format";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { markThreadRead } from "@/lib/read-state";
import { normalizeHighlightTerm } from "@/lib/highlight";
import { Highlight } from "@/components/theme/highlight";
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";
import { buildThreadTree, type TreeNode } from "@/lib/thread-tree";
import { ToggleAction } from "@/components/theme/actions";
import { readableInk } from "@/lib/color";
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
  searchParams: Promise<{ error?: string; notice?: string; q?: string }>;
}) {
  const [{ id }, { error, notice, q }, theme, locale] = await Promise.all([
    params,
    searchParams,
    getTheme(),
    getLocale(),
  ]);
  const copy = t(locale).shell;
  const pages = t(locale).pages;
  const highlightTerm = normalizeHighlightTerm(q);
  const threadCopy = t(locale).thread;

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
    like: pages.actions.like,
    sendError: pages.sendError,
    admin: pages.role.admin,
    moderator: pages.role.moderator,
    report: threadCopy.report,
    reportPlaceholder: threadCopy.reportPlaceholder,
    sendReport: threadCopy.sendReport,
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
    createdAt: formatDateTime(node.post.createdAt, locale),
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
            <span className="pill">{formatDateTime(thread.createdAt, locale)}</span>
            {thread.isLocked ? <span className="pill">{pages.actions.locked}</span> : null}
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
              label={t(locale).pages.actions.like}
              large
            />
            <ToggleAction
              kind="save"
              endpoint={`/api/threads/${thread.id}/bookmark`}
              initialCount={thread.bookmarkCount}
              initialActive={bookmarked}
              label={t(locale).pages.actions.save}
              large
            />
            {canEdit ? <Link className="btn" href={`/t/${thread.id}/edit`}>{pages.actions.edit}</Link> : null}
            {canModerate ? <Link className="btn" href="/moderation">{pages.actions.moderation}</Link> : null}
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
                    color: readableInk(root.author.avatarColor),
                  }}
                >
                  {root.author.username.slice(0, 1).toUpperCase()}
                </span>
                {root.author.username}
              </span>
              <span className="cmt-time">{formatDateTime(root.createdAt, locale)}</span>
              <span className="root-tag">{copy.rootPost}</span>
            </div>
            <div className="root-body"><Highlight text={root.body} term={highlightTerm} /></div>
            <div className="acts cmt-acts">
              {canReply ? (
                <a className="act reply-btn" href="#reply-form">
                  {replyIcon}
                  <span>{copy.reply}</span>
                </a>
              ) : null}
            </div>
            {user && user.username !== root.author.username && !thread.isLocked ? (
              <details className="report-box">
                <summary className="act report-btn">
                  <span>{threadCopy.report}</span>
                </summary>
                <form className="reply-form" action="/api/reports" method="post">
                  <input type="hidden" name="postId" value={root.id} />
                  <textarea
                    name="reason"
                    required
                    minLength={3}
                    maxLength={500}
                    rows={2}
                    placeholder={threadCopy.reportPlaceholder}
                    aria-label={threadCopy.reportPlaceholder}
                  />
                  <button className="btn btn-p" type="submit">{threadCopy.sendReport}</button>
                </form>
              </details>
            ) : null}
          </article>
        ) : null}

        {thread.isLocked ? (
          <p className="notice">{pages.actions.lockedNotice}</p>
        ) : (
          <CommentSection
            threadId={thread.id}
            initial={comments}
            canReply={canReply}
            labels={labels}
            emptyText={copy.noComments}
            loginText={copy.loginToReply}
            loginLabel={t(locale).nav.logIn}
            viewer={user?.username ?? null}
            highlight={highlightTerm}
          />
        )}
      </main>
    </ThemedPage>
  );
}
