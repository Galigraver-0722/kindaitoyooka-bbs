/**
 * Official announcements, including the changelog.
 *
 * They live in the database so an administrator can post a notice from the
 * console without a redeploy. `SEED_ANNOUNCEMENTS` is what `pnpm bootstrap`
 * writes into an empty table, so a fresh deployment starts with the same four
 * entries the code used to ship; after that the console is the editor.
 *
 * Read state is a single timestamp per account (`User.announcementsSeenAt`),
 * the same shape ADR-0025 chose for the notification inbox: only the moment is
 * stored. ADR-0034 records why the entries moved out of the code.
 */

import { prisma } from "@/lib/db";

export type AnnouncementKind = "release" | "notice";

type Text = { ja: string; en: string };

export type Announcement = {
  /** Stable id; used for ordering and for the read timestamp comparison. */
  id: string;
  /** ISO date, newest first in ANNOUNCEMENTS. */
  publishedAt: string;
  kind: AnnouncementKind;
  title: Text;
  body: Text;
};

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "2026-10-27-console",
    publishedAt: "2026-10-27",
    kind: "notice",
    title: {
      ja: "管理コンソールを公開しました",
      en: "A moderator console is live",
    },
    body: {
      ja:
        "モデレーターと管理者向けに /admin を用意しました。通報の処理、アカウントの停止と解除、投稿の削除、スレッドのロック、監査ログを 1 か所にまとめています。\n" +
        "停止されたアカウントは全端末でログアウトされ、ログインできなくなります。投稿は残ります。\n" +
        "生徒の皆さんには見えません。困ったときは、まず通報してください。",
      en:
        "Moderators and administrators now have /admin: the report queue, account suspension and restore, post removal, thread locking, and the audit log in one place.\n" +
        "A suspended account is signed out everywhere and cannot sign in again. Its posts stay.\n" +
        "Students do not see this page. If something is wrong in a thread, report it.",
    },
  },
  {
    id: "2026-10-26-live",
    publishedAt: "2026-10-26",
    kind: "release",
    title: {
      ja: "スレッドが自動で更新されるようになりました",
      en: "Threads keep themselves up to date",
    },
    body: {
      ja:
        "開いたままのスレッドに、他の人の返信が 12 秒ほどで反映されるようになりました。新しく届いた投稿は、少しの間だけ強調されます。\n" +
        "入力欄にカーソルがある間は更新しません。書きかけの返信が消えることはありません。",
      en:
        "A thread you leave open now picks up other people's replies within a few seconds. New posts are highlighted briefly.\n" +
        "The page does not refresh while your cursor is in a text field, so a draft is never pulled out from under you.",
    },
  },
  {
    id: "2026-10-25-inbox",
    publishedAt: "2026-10-25",
    kind: "release",
    title: {
      ja: "通知の受信箱を追加しました",
      en: "A notification inbox",
    },
    body: {
      ja:
        "ヘッダーのベルから、自分の投稿への返信・コメント・いいね・保存をまとめて確認できます。\n" +
        "未読があれば数字が付きます。項目を押すと、その投稿まで移動して一瞬光ります。",
      en:
        "The bell in the header collects replies, comments, likes, and saves on your posts.\n" +
        "A count appears while anything is unread. Clicking an item jumps to that post and flashes it.",
    },
  },
  {
    id: "2026-10-24-beta",
    publishedAt: "2026-10-24",
    kind: "notice",
    title: {
      ja: "ベータ公開をはじめます",
      en: "The beta opens",
    },
    body: {
      ja:
        "Toyooka BBS のベータ版です。授業や部活の連絡、勉強の質問、落とし物の連絡に使ってください。\n" +
        "投稿を削除すると、その場所はプレースホルダーに変わり、本文は記録として残ります。消したい投稿があるときは、その投稿の削除ボタンを使ってください。\n" +
        "ルールは /rules、通報がどう扱われるかは /moderation-policy にまとめてあります。",
      en:
        "This is the beta of Toyooka BBS. Use it for class and club notices, study questions, and lost-and-found.\n" +
        "When you delete a post, its place becomes a placeholder and the text stays on record. Use the delete button on the post if you want it gone.\n" +
        "The rules are at /rules, and how reports are handled is at /moderation-policy.",
    },
  },
];

/** Milliseconds of the newest entry, used as the comparison point. */
export function latestAnnouncementAt(entries: Announcement[]): number {
  return entries.reduce((newest, entry) => {
    const at = Date.parse(`${entry.publishedAt}T00:00:00Z`);
    return Number.isFinite(at) && at > newest ? at : newest;
  }, 0);
}

/**
 * Announcements published after the reader last opened the panel. `seenAt` is
 * null for a reader who has never opened it, which counts everything as new.
 */
export function unreadAnnouncements(seenAt: Date | null, entries: Announcement[]): Announcement[] {
  if (!seenAt) {
    return entries;
  }
  return entries.filter((entry) => Date.parse(`${entry.publishedAt}T00:00:00Z`) > seenAt.getTime());
}

export function isAnnouncementKind(value: string): value is AnnouncementKind {
  return value === "notice" || value === "release";
}

type Row = {
  id: string;
  publishedAt: Date;
  kind: string;
  titleJa: string;
  titleEn: string;
  bodyJa: string;
  bodyEn: string;
};

/** The date shown to readers is the UTC day of `publishedAt`. */
function dateOf(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function fromRow(row: Row): Announcement {
  return {
    id: row.id,
    publishedAt: dateOf(row.publishedAt),
    kind: isAnnouncementKind(row.kind) ? row.kind : "notice",
    title: { ja: row.titleJa, en: row.titleEn },
    body: { ja: row.bodyJa, en: row.bodyEn },
  };
}

const rowSelect = {
  id: true,
  publishedAt: true,
  kind: true,
  titleJa: true,
  titleEn: true,
  bodyJa: true,
  bodyEn: true,
} as const;

/**
 * Newest first, drafts excluded: what readers see. The date is a label, not a
 * schedule — "deleted" and "draft" are the only things that hide an entry, so a
 * notice typed at 23:00 shows up immediately instead of waiting for midnight.
 */
export async function listAnnouncements(): Promise<Announcement[]> {
  const rows = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: rowSelect,
  });
  return rows.map(fromRow);
}

/** Everything, drafts included, for the console. */
export async function listAllAnnouncements(): Promise<
  (Announcement & { isPublished: boolean; updatedAt: Date })[]
> {
  const rows = await prisma.announcement.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: { ...rowSelect, isPublished: true, updatedAt: true },
  });
  return rows.map((row) => ({ ...fromRow(row), isPublished: row.isPublished, updatedAt: row.updatedAt }));
}

/** `YYYY-MM-DD` from a date input, stored as midnight UTC. */
export function parsePublishedAt(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const at = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(at.getTime()) ? null : at;
}
