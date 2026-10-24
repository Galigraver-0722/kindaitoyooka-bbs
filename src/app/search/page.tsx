import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { sortByHot } from "@/lib/hot";
import { getLocale, t } from "@/lib/i18n";
import { tagSearchHref } from "@/lib/tags";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).search.title };
}

export const dynamic = "force-dynamic";

function searchHref(params: { q?: string; tag?: string; sort?: string }): string {
  const search = new URLSearchParams();
  if (params.q) {
    search.set("q", params.q);
  }
  if (params.tag) {
    search.set("tag", params.tag);
  }
  if (params.sort) {
    search.set("sort", params.sort);
  }
  const value = search.toString();
  return value ? `/search?${value}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; tag?: string }>;
}) {
  const [{ q, sort, tag }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);

  const query = (q ?? "").trim().slice(0, 100);
  const tagName = (tag ?? "").trim().slice(0, 30).toLowerCase();
  const order = sort === "hot" ? "hot" : "latest";

  const where: Prisma.ThreadWhereInput = { isDeleted: false };
  if (tagName) {
    where.tags = { some: { name: tagName } };
  }
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { posts: { some: { body: { contains: query }, isDeleted: false } } },
    ];
  }

  const rows = await prisma.thread.findMany({
    where,
    take: 100,
    orderBy: { lastPostAt: "desc" },
    include: {
      board: { select: { slug: true, name: true } },
      author: { select: { username: true } },
      tags: { select: { name: true } },
      _count: { select: { posts: true } },
    },
  });

  const threads =
    order === "hot"
      ? sortByHot(
          rows.map((thread) => ({
            ...thread,
            replyCount: Math.max(thread._count.posts - 1, 0),
          })),
        )
      : rows;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{m.search.title}</h1>

      <form action="/search" method="get" className="mt-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={m.search.placeholder}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        {tagName ? <input type="hidden" name="tag" value={tagName} /> : null}
        <input type="hidden" name="sort" value={order} />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {m.search.submit}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-sm">
          <Link
            href={searchHref({ q: query || undefined, tag: tagName || undefined, sort: "latest" })}
            className={`rounded-full px-3 py-1 ${
              order === "latest"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m.sort.latest}
          </Link>
          <Link
            href={searchHref({ q: query || undefined, tag: tagName || undefined, sort: "hot" })}
            className={`rounded-full px-3 py-1 ${
              order === "hot"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m.sort.hot}
          </Link>
        </div>

        {tagName ? (
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={tagSearchHref(tagName)}
              className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700"
            >
              {m.search.tagLabel(tagName)}
            </Link>
            <Link
              href={searchHref({ q: query || undefined, sort: order })}
              className="text-slate-500 hover:text-slate-800"
            >
              {m.search.clearTag}
            </Link>
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-sm text-slate-500">{m.search.resultCount(threads.length)}</p>

      {threads.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          {m.search.empty}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {threads.map((thread) => (
            <li key={thread.id} className="px-4 py-4 transition hover:bg-slate-50">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Link
                  href={`/b/${thread.board.slug}`}
                  className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-200"
                >
                  {thread.board.name}
                </Link>
                <span>{formatDateTime(thread.lastPostAt, locale)}</span>
              </div>
              <Link
                href={`/t/${thread.id}`}
                className="mt-1 block text-base font-medium text-slate-900 hover:text-indigo-700"
              >
                {thread.title}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span>{thread.author.username}</span>
                <span>♡ {thread.likeCount}</span>
                <span>{m.thread.save} {thread.bookmarkCount}</span>
                <span>{m.thread.replies(Math.max(thread._count.posts - 1, 0))}</span>
              </div>
              {thread.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {thread.tags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={tagSearchHref(tag.name)}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
