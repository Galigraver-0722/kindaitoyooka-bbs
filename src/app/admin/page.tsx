import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Crumb, ThemedPage } from "@/components/theme/themed-page";
import { canRestore, canSuspend } from "@/lib/admin";
import { getCurrentUser, isAdmin, isModerator } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { getTheme } from "@/lib/theme";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).admin.title };
}

export const dynamic = "force-dynamic";

const PER_PAGE = 20;
const REPORTS_PER_PAGE = 10;
const ROLES = ["STUDENT", "MODERATOR", "ADMIN"] as const;

type Tab = "reports" | "users" | "content" | "blocked" | "boards" | "audit";

export default async function ConsolePage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    q?: string;
    role?: string;
    notice?: string;
    error?: string;
  }>;
}) {
  const [params, user, locale, theme] = await Promise.all([
    searchParams,
    getCurrentUser(),
    getLocale(),
    getTheme(),
  ]);

  if (!user) {
    redirect("/login?next=/admin");
  }
  if (!isModerator(user)) {
    redirect("/");
  }

  const copy = t(locale).admin;
  const moderation = t(locale).moderation;
  const shell = t(locale).shell;
  const admin = isAdmin(user);

  const requested: Tab =
    params.tab === "users" ||
    params.tab === "content" ||
    params.tab === "blocked" ||
    params.tab === "boards" ||
    params.tab === "audit"
      ? (params.tab as Tab)
      : "reports";
  // A non-administrator asking for the board tab gets the queue instead of an
  // empty page; the tab itself is not rendered for them either.
  const tab: Tab = requested === "boards" && !admin ? "reports" : requested;
  const query = (params.q ?? "").trim();
  const roleFilter = ROLES.includes((params.role ?? "") as (typeof ROLES)[number])
    ? (params.role as (typeof ROLES)[number])
    : undefined;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [openReports, userCount, threadCount, postCount, blockedCount] = await Promise.all([
    prisma.report.count({ where: { resolvedAt: null } }),
    prisma.user.count(),
    prisma.thread.count({ where: { isDeleted: false } }),
    prisma.post.count({ where: { isDeleted: false } }),
    prisma.blockedAttempt.count(),
  ]);

  const noticeText = noticeMessage(params.notice, locale);
  const errorText = errorMessage(params.error, locale);

  const tabHref = (next: Tab) => {
    const search = new URLSearchParams({ tab: next });
    if (query && (next === "users" || next === "content")) search.set("q", query);
    if (roleFilter && next === "users") search.set("role", roleFilter);
    return `/admin?${search.toString()}`;
  };

  return (
    <ThemedPage theme={theme} username={user.username}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: shell.boards }, { label: copy.title }]} />
          <h1>{copy.title}</h1>
          <p className="lede">{copy.lede(user.username)}</p>
          <div className="row-meta">
            <span className="pill kind">{admin ? moderation.roleAdmin : moderation.roleModerator}</span>
          </div>
          <div className="board-stats">
            <div className="bs"><span>{copy.stats.reports}</span><b>{openReports}</b></div>
            <div className="bs"><span>{copy.stats.users}</span><b>{userCount}</b></div>
            <div className="bs"><span>{copy.stats.threads}</span><b>{threadCount}</b></div>
            <div className="bs"><span>{copy.stats.posts}</span><b>{postCount}</b></div>
            <div className="bs"><span>{copy.stats.blocked}</span><b>{blockedCount}</b></div>
          </div>
        </div>

        {noticeText ? <p className="notice success">{noticeText}</p> : null}
        {errorText ? <p className="notice error">{errorText}</p> : null}

        <nav className="adm-tabs" aria-label={copy.title}>
          {(
            [
              ["reports", copy.tabs.reports],
              ["users", copy.tabs.users],
              ["content", copy.tabs.content],
              ["blocked", copy.tabs.blocked],
              ["audit", copy.tabs.audit],
              ...(admin ? [["boards", copy.tabs.boards] as [Tab, string]] : []),
            ] as Array<[Tab, string]>
          ).map(([key, label]) => (
            <Link key={key} href={tabHref(key)} className={tab === key ? "on" : ""} aria-current={tab === key ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>

        {tab === "reports" ? (
          <ReportsTab
            page={requestedPage}
            locale={locale}
            copy={moderation}
            openReports={openReports}
          />
        ) : null}

        {tab === "users" ? (
          <UsersTab
            actor={user}
            admin={admin}
            locale={locale}
            query={query}
            roleFilter={roleFilter}
            page={requestedPage}
          />
        ) : null}

        {tab === "content" ? (
          <ContentTab locale={locale} query={query} page={requestedPage} />
        ) : null}

        {tab === "blocked" ? <BlockedTab locale={locale} /> : null}

        {tab === "boards" && admin ? <BoardsTab copy={moderation} /> : null}

        {tab === "audit" ? <AuditTab locale={locale} /> : null}
      </main>
    </ThemedPage>
  );
}

async function ReportsTab({
  page,
  locale,
  copy,
  openReports,
}: {
  page: number;
  locale: Locale;
  copy: ReturnType<typeof t>["moderation"];
  openReports: number;
}) {
  const reports = await prisma.report.findMany({
    where: { resolvedAt: null },
    orderBy: { createdAt: "asc" },
    skip: (page - 1) * REPORTS_PER_PAGE,
    take: REPORTS_PER_PAGE,
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

  const pageCount = Math.max(1, Math.ceil(openReports / REPORTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pagerHref = (target: number) =>
    target > 1 ? `/admin?tab=reports&page=${target}` : "/admin?tab=reports";

  return (
    <section className="mod-sec">
      <h2 className="sec-head"><span className="tick" />{copy.queue}</h2>
      {reports.length === 0 ? (
        <p className="empty">{copy.empty}</p>
      ) : (
        <ul className="mod-list">
          {reports.map((report) => (
            <li key={report.id} className="mod-card">
              <div className="mod-top">
                <span className="pill kind">{report.source === "AUTO" ? copy.autoDetected : copy.report}</span>
                <span className="when">
                  {report.source === "AUTO"
                    ? formatDateTime(report.createdAt, locale)
                    : copy.reportedBy(report.reporter?.username ?? "", formatDateTime(report.createdAt, locale))}
                </span>
                <Link className="pill open" href={`/t/${report.post.thread.id}#p-${report.post.id}`}>
                  {copy.openThread}
                </Link>
              </div>

              <p className="mod-reason">{report.reason}</p>

              <div className="mod-quote">
                <p className="src">
                  {copy.postContext(
                    report.post.author.username,
                    report.post.thread.title,
                    report.post.thread.board.name,
                  )}
                  {report.post.thread.isDeleted ? ` — ${copy.removedThread}` : null}
                </p>
                <p className="text">{report.post.isDeleted ? copy.removedPost : report.post.body}</p>
              </div>

              <div className="mod-acts">
                {!report.post.isDeleted ? (
                  <form action={`/api/reports/${report.id}/resolve`} method="post">
                    <input type="hidden" name="action" value="remove" />
                    <button type="submit" className="btn danger">{copy.removePost}</button>
                  </form>
                ) : null}
                <form action={`/api/reports/${report.id}/resolve`} method="post">
                  <input type="hidden" name="action" value="dismiss" />
                  <button type="submit" className="btn ghost">
                    {report.post.isDeleted ? copy.closeReport : copy.dismiss}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
      {pageCount > 1 ? (
        <nav className="pager" aria-label="pager">
          {currentPage > 1 ? <Link href={pagerHref(currentPage - 1)}>←</Link> : null}
          <span>{currentPage} / {pageCount}</span>
          {currentPage < pageCount ? <Link href={pagerHref(currentPage + 1)}>→</Link> : null}
        </nav>
      ) : null}
    </section>
  );
}

async function UsersTab({
  actor,
  admin,
  locale,
  query,
  roleFilter,
  page,
}: {
  actor: { id: string; role: "STUDENT" | "MODERATOR" | "ADMIN" };
  admin: boolean;
  locale: Locale;
  query: string;
  roleFilter?: "STUDENT" | "MODERATOR" | "ADMIN";
  page: number;
}) {
  const copy = t(locale).admin.users;
  const where = {
    ...(query ? { username: { contains: query } } : {}),
    ...(roleFilter ? { role: roleFilter } : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: [{ isSuspended: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        username: true,
        role: true,
        isSuspended: true,
        suspendedAt: true,
        suspendedReason: true,
        createdAt: true,
        _count: { select: { threads: true, posts: true } },
      },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pagerHref = (target: number) => {
    const search = new URLSearchParams({ tab: "users" });
    if (query) search.set("q", query);
    if (roleFilter) search.set("role", roleFilter);
    if (target > 1) search.set("page", String(target));
    return `/admin?${search.toString()}`;
  };

  const roleLabel = (role: string) =>
    role === "ADMIN" ? copy.roleAdmin : role === "MODERATOR" ? copy.roleModerator : copy.roleStudent;

  return (
    <section className="mod-sec">
      <h2 className="sec-head"><span className="tick" />{t(locale).admin.tabs.users}</h2>
      <p className="mod-hint">{copy.hint}</p>

      <form className="adm-search" action="/admin" method="get">
        <input type="hidden" name="tab" value="users" />
        <input name="q" defaultValue={query} placeholder={copy.searchPlaceholder} aria-label={copy.search} maxLength={40} />
        <select name="role" defaultValue={roleFilter ?? ""} aria-label={copy.role}>
          <option value="">{copy.allRoles}</option>
          <option value="STUDENT">{copy.roleStudent}</option>
          <option value="MODERATOR">{copy.roleModerator}</option>
          <option value="ADMIN">{copy.roleAdmin}</option>
        </select>
        <button type="submit" className="btn ghost">{copy.search}</button>
      </form>

      {users.length === 0 ? (
        <p className="empty">{copy.empty}</p>
      ) : (
        <ul className="adm-list">
          {users.map((row) => {
            const decision = canSuspend(actor, row);
            const restore = canRestore(actor, row);
            const isSelf = actor.id === row.id;
            return (
              <li key={row.id} className={`adm-row${row.isSuspended ? " is-suspended" : ""}`}>
                <div className="adm-who">
                  <Link href={`/u/${row.username}`}>{row.username}</Link>
                  <span className="adm-sub">
                    {formatDateTime(row.createdAt, locale)} · {copy.counts(row._count.threads, row._count.posts)}
                  </span>
                </div>

                <span className={`pill role-${row.role.toLowerCase()}`}>{roleLabel(row.role)}</span>

                <div className="adm-status">
                  {row.isSuspended ? (
                    <>
                      <span className="pill bad">{copy.statusSuspended}</span>
                      <span className="adm-sub">
                        {row.suspendedAt ? copy.suspendedAt(formatDateTime(row.suspendedAt, locale)) : ""}
                        {row.suspendedReason ? ` · ${copy.reason(row.suspendedReason)}` : ` · ${copy.noReason}`}
                      </span>
                    </>
                  ) : (
                    <span className="pill">{copy.statusActive}</span>
                  )}
                  {isSelf ? <span className="adm-sub">{copy.selfNote}</span> : null}
                </div>

                <div className="adm-acts">
                  {row.isSuspended ? (
                    restore.ok ? (
                      <form action={`/api/admin/users/${row.id}/restore`} method="post">
                        <button type="submit" className="btn ghost">{copy.restore}</button>
                      </form>
                    ) : null
                  ) : decision.ok ? (
                    <form action={`/api/admin/users/${row.id}/suspend`} method="post" className="adm-suspend">
                      <input name="reason" maxLength={200} placeholder={copy.reasonPlaceholder} aria-label={copy.reasonPlaceholder} />
                      <button type="submit" className="btn danger">{copy.suspend}</button>
                    </form>
                  ) : null}

                  {admin && !isSelf ? (
                    <form action={`/api/admin/users/${row.id}/role`} method="post" className="adm-role">
                      <select name="role" defaultValue={row.role} aria-label={copy.changeRole}>
                        <option value="STUDENT">{copy.roleStudent}</option>
                        <option value="MODERATOR">{copy.roleModerator}</option>
                        <option value="ADMIN">{copy.roleAdmin}</option>
                      </select>
                      <button type="submit" className="btn ghost">{copy.save}</button>
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 ? (
        <nav className="pager" aria-label="pager">
          {currentPage > 1 ? <Link href={pagerHref(currentPage - 1)}>←</Link> : null}
          <span>{currentPage} / {pageCount}</span>
          {currentPage < pageCount ? <Link href={pagerHref(currentPage + 1)}>→</Link> : null}
        </nav>
      ) : null}
    </section>
  );
}

async function ContentTab({
  locale,
  query,
  page,
}: {
  locale: Locale;
  query: string;
  page: number;
}) {
  const copy = t(locale).admin.content;

  const threadWhere = {
    ...(query ? { title: { contains: query } } : {}),
  };
  const postWhere = {
    parentId: { not: null },
    ...(query ? { body: { contains: query } } : {}),
  };

  const [threadTotal, postTotal, threads, posts] = await Promise.all([
    prisma.thread.count({ where: threadWhere }),
    prisma.post.count({ where: postWhere }),
    prisma.thread.findMany({
      where: threadWhere,
      orderBy: { lastPostAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        title: true,
        isDeleted: true,
        isLocked: true,
        lastPostAt: true,
        author: { select: { username: true } },
        board: { select: { name: true } },
        _count: { select: { posts: true } },
      },
    }),
    prisma.post.findMany({
      where: postWhere,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        body: true,
        isDeleted: true,
        createdAt: true,
        author: { select: { username: true } },
        thread: { select: { id: true, title: true, isDeleted: true } },
      },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(Math.max(threadTotal, postTotal) / PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pagerHref = (target: number) => {
    const search = new URLSearchParams({ tab: "content" });
    if (query) search.set("q", query);
    if (target > 1) search.set("page", String(target));
    return `/admin?${search.toString()}`;
  };

  return (
    <section className="mod-sec">
      <h2 className="sec-head"><span className="tick" />{t(locale).admin.tabs.content}</h2>
      <p className="mod-hint">{copy.hint}</p>

      <form className="adm-search" action="/admin" method="get">
        <input type="hidden" name="tab" value="content" />
        <input name="q" defaultValue={query} placeholder={copy.searchPlaceholder} aria-label={copy.search} maxLength={60} />
        <button type="submit" className="btn ghost">{copy.search}</button>
      </form>

      <h3 className="adm-subhead">{copy.threads} <span>{threadTotal}</span></h3>
      {threads.length === 0 ? (
        <p className="empty">{copy.noThreads}</p>
      ) : (
        <ul className="adm-list">
          {threads.map((thread) => (
            <li key={thread.id} className={`adm-row${thread.isDeleted ? " is-removed" : ""}`}>
              <div className="adm-who">
                <Link href={`/t/${thread.id}`}>{thread.title}</Link>
                <span className="adm-sub">
                  {thread.board.name} · {thread.author.username} · {formatDateTime(thread.lastPostAt, locale)} ·{" "}
                  {thread._count.posts}
                </span>
              </div>
              <div className="adm-status">
                {thread.isDeleted ? <span className="pill bad">{copy.removed}</span> : null}
                {thread.isLocked ? <span className="pill">{copy.locked}</span> : null}
              </div>
              <div className="adm-acts">
                <form action={`/api/admin/threads/${thread.id}/lock`} method="post">
                  <button type="submit" className="btn ghost">{thread.isLocked ? copy.unlock : copy.lock}</button>
                </form>
                {thread.isDeleted ? null : (
                  <form action={`/api/admin/threads/${thread.id}/remove`} method="post">
                    <button type="submit" className="btn danger">{copy.remove}</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="adm-subhead">{copy.posts} <span>{postTotal}</span></h3>
      {posts.length === 0 ? (
        <p className="empty">{copy.empty}</p>
      ) : (
        <ul className="adm-list">
          {posts.map((post) => (
            <li key={post.id} className={`adm-row${post.isDeleted ? " is-removed" : ""}`}>
              <div className="adm-who">
                <Link href={`/t/${post.thread.id}#p-${post.id}`}>{post.thread.title}</Link>
                <span className="adm-sub">
                  {post.author.username} · {formatDateTime(post.createdAt, locale)}
                </span>
                <span className={`adm-excerpt${post.isDeleted ? " is-gone" : ""}`}>
                  {post.isDeleted ? copy.removed : post.body.slice(0, 160)}
                </span>
              </div>
              <div className="adm-status">
                {post.isDeleted ? <span className="pill bad">{copy.removed}</span> : null}
                {post.thread.isDeleted ? <span className="pill">{copy.removed}</span> : null}
              </div>
              <div className="adm-acts">
                {post.isDeleted ? null : (
                  <form action={`/api/admin/posts/${post.id}/remove`} method="post">
                    <button type="submit" className="btn danger">{copy.remove}</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 ? (
        <nav className="pager" aria-label="pager">
          {currentPage > 1 ? <Link href={pagerHref(currentPage - 1)}>←</Link> : null}
          <span>{currentPage} / {pageCount}</span>
          {currentPage < pageCount ? <Link href={pagerHref(currentPage + 1)}>→</Link> : null}
        </nav>
      ) : null}
    </section>
  );
}

async function BoardsTab({ copy }: { copy: ReturnType<typeof t>["moderation"] }) {
  const boards = await prisma.board.findMany({
    where: { kind: "COMMUNITY" },
    orderBy: [{ isArchived: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      isArchived: true,
      owner: { select: { username: true } },
      _count: { select: { threads: true } },
    },
  });

  return (
    <section className="mod-sec">
      <h2 className="sec-head"><span className="tick" />{copy.adminSection}</h2>
      <p className="mod-hint">{copy.adminHint}</p>
      {boards.length === 0 ? (
        <p className="empty">{copy.emptyBoards}</p>
      ) : (
        <ul className="board-admin">
          {boards.map((board) => (
            <li key={board.id} className={board.isArchived ? "is-archived" : ""}>
              <div className="ba-main">
                <Link href={`/b/${board.slug}`}>{board.name}</Link>
                <span className="ba-meta">
                  /b/{board.slug} · {board.owner?.username ?? "—"} · {board._count.threads}
                </span>
              </div>
              {board.isArchived ? <span className="pill">{copy.archivedBadge}</span> : null}
              <form action={`/api/boards/${board.id}/archive`} method="post">
                <input type="hidden" name="action" value={board.isArchived ? "restore" : "archive"} />
                <button type="submit" className={`btn ${board.isArchived ? "" : "ghost"}`}>
                  {board.isArchived ? copy.restoreBoard : copy.archiveBoard}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function AuditTab({ locale }: { locale: Awaited<ReturnType<typeof getLocale>> }) {
  const copy = t(locale).audit;
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { actor: { select: { username: true } } },
  });

  return (
    <section className="mod-sec">
      <h2 className="sec-head"><span className="tick" />{copy.title}</h2>
      {logs.length === 0 ? (
        <p className="empty">{copy.empty}</p>
      ) : (
        <ol className="audit-list">
          {logs.map((log) => (
            <li key={log.id}>
              <span className="what">
                {copy.actions[log.action] ?? log.action}
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
  );
}

async function BlockedTab({ locale }: { locale: Locale }) {
  const copy = t(locale).admin.blocked;
  const rows = await prisma.blockedAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { username: true } } },
  });

  return (
    <section className="mod-sec">
      <h2 className="sec-head"><span className="tick" />{t(locale).admin.tabs.blocked}</h2>
      <p className="mod-hint">{copy.hint}</p>

      {rows.length === 0 ? (
        <p className="empty">{copy.empty}</p>
      ) : (
        <ul className="adm-list">
          {rows.map((row) => (
            <li key={row.id} className="adm-row adm-row-blocked">
              <div className="adm-who">
                <Link href={`/u/${row.user.username}`}>{row.user.username}</Link>
                <span className="adm-sub">
                  {copy.where}: {copy.surface[row.surface] ?? row.surface} · {copy.field}:{" "}
                  {copy.fields[row.field] ?? row.field}
                </span>
                <span className="adm-excerpt">{row.excerpt}</span>
              </div>
              <div className="adm-status">
                <span className="pill bad">{copy.words}: {row.words}</span>
              </div>
              <div className="adm-status">
                <span className="adm-sub">{formatDateTime(row.createdAt, locale)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
