import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { homeDCss } from "@/components/home/home-d-css";
import { homeBCss } from "@/components/home/home-b-css";
import { pagesDCss, pagesBCss } from "@/components/theme/pages-css";
import type { HomeThread } from "@/components/home/types";
import { prisma } from "@/lib/db";
import { timeAgo } from "@/lib/time-ago";

const heart = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
  </svg>
);
const replyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20 15a3 3 0 0 1-3 3H9l-4 3V7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3Z" />
  </svg>
);
const bookmark = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
    <path d="M7 4h10v17l-5-4-5 4Z" />
  </svg>
);
const searchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

const num = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export type BoardSummary = { slug: string; name: string; count: number };

async function boardSummaries(): Promise<BoardSummary[]> {
  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      _count: { select: { threads: { where: { isDeleted: false } } } },
    },
  });

  return boards.map((board) => ({
    slug: board.slug,
    name: board.name,
    count: board._count.threads,
  }));
}

/**
 * Shared shell for both designs. The header carries only the brand, the board
 * dropdown, search, the theme switch and the account link: every way of moving
 * around the site passes through the board list, so there is no second nav bar
 * competing with it.
 */
export async function ThemedPage({
  theme,
  username,
  active,
  children,
}: {
  theme: "light" | "dark";
  username: string | null;
  active?: "home" | "boards" | "thread" | "new";
  children: ReactNode;
}) {
  const css = theme === "light" ? homeDCss + pagesDCss : homeBCss + pagesBCss;
  const wrap = theme === "light" ? "tw-d" : "tw-b";
  const boards = await boardSummaries();

  return (
    <div className={wrap} data-active={active ?? "home"}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {theme === "light" ? (
        <header className="top">
          <div className="top-in">
            <Link className="brand" href="/">
              <span className="sq">豊</span>豊岡BBS<small>/TOYOOKA</small>
            </Link>
            <details className="bd-drawer">
              <summary>ボード</summary>
              <div className="bd-panel">
                <Link href="/">すべてのスレッド</Link>
                {boards.map((board) => (
                  <Link href={`/b/${board.slug}`} key={board.slug}>
                    <span>{board.name}</span>
                    <i>{num(board.count)}</i>
                  </Link>
                ))}
              </div>
            </details>
            <div className="tools">
              <form className="search" action="/" method="get" role="search">
                {searchIcon}
                <input name="q" maxLength={100} placeholder="スレッド・タグを検索" aria-label="検索" />
              </form>
              <ThemeToggle theme="light" />
              <Link className="ava" href={username ? `/u/${username}` : "/login"} aria-label="アカウント">
                {username ? username.slice(0, 1).toUpperCase() : "?"}
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <>
          <header className="bar">
            <Link className="brand" href="/">
              <span className="sig"><i /><i /><i /></span>TOYOOKA<span style={{ color: "var(--teal)" }}>{"//"}</span>BBS
            </Link>
            <div className="status"><span className="dot" /><b>LIVE</b> · STUDENT NETWORK</div>
            <details className="bd-drawer">
              <summary>BOARDS</summary>
              <div className="bd-panel">
                <Link href="/">ALL THREADS</Link>
                {boards.map((board) => (
                  <Link href={`/b/${board.slug}`} key={board.slug}>
                    <span>{board.name}</span>
                    <i>{num(board.count)}</i>
                  </Link>
                ))}
              </div>
            </details>
            <form className="cmd" action="/" method="get" role="search">
              <span>&gt;</span>
              <input name="q" maxLength={100} placeholder="search threads, tags" aria-label="検索" />
              <kbd>⌘K</kbd>
            </form>
            <ThemeToggle theme="dark" />
            <Link className="who" href={username ? `/u/${username}` : "/login"} aria-label="アカウント">
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
    </div>
  );
}

export function BoardNav({ boards, activeSlug }: { boards: BoardSummary[]; activeSlug?: string }) {
  return (
    <nav className="board-nav" aria-label="ボード">
      <Link className={activeSlug ? "" : "on"} href="/">
        <span>すべてのスレッド</span>
        <i className="all">ALL</i>
      </Link>
      {boards.map((board) => (
        <Link className={activeSlug === board.slug ? "on" : ""} href={`/b/${board.slug}`} key={board.slug}>
          <span>{board.name}</span>
          <i>{num(board.count)}</i>
        </Link>
      ))}
    </nav>
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
            <form action={`/api/threads/${thread.id}/bookmark`} method="post" className="contents">
              <button className={`save${thread.bookmarked ? " on" : ""}`} aria-label={thread.bookmarked ? "保存済み" : "保存"}>
                {bookmark}
              </button>
            </form>
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
            <span className="metrics">
              <span className={`metric${thread.likeCount > 0 ? " liked" : ""}`}>{heart}{thread.likeCount}</span>
              <span className="metric">{replyIcon}{thread.replyCount}</span>
            </span>
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
        <span>ID</span><span>SUBJECT</span><span /><span>BOARD</span><span>UPDATED</span><span>REPLIES</span><span>LIKES</span><span />
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
            <span className="num"><b>{thread.likeCount}</b></span>
            <form action={`/api/threads/${thread.id}/bookmark`} method="post" style={{ display: "contents" }}>
              <button className={`save${thread.bookmarked ? " on" : ""}`} aria-label={thread.bookmarked ? "保存済み" : "保存"}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="M7 4h10v17l-5-4-5 4Z" />
                </svg>
              </button>
            </form>
          </li>
        ))}
      </ol>
    </section>
  );
}

export { num };
