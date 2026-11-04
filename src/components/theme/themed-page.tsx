import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { NotificationInbox, type InboxItem } from "@/components/theme/notification-inbox";
import { AnnouncementPanel, type AnnouncementItem } from "@/components/theme/announcement-panel";
import { listAnnouncements, unreadAnnouncements } from "@/lib/announcements";
import { AnchorHighlight } from "@/components/theme/anchor-highlight";
import { AutoRefresh } from "@/components/theme/auto-refresh";
import { RouteFreshness } from "@/components/theme/route-freshness";
import { getNotifications } from "@/lib/notifications";
import { ScrollHeader } from "@/components/theme/scroll-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { homeDCss } from "@/components/home/home-d-css";
import { homeBCss } from "@/components/home/home-b-css";
import { kinjoCss } from "@/components/theme/kinjo-css";
import { redesignCss } from "@/components/theme/redesign-css";
import { ShellInteractions } from "@/components/theme/shell-interactions";
import { polishCss } from "@/components/theme/polish-css";
import { pagesDCss, pagesBCss } from "@/components/theme/pages-css";
import type { HomeThread } from "@/components/home/types";
import { ToggleAction } from "@/components/theme/actions";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { timeAgo } from "@/lib/time-ago";
import type { Locale } from "@/lib/locales";
import { readableInk } from "@/lib/color";
import { Highlight } from "@/components/theme/highlight";

const replyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20 15a3 3 0 0 1-3 3H9l-4 3V7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3Z" />
  </svg>
);
const searchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

const num = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export type BoardSummary = {
  slug: string;
  name: string;
  count: number;
  kind: "OFFICIAL" | "COMMUNITY";
};

async function boardSummaries(): Promise<BoardSummary[]> {
  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
    select: {
      slug: true,
      name: true,
      kind: true,
      _count: { select: { threads: { where: { isDeleted: false } } } },
    },
  });

  return boards.map((board) => ({
    slug: board.slug,
    name: board.name,
    count: board._count.threads,
    kind: board.kind,
  }));
}

async function BoardLinks({ boards, activeSlug }: { boards: BoardSummary[]; activeSlug?: string }) {
  const locale = await getLocale();
  const m = t(locale).shell;
  const official = boards.filter((board) => board.kind === "OFFICIAL");
  const community = boards.filter((board) => board.kind === "COMMUNITY");

  const row = (board: BoardSummary) => (
    <Link
      className={`${activeSlug === board.slug ? "on " : ""}${board.kind === "COMMUNITY" ? "comm" : "off"}`}
      href={`/b/${board.slug}`}
      key={board.slug}
    >
      <span>{board.name}</span>
      <i>{num(board.count)}</i>
    </Link>
  );

  return (
    <nav className="board-nav" aria-label={m.boards}>
      <Link className={activeSlug ? "" : "on"} href="/">
        <span>{m.allThreads}</span>
        <i className="all">ALL</i>
      </Link>

      <div className="bn-group">
        <p className="bn-label"><span className="bn-dot" />{m.official}</p>
        {official.map(row)}
      </div>

      <div className="bn-group">
        <p className="bn-label"><span className="bn-dot comm" />{m.community}</p>
        {community.length > 0 ? community.map(row) : <p className="bn-empty">{m.communityEmpty}</p>}
        <Link className="bn-create" href="/boards/new">＋ {m.createBoard}</Link>
      </div>
    </nav>
  );
}

/**
 * Shared shell for both designs: brand, board dropdown, search, language,
 * theme, account, plus the one global compose button. Navigation lives in the
 * board list, never in a second nav bar.
 */
export async function ThemedPage({
  theme,
  username,
  active,
  boardSlug,
  children,
}: {
  theme: "light" | "dark";
  username: string | null;
  active?: "home" | "boards" | "thread" | "new";
  /** When set, the compose button opens the form with this board preselected. */
  boardSlug?: string;
  children: ReactNode;
}) {
  const [boards, locale] = await Promise.all([boardSummaries(), getLocale()]);
  const me = username
    ? await prisma.user.findUnique({
        where: { username },
        select: { id: true, avatarColor: true, avatarRing: true, role: true, announcementsSeenAt: true },
      })
    : null;
  const canModerate = me?.role === "MODERATOR" || me?.role === "ADMIN";
  const copy = t(locale).shell;
  const pages = t(locale).pages;
  const inboxCopy = t(locale).notifications;
  const noticeFeed = me ? await getNotifications(me.id) : { items: [], unseen: 0 };
  const inboxItems: InboxItem[] = noticeFeed.items.map((item) => ({
    id: item.id,
    kind: item.kind,
    actor: item.actor,
    message: inboxCopy.kinds[item.kind](item.actor),
    when: timeAgo(item.createdAt, locale),
    href: `/t/${item.threadId}${item.postId ? `#p-${item.postId}` : ""}`,
    excerpt: item.excerpt,
    unread: item.unread,
  }));
  const inboxLabels = {
    title: inboxCopy.title,
    empty: inboxCopy.empty,
    markSeen: inboxCopy.markSeen,
    open: inboxCopy.open,
    close: inboxCopy.close,
    unreadWord: inboxCopy.unreadWord,
  };
  const annCopy = t(locale).announcements;
  const announcements = await listAnnouncements();
  const unreadAnnouncementList = unreadAnnouncements(me?.announcementsSeenAt ?? null, announcements);
  const unreadIds = new Set(unreadAnnouncementList.map((entry) => entry.id));
  const announcementItems: AnnouncementItem[] = announcements.map((entry) => ({
    id: entry.id,
    date: entry.publishedAt,
    kind: entry.kind,
    title: entry.title[locale],
    body: entry.body[locale],
    unread: unreadIds.has(entry.id),
  }));
  const announcementLabels = {
    title: annCopy.title,
    close: annCopy.close,
    empty: annCopy.empty,
    markSeen: annCopy.markSeen,
    unreadWord: annCopy.unreadWord,
    kinds: annCopy.kinds,
  };

  const css = (theme === "light" ? homeDCss + pagesDCss : homeBCss + pagesBCss) + polishCss + redesignCss + kinjoCss;
  const wrap = theme === "light" ? "tw-d" : "tw-b";

  return (
    <div className={wrap} data-active={active ?? "home"} lang={locale}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <RouteFreshness />
      <AnchorHighlight />
      <AutoRefresh />
      <ShellInteractions />
      <a className="skip-link" href="#page-content">{t(locale).commons.skip}</a>
      <ScrollHeader>
        <header className="site-nav">
          <Link className="site-brand" href="/" aria-label={copy.home}>
            <span className="brand-symbol" aria-hidden="true">近</span>
            <span className="kinjo-wordmark">kinjo<span className="brand-sub">{t(locale).commons.brand}</span></span>
          </Link>
          <form className="nav-search" action="/" method="get" role="search">
            {searchIcon}
            <input name="q" maxLength={100} placeholder={copy.search} aria-label={copy.search} />
            <kbd aria-hidden="true">⌘ K</kbd>
          </form>
          <div className="nav-controls">
            <details className="board-menu">
              <summary>{copy.boards}<span aria-hidden="true">⌄</span></summary>
              <div className="board-menu-panel"><BoardLinks boards={boards} /></div>
            </details>
            <AnnouncementPanel items={announcementItems} unseen={unreadIds.size} labels={announcementLabels} themeClass={wrap} signedIn={Boolean(username)} />
            {username ? <NotificationInbox items={inboxItems} unseen={noticeFeed.unseen} labels={inboxLabels} themeClass={wrap} /> : null}
            {canModerate ? <Link className="adm-entry" href="/admin">{copy.console}</Link> : null}
            <LanguageToggle locale={locale} />
            <ThemeToggle theme={theme} labels={{ dark: pages.toDark, light: pages.toLight }} />
            <Link className="ava" href={username ? `/u/${encodeURIComponent(username)}` : "/login"} aria-label={pages.account}
              style={{ background: me?.avatarColor ?? undefined, borderColor: me?.avatarRing ?? undefined, color: readableInk(me?.avatarColor) ?? undefined }}>
              {username ? username.slice(0, 1).toUpperCase() : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>}
            </Link>
          </div>
        </header>
      </ScrollHeader>
      <div id="page-content" tabIndex={-1} />

      {children}
      <footer className="commons-footer">
        <div><strong>Kinjo · 近所</strong><p>{t(locale).footer.disclaimer}</p></div>
        <nav aria-label={t(locale).footer.policies}>
          <Link href="/about">{t(locale).kinjo.about}</Link>
          <Link href="/terms">{t(locale).footer.terms}</Link>
          <Link href="/rules">{t(locale).footer.rules}</Link>
          <Link href="/privacy">{t(locale).footer.privacy}</Link>
          <Link href="/moderation-policy">{t(locale).footer.moderation}</Link>
        </nav>
      </footer>

      <Link
        className="fab"
        href={boardSlug ? `/new?board=${boardSlug}` : "/new"}
        aria-label={copy.newThread}
        title={copy.newThread}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>{copy.newThread}</span>
      </Link>
    </div>
  );
}

export function BoardNav({ boards, activeSlug }: { boards: BoardSummary[]; activeSlug?: string }) {
  return <BoardLinks boards={boards} activeSlug={activeSlug} />;
}

function ThreadActions({ thread, likeLabel, saveLabel }: { thread: HomeThread; likeLabel: string; saveLabel: string }) {
  return (
    <div className="acts">
      <ToggleAction
        kind="like"
        endpoint={`/api/threads/${thread.id}/like`}
        initialCount={thread.likeCount}
        initialActive={thread.liked}
        label={likeLabel}
      />
      <ToggleAction
        kind="save"
        endpoint={`/api/threads/${thread.id}/bookmark`}
        initialCount={thread.bookmarkCount}
        initialActive={thread.bookmarked}
        label={saveLabel}
      />
    </div>
  );
}

export function Crumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <div className="crumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}

export function ThreadCards({ threads, locale, query }: { threads: HomeThread[]; locale: Locale; query?: string }) {
  const copy = t(locale).pages;
  return (
    <div className="cards">
      {threads.map((thread, index) => (
        <article className="card" key={thread.id} id={`t-${thread.id}`}>
          <div className="card-top">
            <Link className={`bo${index % 3 === 0 ? " cy" : ""}`} href={`/b/${thread.board.slug}`}>
              <i />{thread.board.name}
            </Link>
            {thread.isUnread ? <span className="unread" title={t(locale).shell.unread}>{t(locale).shell.unread}</span> : null}
          </div>
          <h3>
            <Link href={`/t/${thread.id}${query ? `?q=${encodeURIComponent(query)}` : ""}`}>
              <Highlight text={thread.title} term={query} />
            </Link>
          </h3>
          {thread.excerpt ? <p className="excerpt">{thread.excerpt}</p> : null}
          <div className="tags">
            {thread.tags.slice(0, 3).map((tag) => (
              <Link className="tag" href={`/?q=${encodeURIComponent(`#${tag.name}`)}`} key={tag.name}>
                #<Highlight text={tag.name} term={query} />
              </Link>
            ))}
          </div>
          <div className="card-foot">
            <span className="who">
              <span
                className="dot"
                style={{
                  background: thread.author.avatarColor ?? undefined,
                  borderColor: thread.author.avatarRing ?? undefined,
                  color: readableInk(thread.author.avatarColor),
                }}
              >
                {thread.author.username.slice(0, 1).toUpperCase()}
              </span>
              {thread.author.username}・{timeAgo(thread.lastPostAt, locale)}
            </span>
            <span className="metric">{replyIcon}{thread.replyCount}</span>
            <ThreadActions thread={thread} likeLabel={copy.actions.like} saveLabel={copy.actions.save} />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ThreadRows({ threads, locale, query }: { threads: HomeThread[]; locale: Locale; query?: string }) {
  return <ThreadCards threads={threads} locale={locale} query={query} />;
}

export { num };
