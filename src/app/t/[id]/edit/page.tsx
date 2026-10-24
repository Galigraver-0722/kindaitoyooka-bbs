import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { LIMITS } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).editing.title };
}

export const dynamic = "force-dynamic";

export default async function EditThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, locale, user] = await Promise.all([
    params,
    searchParams,
    getLocale(),
    getCurrentUser(),
  ]);
  const m = t(locale);

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/t/${id}/edit`)}`);
  }

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      board: { select: { slug: true, name: true } },
      tags: { select: { name: true }, orderBy: { name: "asc" } },
      posts: { orderBy: { createdAt: "asc" }, take: 1, select: { id: true, body: true } },
    },
  });

  if (!thread || thread.isDeleted) {
    notFound();
  }
  if (!canEditThread(user.id, thread)) {
    redirect(`/t/${thread.id}?error=edit-not-allowed`);
  }

  const openingPost = thread.posts[0];
  const errorText = errorMessage(error, locale);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          {m.board.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/b/${thread.board.slug}`} className="hover:text-slate-800">
          {thread.board.name}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/t/${thread.id}`} className="line-clamp-1 hover:text-slate-800">
          {thread.title}
        </Link>
      </nav>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{m.editing.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{m.editing.subtitle}</p>

      {errorText ? (
        <p className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {errorText}
        </p>
      ) : null}

      <form
        action={`/api/threads/${thread.id}/edit`}
        method="post"
        className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            {m.newThread.titleLabel}
          </label>
          <input
            id="title"
            name="title"
            required
            minLength={LIMITS.titleMin}
            maxLength={LIMITS.titleMax}
            defaultValue={thread.title}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700">
            {m.tagField.label}
          </label>
          <input
            id="tags"
            name="tags"
            maxLength={150}
            defaultValue={thread.tags.map((tag) => `#${tag.name}`).join(" ")}
            placeholder={m.tagField.placeholder}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="mt-1 text-xs text-slate-500">{m.tagField.hint}</p>
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-slate-700">
            {m.newThread.message}
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={8}
            maxLength={LIMITS.bodyMax}
            defaultValue={openingPost?.body ?? ""}
            className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <p className="mt-1 text-xs text-slate-500">{m.newThread.charLimit(LIMITS.bodyMax)}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
          >
            {m.editing.save}
          </button>
          <Link href={`/t/${thread.id}`} className="text-sm text-slate-600 hover:text-slate-900">
            {m.editing.cancel}
          </Link>
        </div>
      </form>
    </main>
  );
}
