import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { BackButton } from "@/components/theme/nav-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { homeDCss } from "@/components/home/home-d-css";
import { homeBCss } from "@/components/home/home-b-css";
import { pagesDCss, pagesBCss } from "@/components/theme/pages-css";
import type { HomeThread } from "@/components/home/types";
import { ToggleAction } from "@/components/theme/actions";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { timeAgo } from "@/lib/time-ago";

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
  const copy = t(locale).shell;
  const css = theme === "light" ? homeDCss + pagesDCss : homeBCss + pagesBCss;
  const wrap = theme === "light" ? "tw-d" : "tw-b";

  return (
    <div className={wrap} data-active={active ?? "home"} lang={locale}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {theme === "light" ? (
        <header className="top">
          <div className="top-in">
            <div className="nav-left">
              <BackButton label={copy.back} />
              <Link className="nav-btn" href="/" aria-label={copy.home} title={copy.home}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" /></svg></Link>
            </div>
            <Link className="brand" href="/">
              <span className="sq">豊</span>豊岡BBS<small>/TOYOOKA</small>
            </Link>
            <details className="bd-drawer">
              <summary>{copy.boards}</summary>
              <div className="bd-panel">
                <BoardLinks boards={boards} />
              </div>
            </details>
            <div className="tools">
              <form className="search" action="/" method="get" role="search">
                {searchIcon}
                <input name="q" maxLength={100} placeholder={copy.search} aria-label={copy.search} />
              </form>
              <LanguageToggle locale={locale} />
              <ThemeToggle theme="light" />
              <Link className="ava" href={username ? `/u/${username}` : "/login"} aria-label="account">
                {username ? username.slice(0, 1).toUpperCase() : "?"}
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <>
          <header className="bar">
            <div className="nav-left">
              <BackButton label={copy.back} />
              <Link className="nav-btn" href="/" aria-label={copy.home} title={copy.home}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" /></svg></Link>
            </div>
            <Link className="brand" href="/">
              <span className="sig"><i /><i /><i /></span>TOYOOKA<span style={{ color: "var(--teal)" }}>{"//"}</span>BBS
            </Link>
            <div className="status"><span className="dot" /><b>LIVE</b> · STUDENT NETWORK</div>
            <details className="bd-drawer">
              <summary>{copy.boards}</summary>
              <div className="bd-panel">
                <BoardLinks boards={boards} />
              </div>
            </details>
            <form className="cmd" action="/" method="get" role="search">
              <span>&gt;</span>
              <input name="q" maxLength={100} placeholder={copy.search} aria-label={copy.search} />
              <kbd>⌘K</kbd>
            </form>
            <LanguageToggle locale={locale} />
            <ThemeToggle theme="dark" />
            <Link className="who" href={username ? `/u/${username}` : "/login"} aria-label="account">
              {username ? username.slice(0, 2).toUpperCase() : "?"}
            </Link>
          </header>
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

function ThreadActions({ thread }: { thread: HomeThread }) {
  return (
    <div className="acts">
      <ToggleAction
        kind="like"
        endpoint={`/api/threads/${thread.id}/like`}
        initialCount={thread.likeCount}
        initialActive={thread.liked}
      />
      <ToggleAction
        kind="save"
        endpoint={`/api/threads/${thread.id}/bookmark`}
        initialCount={thread.bookmarkCount}
        initialActive={thread.bookmarked}
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

export function ThreadCards({ threads }: { threads: HomeThread[] }) {
  return (
    <div className="cards">
      {threads.map((thread, index) => (
        <article className="card" key={thread.id}>
          <div className="card-top">
            <Link className={`bo${index % 3 === 0 ? " cy" : ""}`} href={`/b/${thread.board.slug}`}>
              <i />{thread.board.name}
            </Link>
          </div>
          <h3><Link href={`/t/${thread.id}`}>{thread.title}</Link></h3>
          <div className="tags">
            {thread.tags.slice(0, 3).map((tag) => (
              <Link className="tag" href={`/?q=${encodeURIComponent(`#${tag.name}`)}`} key={tag.name}>
                #{tag.name}
              </Link>
            ))}
          </div>
          <div className="card-foot">
            <span className="who">
              <span className="dot">{thread.author.username.slice(0, 1).toUpperCase()}</span>
              {thread.author.username}・{timeAgo(thread.lastPostAt)}
            </span>
            <span className="metric">{replyIcon}{thread.replyCount}</span>
            <ThreadActions thread={thread} />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ThreadRows({ threads }: { threads: HomeThread[] }) {
  return (
    <section className="list">
      <div className="thead" aria-hidden="true">
        <span>ID</span><span>SUBJECT</span><span /><span>BOARD</span><span>UPDATED</span><span>REPLIES</span><span />
      </div>
      <ol>
        {threads.map((thread, index) => (
          <li className="trow" key={thread.id}>
            <span className="id">#{String(index + 1).padStart(4, "0")}</span>
            <div className="subj">
              <Link href={`/t/${thread.id}`}>{thread.title}</Link>
              <div className="chips">
                {thread.tags.slice(0, 3).map((tag) => (
                  <span key={tag.name}>#{tag.name}</span>
                ))}
                <span className="by">{thread.author.username}</span>
              </div>
            </div>
            <span className="leader" />
            <span className="bname"><i />{thread.board.name}</span>
            <span className="time">{timeAgo(thread.lastPostAt)}</span>
            <span className="num"><b>{thread.replyCount}</b></span>
            <ThreadActions thread={thread} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export { num };
