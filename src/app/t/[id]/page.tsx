import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleChip } from "@/components/role-chip";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
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
        board: { select: { slug: true, name: true } },
        author: { select: { username: true } },
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

  const canModerate = isModerator(user);
  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          {m.board.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/b/${thread.board.slug}`} className="hover:text-slate-800">
          {thread.board.name}
        </Link>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {thread.isPinned ? (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
              {m.board.pinned}
            </span>
          ) : null}
          {thread.isLocked ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
              {m.board.locked}
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{thread.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {m.thread.startedBy(thread.author.username, formatDateTime(thread.createdAt, locale))}
        </p>
      </header>

      {canModerate ? (
        <div className="mt-4 flex flex-wrap gap-2 border-y border-slate-200 py-3">
          <form action={`/api/threads/${thread.id}/lock`} method="post">
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {thread.isLocked ? m.thread.unlockThread : m.thread.lockThread}
            </button>
          </form>
          <form action={`/api/threads/${thread.id}/delete`} method="post">
            <button
              type="submit"
              className="rounded-md border border-rose-300 px-3 py-1.5 text-sm text-rose-700 transition hover:bg-rose-50"
            >
              {m.thread.removeThread}
            </button>
          </form>
        </div>
      ) : null}

      {errorText ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {errorText}
        </p>
      ) : null}
      {noticeText ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          {noticeText}
        </p>
      ) : null}

      <ol className="mt-6 space-y-4">
        {thread.posts.map((post, index) => (
          <li key={post.id} id={`p-${post.id}`} className="scroll-mt-6">
            <article
              className={`rounded-xl border p-5 ${
                post.isDeleted
                  ? "border-dashed border-slate-300 bg-slate-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <div className="text-slate-700">
                  <span className="font-medium">{post.author.username}</span>
                  <RoleChip role={post.author.role} locale={locale} />
                  {index === 0 ? (
                    <span className="ml-2 text-xs text-slate-400">{m.thread.originalPost}</span>
                  ) : (
                    <span className="ml-2 text-xs text-slate-400">
                      {m.thread.postNumber(index + 1)}
                    </span>
                  )}
                </div>
                <time className="text-xs text-slate-400">
                  {formatDateTime(post.createdAt, locale)}
                </time>
              </header>

              {post.isDeleted ? (
                <p className="mt-3 text-sm italic text-slate-500">{m.thread.removed}</p>
              ) : (
                <p className="mt-3 whitespace-pre-wrap break-words text-slate-800">{post.body}</p>
              )}

              {!post.isDeleted ? (
                <footer className="mt-4 flex flex-wrap items-start gap-4 text-xs text-slate-500">
                  {user ? (
                    <details className="group">
                      <summary className="cursor-pointer select-none hover:text-slate-800">
                        {m.thread.report}
                      </summary>
                      <form
                        action="/api/reports"
                        method="post"
                        className="mt-2 flex max-w-xl flex-col gap-2 sm:flex-row"
                      >
                        <input type="hidden" name="postId" value={post.id} />
                        <input
                          name="reason"
                          required
                          minLength={LIMITS.reasonMin}
                          maxLength={LIMITS.reasonMax}
                          placeholder={m.thread.reportPlaceholder}
                          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white transition hover:bg-slate-700"
                        >
                          {m.thread.sendReport}
                        </button>
                      </form>
                    </details>
                  ) : null}

                  {canModerate ? (
                    <form action={`/api/posts/${post.id}/delete`} method="post">
                      <button type="submit" className="hover:text-rose-700">
                        {m.thread.removePost}
                      </button>
                    </form>
                  ) : null}
                </footer>
              ) : null}
            </article>
          </li>
        ))}
      </ol>

      <section className="mt-8">
        {thread.isLocked ? (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            {m.thread.lockedNotice}
          </p>
        ) : user ? (
          <form
            action={`/api/threads/${thread.id}/posts`}
            method="post"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <label htmlFor="body" className="block text-sm font-medium text-slate-700">
              {m.thread.replyAs(user.username)}
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={5}
              maxLength={LIMITS.bodyMax}
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {m.thread.charLimit(LIMITS.bodyMax)}
              </p>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {m.thread.postReply}
              </button>
            </div>
          </form>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            {m.thread.loginPromptPrefix}
            <Link
              href={`/login?next=${encodeURIComponent(`/t/${thread.id}`)}`}
              className="font-medium text-indigo-600 hover:text-indigo-700"
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
