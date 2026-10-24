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
    <main className="shell page">
      {signedOutNotice ? (
        <p className="notice notice-success mb-10">{signedOutNotice}</p>
      ) : null}

      <section className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <p className="eyebrow">{m.home.eyebrow}</p>
          <h1 className="display mt-5 max-w-[15ch]">{m.home.title}</h1>
          <p className="mt-7 max-w-[52ch] text-[15px] leading-[1.95] text-muted">
            {m.home.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/new" className="btn btn-primary">
              {m.home.startThread}
            </Link>
            <Link href="#boards" className="btn btn-secondary">
              {m.home.browseBoards}
            </Link>
          </div>
        </div>

        <aside
          id="boards"
          className="border-t border-line pt-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="eyebrow">{m.home.boards}</h2>
            <span className="num">{String(boards.length).padStart(2, "0")}</span>
          </div>

          <ol className="mt-4">
            {boards.map((board) => (
              <li key={board.id} className="border-t border-line first:border-t-0">
                <Link href={`/b/${board.slug}`} className="group block py-3.5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-ink transition-colors group-hover:text-accent">
                      {board.name}
                    </span>
                    <span className="num">{String(board._count.threads).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-1 block line-clamp-1 text-[11px] text-muted">
                    {board.description}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="mt-16 border-t border-line pt-8 sm:mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="title-section">{m.home.recent}</h2>
          <span className="meta">{m.home.newestThreads(recentThreads.length)}</span>
        </div>

        {recentThreads.length === 0 ? (
          <p className="mt-8 border-t border-line pt-8 text-[13px] text-muted">{m.home.empty}</p>
        ) : (
          <ol className="mt-6 divide-y divide-line border-t border-line">
            {recentThreads.map((thread, index) => (
              <li key={thread.id}>
                <Link
                  href={`/t/${thread.id}`}
                  className="group row-hover -mx-3 grid grid-cols-[2rem_1fr] gap-4 px-3 py-5 sm:grid-cols-[2.75rem_1fr]"
                >
                  <span className="num pt-1">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="eyebrow">{thread.board.name}</span>
                      {thread.isPinned ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                          {m.board.pinned}
                        </span>
                      ) : null}
                      {unread.has(thread.id) ? (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          {m.board.unread}
                        </span>
                      ) : null}
                      <time className="meta">{formatDateTime(thread.lastPostAt, locale)}</time>
                    </div>
                    <h3 className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.012em] text-ink transition-colors duration-150 group-hover:text-accent">
                      {thread.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-muted">
                      {m.home.byReplies(
                        thread.author.username,
                        Math.max(thread._count.posts - 1, 0),
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-16 border-t border-line pt-8 sm:mt-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="title-section">{m.home.rulesTitle}</h2>
          <span className="eyebrow">01—03</span>
        </div>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {m.home.rules.map((rule, index) => (
            <li key={rule} className="border-t border-line pt-4">
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-[13px] leading-[1.85] text-ink/80">{rule}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
