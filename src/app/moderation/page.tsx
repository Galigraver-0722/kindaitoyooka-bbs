import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Moderation" };
export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/moderation");
  }
  if (!isModerator(user)) {
    redirect("/");
  }

  const reports = await prisma.report.findMany({
    where: { resolvedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      reporter: { select: { username: true } },
      post: {
        include: {
          author: { select: { username: true } },
          thread: {
            select: {
              id: true,
              title: true,
              isDeleted: true,
              board: { select: { slug: true, name: true } },
            },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Moderation</h1>
      <p className="mt-1 text-sm text-slate-500">
        Signed in as {user.username}. Every action is attributed to your account in the database.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Open reports</h2>

        {reports.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Nothing needs review right now.
          </p>
        ) : (
          <ul className="mt-3 space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Reported by <span className="font-medium text-slate-700">{report.reporter.username}</span>
                    {" · "}
                    {formatDateTime(report.createdAt)}
                  </span>
                  <Link
                    href={`/t/${report.post.thread.id}#p-${report.post.id}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Open in thread
                  </Link>
                </div>

                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {report.reason}
                </p>

                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    {report.post.author.username} in{" "}
                    <span className="font-medium text-slate-700">{report.post.thread.title}</span> (
                    {report.post.thread.board.name})
                    {report.post.thread.isDeleted ? " — thread already removed" : ""}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">
                    {report.post.isDeleted ? "This post was already removed." : report.post.body}
                  </p>
                </div>

                {!report.post.isDeleted ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={`/api/reports/${report.id}/resolve`} method="post">
                      <input type="hidden" name="action" value="remove" />
                      <button
                        type="submit"
                        className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700"
                      >
                        Remove post
                      </button>
                    </form>
                    <form action={`/api/reports/${report.id}/resolve`} method="post">
                      <input type="hidden" name="action" value="dismiss" />
                      <button
                        type="submit"
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        Dismiss report
                      </button>
                    </form>
                  </div>
                ) : (
                  <form action={`/api/reports/${report.id}/resolve`} method="post" className="mt-4">
                    <input type="hidden" name="action" value="dismiss" />
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      Close report
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
