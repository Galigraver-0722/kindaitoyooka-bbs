import type { Locale } from "@/lib/i18n";

const ERROR_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    "invalid-input": "Please check the form and try again.",
    "terms-required": "Accept the terms of use to create an account.",
    "username-taken": "That username is already taken.",
    "email-taken": "That email address is already registered.",
    "invalid-credentials": "Wrong username or password.",
    suspended: "This account is suspended. Ask a teacher or a moderator.",
    "login-required": "Please log in to continue.",
    forbidden: "You do not have permission to do that.",
    "board-not-found": "That board does not exist.",
    "thread-not-found": "That thread does not exist.",
    "thread-locked": "This thread is locked and accepts no new replies.",
    "thread-deleted": "This thread has been removed.",
    "report-invalid": "Please describe the problem in 3 to 500 characters.",
    "rate-limited": "Too many attempts. Please wait and try again.",
    "not-found": "We could not find what you were looking for.",
    "edit-not-allowed": "Only the author can edit a thread, and only within 15 minutes of posting.",
    "invalid-slug": "Use 3-30 lowercase letters, digits or hyphens for the URL.",
    "slug-taken": "That URL is already in use.",
    "board-limit": "You can create up to 3 boards.",
    self: "You cannot do that to your own account.",
    "last-admin": "At least one administrator has to remain.",
  },
  ja: {
    "invalid-input": "入力内容を確認して、もう一度お試しください。",
    "username-taken": "そのユーザー名はすでに使われています。",
    "email-taken": "そのメールアドレスはすでに登録されています。",
    "invalid-credentials": "ユーザー名かパスワードが違います。",
    suspended: "このアカウントは停止されています。担当の先生かモデレーターに相談してください。",
    "login-required": "続けるにはログインしてください。",
    forbidden: "その操作を行う権限がありません。",
    "board-not-found": "そのボードは存在しません。",
    "thread-not-found": "そのスレッドは存在しません。",
    "thread-locked": "このスレッドはロックされているため、返信できません。",
    "thread-deleted": "このスレッドは削除されました。",
    "report-invalid": "問題の内容を 3〜500 文字で書いてください。",
    "rate-limited": "回数が多すぎます。しばらく待ってからお試しください。",
    "not-found": "お探しのページは見つかりませんでした。",
    "edit-not-allowed": "スレッドを編集できるのは作成者だけで、投稿から 15 分以内に限ります。",
    "invalid-slug": "URL は半角英小文字・数字・ハイフンの 3〜30 文字で指定してください。",
    "slug-taken": "その URL はすでに使われています。",
    "board-limit": "ボードは 1 アカウント 3 つまでです。",
    "terms-required": "アカウントを作るには利用規約への同意が必要です。",
    self: "自分のアカウントにはこの操作を行えません。",
    "last-admin": "管理者は最低 1 人必要です。",
  },
};

const NOTICE_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    reported: "Thanks. A moderator will review your report.",
    "already-reported": "You already reported this post. A moderator will see it.",
    "signed-out": "You have been signed out.",
    "thread-edited": "Your changes are saved.",
    "profile-saved": "Profile saved.",
    "user-suspended": "Account suspended.",
    "user-restored": "Account restored.",
    "role-changed": "Role changed.",
    "post-removed": "Post removed.",
    "thread-removed": "Thread removed.",
    "thread-locked": "Thread locked.",
    "thread-unlocked": "Thread unlocked.",
  },
  ja: {
    reported: "通報を受け付けました。モデレーターが確認します。",
    "already-reported": "この投稿はすでに通報済みです。モデレーターが確認します。",
    "signed-out": "ログアウトしました。",
    "thread-edited": "変更を保存しました。",
    "profile-saved": "プロフィールを保存しました。",
    "user-suspended": "アカウントを停止しました。",
    "user-restored": "アカウントの停止を解除しました。",
    "role-changed": "権限を変更しました。",
    "post-removed": "投稿を削除しました。",
    "thread-removed": "スレッドを削除しました。",
    "thread-locked": "スレッドをロックしました。",
    "thread-unlocked": "スレッドのロックを解除しました。",
  },
};

export function errorMessage(code: string | undefined, locale: Locale): string | null {
  if (!code) {
    return null;
  }
  return ERROR_MESSAGES[locale][code] ?? ERROR_MESSAGES[locale]["invalid-input"];
}

export function noticeMessage(code: string | undefined, locale: Locale): string | null {
  if (!code) {
    return null;
  }
  return NOTICE_MESSAGES[locale][code] ?? null;
}
