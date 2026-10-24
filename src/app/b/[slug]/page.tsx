import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { sortByHot } from "@/lib/hot";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { getUnreadThreadIds } from "@/lib/read-state";

export const dynamic = "force-dynamic";

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; sort?: string }>;
}) {
  const [{ slug }, { error, sort }, locale] = await Promise.all([
    params,
    searchParams,
    getLocale(),
  ]);
  const order = sort === "hot" ? "hot" : "latest";
  const m = t(locale);

  const [board, user] = await Promise.all([
    prisma.board.findUnique({
      where: { slug },
      include: {
        _count: { select: { threads: { where: { isDeleted: false } } } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!board) {
    notFound();
  }

  const threads = await prisma.thread.findMany({
    where: { boardId: board.id, isDeleted: false },
    orderBy: { lastPostAt: "desc" },
    include: {
      author: { select: { username: true } },
      _count: { select: { posts: true } },
    },
  });

  const sorted =
    order === "hot"
      ? sortByHot(
          threads.map((thread) => ({
            ...thread,
            replyCount: Math.max(thread._count.posts - 1, 0),
          })),
        )
      : threads;

  const ordered = [...sorted].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  const unread = await getUnreadThreadIds(user?.id, threads);

  const errorText = errorMessage(error, locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          {m.board.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{board.name}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{board.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{board.description}</p>
          <p className="mt-1 text-xs text-slate-400">
            {m.board.visibleThreads(board._count.threads)}
          </p>
          <div className="mt-3 flex gap-2 text-sm">
            <Link
              href={`/b/${board.slug}?sort=latest`}
              className={`rounded-full px-3 py-1 ${
                order === "latest"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {m.sort.latest}
            </Link>
            <Link
              href={`/b/${board.slug}?sort=hot`}
              className={`rounded-full px-3 py-1 ${
                order === "hot"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {m.sort.hot}
            </Link>
          </div>
        </div>
        <Link
          href={`/new?board=${board.slug}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {m.board.newThread}
        </Link>
      </header>

      {errorText ? (
        <p className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {errorText}
        </p>
      ) : null}

      {threads.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          {m.board.empty}
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {ordered.map((thread) => (
            <li key={thread.id} className="px-4 py-4 transition hover:bg-slate-50">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
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
                {m.board.threadMeta(thread.author.username, Math.max(thread._count.posts - 1, 0))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
