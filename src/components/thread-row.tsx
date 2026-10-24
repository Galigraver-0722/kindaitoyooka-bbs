import Link from "next/link";
import { HeartIcon, ReplyIcon } from "@/components/icons";
import { ReactionButton } from "@/components/reaction-button";
import { formatDateTime } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { tagSearchHref } from "@/lib/tags";

export type ThreadRowThread = {
  id: string;
  title: string;
  board: { slug: string; name: string };
  author: { username: string };
  tags: { name: string }[];
  likeCount: number;
  bookmarkCount: number;
  replyCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  isUnread?: boolean;
  bookmarked?: boolean;
};

export function ThreadRow({
  thread,
  index,
  date,
  dateLabel,
  locale,
  hideWhenInactive = false,
}: {
  thread: ThreadRowThread;
  index: number;
  date: Date;
  dateLabel?: string;
  locale: Locale;
  hideWhenInactive?: boolean;
}) {
  const m = t(locale);

  return (
    <li className="group border-t border-line first:border-t-0">
      <div className="grid grid-cols-[1.9rem_minmax(0,1fr)_auto] gap-3 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-4">
        <span className="num pt-1">{String(index).padStart(2, "0")}</span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
            <Link
              href={`/b/${thread.board.slug}`}
              className="inline-flex items-center gap-1.5 font-medium text-ink transition-colors hover:text-accent"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {thread.board.name}
            </Link>
            {thread.isPinned ? (
              <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-accent">
                {m.board.pinned}
              </span>
            ) : null}
            {thread.isLocked ? (
              <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-muted">
                {m.board.locked}
              </span>
            ) : null}
            {thread.isUnread ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-accent">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                {m.board.unread}
              </span>
            ) : null}
            <span aria-hidden="true" className="text-line">
              ·
            </span>
            <time className="meta">{dateLabel ?? formatDateTime(date, locale)}</time>
          </div>

          <h3 className="mt-1.5 text-[19px] font-medium leading-snug tracking-[-0.02em]">
            <Link
              href={`/t/${thread.id}`}
              className="text-ink transition-colors duration-150 group-hover:text-accent"
            >
              {thread.title}
            </Link>
          </h3>

          {thread.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {thread.tags.map((tag) => (
                <Link key={tag.name} href={tagSearchHref(tag.name)} className="tag">
                  #{tag.name}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted">
            <span className="inline-flex items-center gap-1" title={m.thread.like}>
              <HeartIcon size={12} />
              {thread.likeCount}
            </span>
            <span aria-hidden="true" className="text-line">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <ReplyIcon size={12} />
              {m.thread.replies(thread.replyCount)}
            </span>
            <span aria-hidden="true" className="text-line">
              ·
            </span>
            <span>{thread.author.username}</span>
          </div>
        </div>

        {thread.bookmarked !== undefined ? (
          <ReactionButton
            action={`/api/threads/${thread.id}/bookmark`}
            initialActive={thread.bookmarked}
            initialCount={thread.bookmarkCount}
            activeLabel={m.thread.saved}
            inactiveLabel={m.thread.save}
            errorLabel={m.thread.actionFailed}
            icon="bookmark"
            compact
            hideRowWhenInactive={hideWhenInactive}
          />
        ) : null}
      </div>
    </li>
  );
}
