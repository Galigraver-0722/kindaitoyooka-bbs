import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ slug }, { error }, locale] = await Promise.all([params, searchParams, getLocale()]);
  const m = t(locale);

  const board = await prisma.board.findUnique({
    where: { slug },
    include: {
      _count: { select: { threads: { where: { isDeleted: false } } } },
    },
  });

  if (!board) {
    notFound();
  }

  const threads = await prisma.thread.findMany({
    where: { boardId: board.id, isDeleted: false },
    orderBy: [{ isPinned: "desc" }, { lastPostAt: "desc" }],
    include: {
      author: { select: { username: true } },
      _count: { select: { posts: true } },
    },
  });

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
          {threads.map((thread) => (
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
