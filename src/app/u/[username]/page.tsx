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
    <main className="shell page">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">{m.profile.title}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-[2.2rem] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[2.8rem]">
            {profile.username}
          </h1>
          <RoleChip role={profile.role} locale={locale} />
        </div>
        <p className="meta mt-3">{m.profile.joined(formatDateTime(profile.createdAt, locale))}</p>

        <dl className="mt-8 flex gap-10 border-t border-line pt-5">
          <div>
            <dt className="eyebrow">{m.profile.threadsLabel}</dt>
            <dd className="mt-1 font-mono text-[24px] leading-none tabular-nums">
              {String(threadCount).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">{m.profile.postsLabel}</dt>
            <dd className="mt-1 font-mono text-[24px] leading-none tabular-nums">
              {String(postCount).padStart(2, "0")}
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-12">
        <h2 className="title-section">{m.profile.recentThreads}</h2>
        {threads.length === 0 ? (
          <p className="mt-4 border-t border-line pt-6 text-[13px] text-muted">
            {m.profile.noThreads}
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-line border-t border-line">
            {threads.map((thread) => (
              <li key={thread.id}>
                <Link
                  href={`/t/${thread.id}`}
                  className="group row-hover -mx-3 block px-3 py-4"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="eyebrow">{thread.board.name}</span>
                    <time className="meta">{formatDateTime(thread.createdAt, locale)}</time>
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                    {thread.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-muted">
                    {m.board.threadMeta(profile.username, Math.max(thread._count.posts - 1, 0))}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-12">
        <h2 className="title-section">{m.profile.recentPosts}</h2>
        {posts.length === 0 ? (
          <p className="mt-4 border-t border-line pt-6 text-[13px] text-muted">
            {m.profile.noPosts}
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-line border-t border-line">
            {posts.map((post) => (
              <li key={post.id} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/t/${post.thread.id}#p-${post.id}`}
                    className="text-[12px] font-medium text-ink transition-colors hover:text-accent"
                  >
                    {m.profile.inThread(post.thread.title)}
                  </Link>
                  <time className="meta">{formatDateTime(post.createdAt, locale)}</time>
                </div>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-[13px] leading-[1.9] text-ink/80">
                  {post.body}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
