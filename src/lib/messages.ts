import type { Locale } from "@/lib/i18n";

const ERROR_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    "invalid-input": "Please check the form and try again.",
    "username-taken": "That username is already taken.",
    "email-taken": "That email address is already registered.",
    "invalid-credentials": "Wrong username or password.",
    "login-required": "Please log in to continue.",
    forbidden: "You do not have permission to do that.",
    "board-not-found": "That board does not exist.",
    "thread-not-found": "That thread does not exist.",
    "thread-locked": "This thread is locked and accepts no new replies.",
    "thread-deleted": "This thread has been removed.",
    "report-invalid": "Please describe the problem in 3 to 500 characters.",
    "rate-limited": "Too many attempts. Please wait and try again.",
    "not-found": "We could not find what you were looking for.",
  },
  ja: {
    "invalid-input": "入力内容を確認して、もう一度お試しください。",
    "username-taken": "そのユーザー名はすでに使われています。",
    "email-taken": "そのメールアドレスはすでに登録されています。",
    "invalid-credentials": "ユーザー名かパスワードが違います。",
    "login-required": "続けるにはログインしてください。",
    forbidden: "その操作を行う権限がありません。",
    "board-not-found": "そのボードは存在しません。",
    "thread-not-found": "そのスレッドは存在しません。",
    "thread-locked": "このスレッドはロックされているため、返信できません。",
    "thread-deleted": "このスレッドは削除されました。",
    "report-invalid": "問題の内容を 3〜500 文字で書いてください。",
    "rate-limited": "回数が多すぎます。しばらく待ってからお試しください。",
    "not-found": "お探しのページは見つかりませんでした。",
  },
};

const NOTICE_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    reported: "Thanks. A moderator will review your report.",
    "signed-out": "You have been signed out.",
  },
  ja: {
    reported: "通報を受け付けました。モデレーターが確認します。",
    "signed-out": "ログアウトしました。",
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
