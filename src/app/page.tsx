import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { noticeMessage } from "@/lib/messages";
import { getUnreadThreadIds } from "@/lib/read-state";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ notice }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);

  const [boards, recentThreads, user] = await Promise.all([
    prisma.board.findMany({
      where: { isArchived: false },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { threads: { where: { isDeleted: false } } } },
      },
    }),
    prisma.thread.findMany({
      where: { isDeleted: false },
      orderBy: { lastPostAt: "desc" },
      take: 8,
      include: {
        board: { select: { slug: true, name: true } },
        author: { select: { username: true } },
        _count: { select: { posts: true } },
      },
    }),
    getCurrentUser(),
  ]);

  const unread = await getUnreadThreadIds(user?.id, recentThreads);
  const signedOutNotice = noticeMessage(notice, locale);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {signedOutNotice ? (
        <p className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          {signedOutNotice}
        </p>
      ) : null}

      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-10 text-white shadow-sm sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
          {m.home.eyebrow}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{m.home.title}</h1>
        <p className="mt-3 max-w-2xl text-indigo-100">{m.home.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/new"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            {m.home.startThread}
          </Link>
          <Link
            href="#boards"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {m.home.browseBoards}
          </Link>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{m.home.recent}</h2>
            <span className="shrink-0 text-sm text-slate-500">
              {m.home.newestThreads(recentThreads.length)}
            </span>
          </div>

          {recentThreads.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              {m.home.empty}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {recentThreads.map((thread) => (
                <li key={thread.id} className="px-4 py-3 transition hover:bg-slate-50">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <Link
                      href={`/b/${thread.board.slug}`}
                      className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-200"
                    >
                      {thread.board.name}
                    </Link>
                    {thread.isPinned ? (
                      <span className="font-medium text-indigo-600">{m.board.pinned}</span>
                    ) : null}
                    {unread.has(thread.id) ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                        {m.board.unread}
                      </span>
                    ) : null}
                    <span>{formatDateTime(thread.lastPostAt, locale)}</span>
                  </div>
                  <Link
                    href={`/t/${thread.id}`}
                    className="mt-1 block text-base font-medium text-slate-900 hover:text-indigo-700"
                  >
                    {thread.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {m.home.byReplies(
                      thread.author.username,
                      Math.max(thread._count.posts - 1, 0),
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="boards" className="scroll-mt-6">
          <h2 className="text-lg font-semibold text-slate-900">{m.home.boards}</h2>
          <div className="mt-4 space-y-3">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/b/${board.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-slate-900">{board.name}</h3>
                  <span className="text-xs text-slate-500">
                    {m.home.boardThreads(board._count.threads)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{board.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-base font-semibold text-amber-900">{m.home.rulesTitle}</h2>
        <ul className="mt-3 grid gap-2 text-sm text-amber-900 sm:grid-cols-3">
          {m.home.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
