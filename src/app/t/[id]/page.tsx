import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReactionButton } from "@/components/reaction-button";
import { RoleChip } from "@/components/role-chip";
import { ShareButton } from "@/components/share-button";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { markThreadRead } from "@/lib/read-state";
import { parseSuggestedTags, tagSearchHref } from "@/lib/tags";
import { LIMITS } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const [{ id }, { error, notice }, locale] = await Promise.all([
    params,
    searchParams,
    getLocale(),
  ]);
  const m = t(locale);

  const [thread, user] = await Promise.all([
    prisma.thread.findUnique({
      where: { id },
      include: {
        board: { select: { slug: true, name: true, suggestedTags: true } },
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

  if (!thread || thread.isDeleted) {
    notFound();
  }

  if (user) {
    await markThreadRead(user.id, thread.id);
  }

  const [likedPostIds, bookmarked] = user
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
      ])
    : ([new Set<string>(), false] as const);

  const canModerate = isModerator(user);
  const canEdit = canEditThread(user?.id, thread);
  const suggestedTags = parseSuggestedTags(thread.board.suggestedTags);
  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);

  return (
    <main className="shell page">
      <Breadcrumbs
        items={[
          { href: "/", label: m.board.breadcrumb },
          { href: `/b/${thread.board.slug}`, label: thread.board.name },
          { label: thread.title },
        ]}
      />

      <header className="mt-8 border-b border-line pb-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="eyebrow">{thread.board.name}</span>
              {thread.isPinned ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                  {m.board.pinned}
                </span>
              ) : null}
              {thread.isLocked ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {m.board.locked}
                </span>
              ) : null}
            </div>

            <h1 className="title-page mt-3 max-w-[24ch]">{thread.title}</h1>

            <p className="meta mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{m.thread.startedBy(thread.author.username, formatDateTime(thread.createdAt, locale))}</span>
              <span aria-hidden="true">·</span>
              <span>♡ {thread.likeCount}</span>
              {thread.editedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{m.thread.editedAt(formatDateTime(thread.editedAt, locale))}</span>
                </>
              ) : null}
            </p>

            {thread.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {thread.tags.map((tag) => (
                  <Link key={tag.name} href={tagSearchHref(tag.name)} className="tag">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-start gap-x-6 gap-y-3 lg:flex-col lg:border-l lg:border-line lg:pl-6">
            {user ? (
              <ReactionButton
                action={`/api/threads/${thread.id}/bookmark`}
                initialActive={bookmarked}
                initialCount={thread.bookmarkCount}
                activeLabel={m.thread.saved}
                inactiveLabel={m.thread.save}
                errorLabel={m.thread.actionFailed}
                icon="bookmark"
              />
            ) : (
              <span className="text-[12px] text-muted">
                {m.thread.save} {thread.bookmarkCount}
              </span>
            )}

            <a href={`/t/${thread.id}/export`} className="btn-quiet">
              {m.thread.exportText}
            </a>

            {canEdit ? (
              <Link href={`/t/${thread.id}/edit`} className="btn-quiet">
                {m.thread.edit}
              </Link>
            ) : null}

            {canModerate ? (
              <div className="mt-2 w-full border-t border-line pt-3">
                <p className="eyebrow">{m.nav.moderation}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  <form action={`/api/threads/${thread.id}/lock`} method="post">
                    <button type="submit" className="btn-quiet">
                      {thread.isLocked ? m.thread.unlockThread : m.thread.lockThread}
                    </button>
                  </form>
                  <form action={`/api/threads/${thread.id}/delete`} method="post">
                    <button type="submit" className="btn-quiet text-error hover:text-error">
                      {m.thread.removeThread}
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {errorText ? <p className="notice notice-error mt-6">{errorText}</p> : null}
      {noticeText ? <p className="notice notice-success mt-6">{noticeText}</p> : null}

      <ol className="mt-2">
        {thread.posts.map((post, index) => {
          const liked = likedPostIds.has(post.id);

          return (
            <li
              key={post.id}
              id={`p-${post.id}`}
              className="scroll-mt-24 border-t border-line py-8 first:border-t-0"
            >
              <article>
                <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="num">#{String(index + 1).padStart(2, "0")}</span>
                    <Link
                      href={`/u/${post.author.username}`}
                      className="text-[13px] font-medium text-ink transition-colors hover:text-accent"
                    >
                      {post.author.username}
                    </Link>
                    <RoleChip role={post.author.role} locale={locale} />
                    {index === 0 ? (
                      <span className="eyebrow">{m.thread.originalPost}</span>
                    ) : null}
                  </div>
                  <time className="meta">{formatDateTime(post.createdAt, locale)}</time>
                </header>

                {post.isDeleted ? (
                  <p className="mt-4 text-[13px] italic text-muted">{m.thread.removed}</p>
                ) : (
                  <p
                    className={`mt-4 whitespace-pre-wrap break-words leading-[1.95] text-ink ${
                      index === 0 ? "text-[15.5px]" : "text-[15px]"
                    }`}
                  >
                    {post.body}
                  </p>
                )}

                {!post.isDeleted ? (
                  <footer className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {user ? (
                      <ReactionButton
                        action={`/api/posts/${post.id}/like`}
                        initialActive={liked}
                        initialCount={post.likeCount}
                        activeLabel={m.thread.liked}
                        inactiveLabel={m.thread.like}
                        errorLabel={m.thread.actionFailed}
                        icon="heart"
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
                        ♡ {post.likeCount}
                      </span>
                    )}

                    <ShareButton
                      path={`/t/${thread.id}#p-${post.id}`}
                      label={m.thread.share}
                      copiedLabel={m.thread.copied}
                    />

                    {user ? (
                      <details className="w-full">
                        <summary className="btn-quiet cursor-pointer list-none select-none">
                          {m.thread.report}
                        </summary>
                        <form
                          action="/api/reports"
                          method="post"
                          className="mt-3 flex max-w-xl flex-col gap-2 sm:flex-row"
                        >
                          <input type="hidden" name="postId" value={post.id} />
                          <input
                            name="reason"
                            required
                            minLength={LIMITS.reasonMin}
                            maxLength={LIMITS.reasonMax}
                            placeholder={m.thread.reportPlaceholder}
                            className="field flex-1 py-2 text-[13px]"
                          />
                          <button type="submit" className="btn btn-primary px-3 py-2 text-[12px]">
                            {m.thread.sendReport}
                          </button>
                        </form>
                      </details>
                    ) : null}

                    {canModerate ? (
                      <form action={`/api/posts/${post.id}/delete`} method="post" className="ml-auto">
                        <button type="submit" className="btn-quiet text-error hover:text-error">
                          {m.thread.removePost}
                        </button>
                      </form>
                    ) : null}
                  </footer>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>

      <section className="mt-10 border-t border-line pt-8">
        {thread.isLocked ? (
          <p className="text-[13px] text-muted">{m.thread.lockedNotice}</p>
        ) : user ? (
          <>
            <h2 className="title-section">{m.thread.replyAs(user.username)}</h2>
            <form
              action={`/api/threads/${thread.id}/posts`}
              method="post"
              className="mt-5 max-w-2xl space-y-5"
            >
              <div>
                <label htmlFor="body" className="field-label">
                  {m.newThread.message}
                </label>
                <textarea
                  id="body"
                  name="body"
                  required
                  rows={6}
                  maxLength={LIMITS.bodyMax}
                  className="field mt-2 min-h-[9rem] resize-y"
                />
                <p className="hint">{m.thread.charLimit(LIMITS.bodyMax)}</p>
              </div>

              <div>
                <label htmlFor="tags" className="field-label">
                  {m.tagField.label}
                </label>
                <input
                  id="tags"
                  name="tags"
                  maxLength={150}
                  placeholder={m.tagField.placeholder}
                  className="field mt-2 py-2 text-[13px]"
                />
                <p className="hint">{m.tagField.hint}</p>
                {suggestedTags.length > 0 ? (
                  <p className="hint">
                    {m.tagField.suggested(
                      thread.board.name,
                      suggestedTags.map((tag) => `#${tag}`).join(" "),
                    )}
                  </p>
                ) : null}
              </div>

              <button type="submit" className="btn btn-primary">
                {m.thread.postReply}
              </button>
            </form>
          </>
        ) : (
          <p className="text-[13px] text-muted">
            {m.thread.loginPromptPrefix}
            <Link
              href={`/login?next=${encodeURIComponent(`/t/${thread.id}`)}`}
              className="text-link ml-1"
            >
              {m.thread.loginLink}
            </Link>
            {m.thread.loginPromptSuffix}
          </p>
        )}
      </section>
    </main>
  );
}
