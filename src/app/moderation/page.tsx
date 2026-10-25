import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Crumb, ThemedPage } from "@/components/theme/themed-page";
import { getCurrentUser, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).moderation.title };
}

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const [user, locale, theme] = await Promise.all([getCurrentUser(), getLocale(), getTheme()]);
  const m = t(locale).moderation;
  const audit = t(locale).audit;
  const copy = t(locale).shell;

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
    <ThemedPage theme={theme} username={user.username}>
      <main>
        <section className="banner">
          <div className="page-head">
            <Crumb items={[{ href: "/", label: copy.boards }, { label: m.title }]} />
            <h1>{m.title}</h1>
            <p className="lede">{m.signedInAs(user.username)}</p>
            <div className="board-stats">
              <div className="bs">
                <span>{m.queue}</span>
                <b>{reports.length}</b>
              </div>
              <div className="bs">
                <span>{audit.title}</span>
                <b>{auditLogs.length}</b>
              </div>
            </div>
          </div>
        </section>

        <section className="mod-sec">
          <h2 className="sec-head"><span className="tick" />{m.queue}</h2>
          {reports.length === 0 ? (
            <p className="empty">{m.empty}</p>
          ) : (
            <ul className="mod-list">
              {reports.map((report) => (
                <li key={report.id} className="mod-card">
                  <div className="mod-top">
                    <span className="pill kind">
                      {report.source === "AUTO" ? m.autoDetected : m.report}
                    </span>
                    <span className="when">
                      {report.source === "AUTO"
                        ? formatDateTime(report.createdAt, locale)
                        : m.reportedBy(report.reporter?.username ?? "", formatDateTime(report.createdAt, locale))}
                    </span>
                    <Link className="pill open" href={`/t/${report.post.thread.id}#p-${report.post.id}`}>
                      {m.openThread}
                    </Link>
                  </div>

                  <p className="mod-reason">{report.reason}</p>

                  <div className="mod-quote">
                    <p className="src">
                      {m.postContext(
                        report.post.author.username,
                        report.post.thread.title,
                        report.post.thread.board.name,
                      )}
                      {report.post.thread.isDeleted ? ` — ${m.removedThread}` : null}
                    </p>
                    <p className="text">{report.post.isDeleted ? m.removedPost : report.post.body}</p>
                  </div>

                  <div className="mod-acts">
                    {!report.post.isDeleted ? (
                      <form action={`/api/reports/${report.id}/resolve`} method="post">
                        <input type="hidden" name="action" value="remove" />
                        <button type="submit" className="btn danger">{m.removePost}</button>
                      </form>
                    ) : null}
                    <form action={`/api/reports/${report.id}/resolve`} method="post">
                      <input type="hidden" name="action" value="dismiss" />
                      <button type="submit" className="btn ghost">
                        {report.post.isDeleted ? m.closeReport : m.dismiss}
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mod-sec">
          <h2 className="sec-head"><span className="tick" />{audit.title}</h2>
          {auditLogs.length === 0 ? (
            <p className="empty">{audit.empty}</p>
          ) : (
            <ol className="audit-list">
              {auditLogs.map((log) => (
                <li key={log.id}>
                  <span className="what">
                    {audit.actions[log.action] ?? log.action}
                    <span className="tgt">{log.targetType}:{log.targetId.slice(0, 8)}</span>
                  </span>
                  <span className="when">
                    {log.actor?.username ?? "system"} / {formatDateTime(log.createdAt, locale)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </ThemedPage>
  );
}
