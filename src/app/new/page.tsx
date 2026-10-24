import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { errorMessage } from "@/lib/messages";
import { LIMITS } from "@/lib/validation";

export const metadata: Metadata = { title: "New thread" };
export const dynamic = "force-dynamic";

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string; error?: string }>;
}) {
  const { board: preferredSlug, error } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(preferredSlug ? `/new?board=${preferredSlug}` : "/new")}`);
  }

  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true },
  });

  const selectedBoard = boards.find((board) => board.slug === preferredSlug) ?? boards[0];
  const errorText = errorMessage(error);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          Boards
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">New thread</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Start a thread</h1>
      <p className="mt-1 text-sm text-slate-500">
        Threads are public. Do not include other people&apos;s personal information.
      </p>

      {errorText ? (
        <p className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {errorText}
        </p>
      ) : null}

      {boards.length === 0 || !selectedBoard ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          No boards are open yet. Ask an administrator to create one.
        </p>
      ) : (
        <form
          action="/api/threads"
          method="post"
          className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="boardId" className="block text-sm font-medium text-slate-700">
              Board
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
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              minLength={LIMITS.titleMin}
              maxLength={LIMITS.titleMax}
              placeholder="What is this thread about?"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700">
              Message
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
              Plain text only. Up to {LIMITS.bodyMax.toLocaleString("en-US")} characters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
            >
              Post thread
            </button>
            <Link
              href={preferredSlug ? `/b/${preferredSlug}` : "/"}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
