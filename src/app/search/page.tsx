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
    <main className="shell page">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">{m.search.title}</p>
        <h1 className="title-page mt-3">{m.search.title}</h1>

        <form action="/search" method="get" className="mt-6 flex max-w-2xl flex-wrap gap-2">
          <input
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder={m.search.placeholder}
            className="field min-w-0 flex-1 py-2.5"
          />
          {tagName ? <input type="hidden" name="tag" value={tagName} /> : null}
          <input type="hidden" name="sort" value={order} />
          <button type="submit" className="btn btn-primary">
            {m.search.submit}
          </button>
        </form>
      </header>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <div className="flex gap-6">
          <Link
            href={searchHref({ q: query || undefined, tag: tagName || undefined, sort: "latest" })}
            className={`-mb-px border-b-2 pb-3 text-[12px] transition-colors ${
              order === "latest"
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m.sort.latest}
          </Link>
          <Link
            href={searchHref({ q: query || undefined, tag: tagName || undefined, sort: "hot" })}
            className={`-mb-px border-b-2 pb-3 text-[12px] transition-colors ${
              order === "hot"
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m.sort.hot}
          </Link>
        </div>

        {tagName ? (
          <div className="flex items-center gap-4 pb-3">
            <Link href={tagSearchHref(tagName)} className="tag">
              {m.search.tagLabel(tagName)}
            </Link>
            <Link href={searchHref({ q: query || undefined, sort: order })} className="btn-quiet">
              {m.search.clearTag}
            </Link>
          </div>
        ) : null}
      </div>

      <p className="meta mt-5">{m.search.resultCount(threads.length)}</p>

      {threads.length === 0 ? (
        <p className="mt-8 border-t border-line pt-8 text-[13px] text-muted">{m.search.empty}</p>
      ) : (
        <ol className="mt-2 divide-y divide-line">
          {threads.map((thread, index) => (
            <li
              key={thread.id}
              className="group row-hover -mx-3 grid grid-cols-[2.2rem_1fr] gap-4 px-3 py-5 sm:grid-cols-[2.75rem_1fr]"
            >
              <span className="num pt-1">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="eyebrow">{thread.board.name}</span>
                  <time className="meta">{formatDateTime(thread.lastPostAt, locale)}</time>
                </div>
                <h2 className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.012em]">
                  <Link
                    href={`/t/${thread.id}`}
                    className="text-ink transition-colors duration-150 group-hover:text-accent"
                  >
                    {thread.title}
                  </Link>
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                  <span>{thread.author.username}</span>
                  <span aria-hidden="true">/</span>
                  <span>♡ {thread.likeCount}</span>
                  <span aria-hidden="true">/</span>
                  <span>{m.thread.replies(Math.max(thread._count.posts - 1, 0))}</span>
                </div>
                {thread.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {thread.tags.map((tag) => (
                      <Link key={tag.name} href={tagSearchHref(tag.name)} className="tag">
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
