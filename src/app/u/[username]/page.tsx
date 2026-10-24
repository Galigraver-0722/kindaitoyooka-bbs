import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleChip } from "@/components/role-chip";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const [{ username }, locale] = await Promise.all([params, getLocale()]);
  return { title: `${username} · ${t(locale).profile.title}` };
}

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [{ username }, locale] = await Promise.all([params, getLocale()]);
  const m = t(locale);

  const profile = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true, username: true, role: true, createdAt: true },
  });

  if (!profile) {
    notFound();
  }

  const [threads, posts, threadCount, postCount] = await Promise.all([
    prisma.thread.findMany({
      where: { authorId: profile.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
        board: { select: { slug: true, name: true } },
        _count: { select: { posts: true } },
      },
    }),
    prisma.post.findMany({
      where: {
        authorId: profile.id,
        isDeleted: false,
        thread: { isDeleted: false },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        body: true,
        createdAt: true,
        thread: { select: { id: true, title: true } },
      },
    }),
    prisma.thread.count({ where: { authorId: profile.id, isDeleted: false } }),
    prisma.post.count({
      where: { authorId: profile.id, isDeleted: false, thread: { isDeleted: false } },
    }),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.username}</h1>
          <RoleChip role={profile.role} locale={locale} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {m.profile.joined(formatDateTime(profile.createdAt, locale))}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {m.profile.threadCount(threadCount)}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {m.profile.postCount(postCount)}
          </span>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">{m.profile.recentThreads}</h2>
        {threads.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            {m.profile.noThreads}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {threads.map((thread) => (
              <li key={thread.id} className="px-4 py-3 transition hover:bg-slate-50">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <Link
                    href={`/b/${thread.board.slug}`}
                    className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-200"
                  >
                    {thread.board.name}
                  </Link>
                  <span>{formatDateTime(thread.createdAt, locale)}</span>
                </div>
                <Link
                  href={`/t/${thread.id}`}
                  className="mt-1 block text-base font-medium text-slate-900 hover:text-indigo-700"
                >
                  {thread.title}
                </Link>
                <p className="mt-0.5 text-sm text-slate-500">
                  {m.board.threadMeta(profile.username, Math.max(thread._count.posts - 1, 0))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">{m.profile.recentPosts}</h2>
        {posts.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            {m.profile.noPosts}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-500">
                  <Link
                    href={`/t/${post.thread.id}#p-${post.id}`}
                    className="font-medium text-slate-700 hover:text-indigo-700"
                  >
                    {m.profile.inThread(post.thread.title)}
                  </Link>
                  <time>{formatDateTime(post.createdAt, locale)}</time>
                </div>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-slate-800">
                  {post.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
