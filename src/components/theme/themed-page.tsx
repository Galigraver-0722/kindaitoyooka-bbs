import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { BackButton } from "@/components/theme/nav-buttons";
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
import { pagesDCss, pagesBCss } from "@/components/theme/pages-css";
import type { HomeThread } from "@/components/home/types";
import { ToggleAction } from "@/components/theme/actions";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { timeAgo } from "@/lib/time-ago";
import type { Locale } from "@/lib/locales";
import { readableInk } from "@/lib/color";
import { versionTag } from "@/lib/version";
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

  const css = theme === "light" ? homeDCss + pagesDCss : homeBCss + pagesBCss;
  const wrap = theme === "light" ? "tw-d" : "tw-b";

  return (
    <div className={wrap} data-active={active ?? "home"} lang={locale}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <RouteFreshness />
      <AnchorHighlight />
      <AutoRefresh />
      {theme === "light" ? (
        <ScrollHeader>
          <header className="top">
          <div className="top-in">
            <div className="nav-left">
              <BackButton label={copy.back} />
              <Link className="nav-btn" href="/" aria-label={copy.home} title={copy.home}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" /></svg></Link>
            </div>
            <Link className="brand" href="/">
              <span className="sq">豊</span>豊岡BBS<small>/TOYOOKA</small>
              <span className="ver" title={`${copy.betaNote} · ${versionTag()}`}>
                {versionTag()}
              </span>
            </Link>
            <details className="bd-drawer">
              <summary>{copy.boards}</summary>
              <div className="bd-panel">
                <BoardLinks boards={boards} />
              </div>
            </details>
            <div className="tools">
              <AnnouncementPanel
                items={announcementItems}
                unseen={unreadIds.size}
                labels={announcementLabels}
                themeClass="tw-d"
                signedIn={Boolean(username)}
              />
              {username ? <NotificationInbox items={inboxItems} unseen={noticeFeed.unseen} labels={inboxLabels} themeClass="tw-d" /> : null}
              {canModerate ? <Link className="adm-entry" href="/admin">{copy.console}</Link> : null}
              <form className="search" action="/" method="get" role="search">
                {searchIcon}
                <input name="q" maxLength={100} placeholder={copy.search} aria-label={copy.search} />
              </form>
              <LanguageToggle locale={locale} />
              <ThemeToggle theme="light" labels={{ dark: pages.toDark, light: pages.toLight }} />
              <Link
                className="ava"
                href={username ? `/u/${username}` : "/login"}
                aria-label={pages.account}
                style={{
                  background: me?.avatarColor ?? undefined,
                  borderColor: me?.avatarRing ?? undefined,
                  color: readableInk(me?.avatarColor),
                }}
              >
                {username ? username.slice(0, 1).toUpperCase() : "?"}
              </Link>
            </div>
          </div>
          </header>
        </ScrollHeader>
      ) : (
        <>
          <ScrollHeader>
          <header className="bar">
            <div className="nav-left">
              <BackButton label={copy.back} />
              <Link className="nav-btn" href="/" aria-label={copy.home} title={copy.home}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" /></svg></Link>
            </div>
            <Link className="brand" href="/">
              <span className="sig"><i /><i /><i /></span>TOYOOKA<span style={{ color: "var(--teal)" }}>{"//"}</span>BBS
              <span className="ver" title={`${copy.betaNote} · ${versionTag()}`}>
                {versionTag()}
              </span>
            </Link>
            <div className="status"><span className="dot" /><b>{copy.betaNote}</b></div>
            <details className="bd-drawer">
              <summary>{copy.boards}</summary>
              <div className="bd-panel">
                <BoardLinks boards={boards} />
              </div>
            </details>
            <AnnouncementPanel
              items={announcementItems}
              unseen={unreadIds.size}
              labels={announcementLabels}
              themeClass="tw-b"
              signedIn={Boolean(username)}
            />
            {username ? <NotificationInbox items={inboxItems} unseen={noticeFeed.unseen} labels={inboxLabels} themeClass="tw-b" /> : null}
            {canModerate ? <Link className="adm-entry" href="/admin">{copy.console}</Link> : null}
            <form className="cmd" action="/" method="get" role="search">
              <span>&gt;</span>
              <input name="q" maxLength={100} placeholder={copy.search} aria-label={copy.search} />
              <kbd>⌘K</kbd>
            </form>
            <LanguageToggle locale={locale} />
            <ThemeToggle theme="dark" labels={{ dark: pages.toDark, light: pages.toLight }} />
            <Link
              className="ava"
              href={username ? `/u/${username}` : "/login"}
              aria-label={pages.account}
              style={{
                // Solid fill, like the light header. The previous version appended
                // "22" for a 13% tint and kept the letter colour computed from the
                // solid value, so an orange avatar showed near-black text on a
                // nearly transparent square — unreadable on the dark bar.
                background: me?.avatarColor ?? undefined,
                borderColor: me?.avatarRing ?? undefined,
                color: readableInk(me?.avatarColor) ?? undefined,
              }}
            >
              {username ? username.slice(0, 1).toUpperCase() : "?"}
            </Link>
          </header>
          </ScrollHeader>
          <div className="rail" aria-hidden="true">
            <span className="v">TOYOOKA STUDENT NETWORK</span>
            <span className="ticks"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
            <span className="v">2026 — 10</span>
          </div>
        </>
      )}

      {children}

      <Link
        className="fab"
        href={boardSlug ? `/new?board=${boardSlug}` : "/new"}
        aria-label={copy.newThread}
        title={copy.newThread}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
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
  const copy = t(locale).pages;
  return (
    <section className="list">
      <div className="thead" aria-hidden="true">
        <span>ID</span><span>SUBJECT</span><span /><span>BOARD</span><span>UPDATED</span><span>REPLIES</span><span />
      </div>
      <ol>
        {threads.map((thread, index) => (
          <li className="trow" key={thread.id} id={`t-${thread.id}`}>
            <span className="id">#{String(index + 1).padStart(4, "0")}</span>
            <div className="subj">
              <Link href={`/t/${thread.id}${query ? `?q=${encodeURIComponent(query)}` : ""}`}>
                <Highlight text={thread.title} term={query} />
              </Link>
              {thread.isUnread ? <span className="unread" title={t(locale).shell.unread}>{t(locale).shell.unread}</span> : null}
              {thread.excerpt ? <p className="excerpt">{thread.excerpt}</p> : null}
              <div className="chips">
                {thread.tags.slice(0, 3).map((tag) => (
                  <span key={tag.name}>#{tag.name}</span>
                ))}
                <span className="by">{thread.author.username}</span>
              </div>
            </div>
            <span className="leader" />
            <span className="bname"><i />{thread.board.name}</span>
            <span className="time">{timeAgo(thread.lastPostAt, locale)}</span>
            <span className="num"><b>{thread.replyCount}</b></span>
            <ThreadActions thread={thread} likeLabel={copy.actions.like} saveLabel={copy.actions.save} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export { num };
