import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).moderation.title };
}

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const m = t(locale);

  if (!user) {
    redirect("/login?next=/moderation");
  }
  if (!isModerator(user)) {
    redirect("/");
  }

  const [reports, auditLogs] = await Promise.all([
    prisma.report.findMany({
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
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { actor: { select: { username: true } } },
    }),
  ]);

  return (
    <main className="shell page">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">{m.moderation.title}</p>
        <h1 className="title-page mt-3">{m.moderation.title}</h1>
        <p className="meta mt-3">{m.moderation.signedInAs(user.username)}</p>
      </header>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="title-section">{m.moderation.openReports}</h2>
          <span className="num">{String(reports.length).padStart(2, "0")}</span>
        </div>

        {reports.length === 0 ? (
          <p className="mt-4 border-t border-line pt-6 text-[13px] text-muted">
            {m.moderation.empty}
          </p>
        ) : (
          <ul className="mt-2">
            {reports.map((report) => (
              <li key={report.id} className="border-t border-line py-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {report.source === "AUTO" ? (
                      <span className="border border-accent/35 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent">
                        {m.moderation.autoDetected}
                      </span>
                    ) : null}
                    <span className="meta">
                      {report.source === "AUTO"
                        ? formatDateTime(report.createdAt, locale)
                        : m.moderation.reportedBy(
                            report.reporter?.username ?? "",
                            formatDateTime(report.createdAt, locale),
                          )}
                    </span>
                  </div>
                  <Link
                    href={`/t/${report.post.thread.id}#p-${report.post.id}`}
                    className="btn-quiet"
                  >
                    {m.moderation.openThread}
                  </Link>
                </div>

                <p className="mt-4 border-l-2 border-accent pl-4 text-[13px] leading-[1.85] text-ink">
                  {report.reason}
                </p>

                <div className="mt-4 border border-line bg-surface p-4">
                  <p className="meta">
                    {m.moderation.postContext(
                      report.post.author.username,
                      report.post.thread.title,
                      report.post.thread.board.name,
                    )}
                    {report.post.thread.isDeleted
                      ? ` — ${m.moderation.removedThread}`
                      : null}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-[1.9] text-ink/80">
                    {report.post.isDeleted ? m.moderation.removedPost : report.post.body}
                  </p>
                </div>

                {!report.post.isDeleted ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={`/api/reports/${report.id}/resolve`} method="post">
                      <input type="hidden" name="action" value="remove" />
                      <button type="submit" className="btn btn-danger px-3 py-2 text-[12px]">
                        {m.moderation.removePost}
                      </button>
                    </form>
                    <form action={`/api/reports/${report.id}/resolve`} method="post">
                      <input type="hidden" name="action" value="dismiss" />
                      <button type="submit" className="btn btn-secondary px-3 py-2 text-[12px]">
                        {m.moderation.dismiss}
                      </button>
                    </form>
                  </div>
                ) : (
                  <form action={`/api/reports/${report.id}/resolve`} method="post" className="mt-4">
                    <input type="hidden" name="action" value="dismiss" />
                    <button type="submit" className="btn btn-secondary px-3 py-2 text-[12px]">
                      {m.moderation.closeReport}
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="title-section">{m.audit.title}</h2>
          <span className="num">{String(auditLogs.length).padStart(2, "0")}</span>
        </div>
        {auditLogs.length === 0 ? (
          <p className="mt-4 border-t border-line pt-6 text-[13px] text-muted">{m.audit.empty}</p>
        ) : (
          <ul className="mt-2">
            {auditLogs.map((log) => (
              <li
                key={log.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line py-3"
              >
                <span className="text-[13px] text-ink">
                  {m.audit.actions[log.action] ?? log.action}
                  <span className="ml-3 font-mono text-[10px] text-muted">
                    {log.targetType}:{log.targetId.slice(0, 8)}
                  </span>
                </span>
                <span className="meta">
                  {log.actor?.username ?? "system"} / {formatDateTime(log.createdAt, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
