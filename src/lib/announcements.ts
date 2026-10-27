/**
 * Official announcements, including the changelog.
 *
 * These ship with the code on purpose. An announcement that describes a
 * release is part of that release: writing it in a database editor would let
 * the notice and the behaviour drift, and nobody would notice until a student
 * quoted a changelog line that was never true. Editing this file is part of
 * shipping a change.
 *
 * Read state is a single timestamp per account (`User.announcementsSeenAt`),
 * the same shape ADR-0025 chose for the notification inbox: only the moment is
 * stored, the list itself is code.
 */

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

export const ANNOUNCEMENTS: Announcement[] = [
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
export function latestAnnouncementAt(entries: Announcement[] = ANNOUNCEMENTS): number {
  return entries.reduce((newest, entry) => {
    const at = Date.parse(`${entry.publishedAt}T00:00:00Z`);
    return Number.isFinite(at) && at > newest ? at : newest;
  }, 0);
}

/**
 * Announcements published after the reader last opened the panel. `seenAt` is
 * null for a reader who has never opened it, which counts everything as new.
 */
export function unreadAnnouncements(
  seenAt: Date | null,
  entries: Announcement[] = ANNOUNCEMENTS,
): Announcement[] {
  if (!seenAt) {
    return entries;
  }
  return entries.filter((entry) => Date.parse(`${entry.publishedAt}T00:00:00Z`) > seenAt.getTime());
}
