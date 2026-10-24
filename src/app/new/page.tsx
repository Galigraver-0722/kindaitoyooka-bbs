import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { parseSuggestedTags } from "@/lib/tags";
import { LIMITS } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).newThread.title };
}

export const dynamic = "force-dynamic";

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string; error?: string }>;
}) {
  const [{ board: preferredSlug, error }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(preferredSlug ? `/new?board=${preferredSlug}` : "/new")}`,
    );
  }

  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true, suggestedTags: true },
  });

  const selectedBoard = boards.find((board) => board.slug === preferredSlug) ?? boards[0];
  const suggestedTags = selectedBoard ? parseSuggestedTags(selectedBoard.suggestedTags) : [];
  const errorText = errorMessage(error, locale);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          {m.board.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{m.newThread.title}</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {m.newThread.title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{m.newThread.subtitle}</p>

      {errorText ? (
        <p className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {errorText}
        </p>
      ) : null}

      {boards.length === 0 || !selectedBoard ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          {m.newThread.noBoards}
        </p>
      ) : (
        <form
          action="/api/threads"
          method="post"
          className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="boardId" className="block text-sm font-medium text-slate-700">
              {m.newThread.board}
            </label>
            <select
              id="boardId"
              name="boardId"
              defaultValue={selectedBoard.id}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

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
              placeholder={m.newThread.titlePlaceholder}
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
              placeholder={m.tagField.placeholder}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="mt-1 text-xs text-slate-500">{m.tagField.hint}</p>
            {suggestedTags.length > 0 ? (
              <p className="mt-0.5 text-xs text-slate-400">
                {m.tagField.suggested(
                  selectedBoard.name,
                  suggestedTags.map((tag) => `#${tag}`).join(" "),
                )}
              </p>
            ) : null}
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
              className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="mt-1 text-xs text-slate-500">
              {m.newThread.charLimit(LIMITS.bodyMax)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
            >
              {m.newThread.submit}
            </button>
            <Link
              href={preferredSlug ? `/b/${preferredSlug}` : "/"}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {m.newThread.cancel}
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
