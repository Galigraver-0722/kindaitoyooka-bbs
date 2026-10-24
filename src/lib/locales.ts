import type { Role } from "@prisma/client";

export const LOCALE_COOKIE = "locale";
export type Locale = "en" | "ja";
export const DEFAULT_LOCALE: Locale = "ja";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ja";
}

const en = {
  meta: {
    title: "Toyooka BBS",
    description:
      "A community bulletin board for Kindai University Toyooka Junior & Senior High School.",
  },
  nav: {
    boards: "Boards",
    newThread: "New thread",
    moderation: "Moderation",
    search: "Search",
    bookmarks: "Saved",
    logOut: "Log out",
    logIn: "Log in",
    register: "Register",
  },
  language: {
    label: "Language",
  },
  sort: {
    latest: "Latest",
    hot: "Popular",
  },
  roles: {
    STUDENT: "Student",
    MODERATOR: "Moderator",
    ADMIN: "Admin",
  } as Record<Role, string>,
  home: {
    eyebrow: "Student community",
    title: "A place for our school to talk.",
    subtitle:
      "Ask questions, share club news, and find study partners. Everything here is public, so write as if the whole school is reading.",
    startThread: "Start a thread",
    browseBoards: "Browse boards",
    recent: "Recent activity",
    newestThreads: (count: number) => `${count} newest ${count === 1 ? "thread" : "threads"}`,
    empty: "No threads yet. The first one is yours to start.",
    byReplies: (author: string, replies: number) =>
      `by ${author} · ${replies} ${replies === 1 ? "reply" : "replies"}`,
    boards: "Boards",
    boardThreads: (count: number) => `${count} ${count === 1 ? "thread" : "threads"}`,
    rulesTitle: "Before you post",
    rules: [
      "Be kind. Disagree with ideas, never with people.",
      "Never post names, addresses, photos, or contact details of others.",
      "Use the Report button when something feels wrong.",
    ],
  },
  board: {
    breadcrumb: "Boards",
    visibleThreads: (count: number) =>
      `${count} visible ${count === 1 ? "thread" : "threads"}`,
    newThread: "New thread",
    empty: "Nothing here yet. Start the first thread.",
    pinned: "Pinned",
    locked: "Locked",
    threadMeta: (author: string, replies: number) =>
      `by ${author} · ${replies} ${replies === 1 ? "reply" : "replies"}`,
  },
  thread: {
    startedBy: (author: string, date: string) => `Started by ${author} · ${date}`,
    originalPost: "original post",
    postNumber: (index: number) => `#${index}`,
    removed: "Removed by a moderator.",
    report: "Report",
    reportPlaceholder: "What is wrong with this post?",
    sendReport: "Send report",
    like: "Like",
    liked: "Liked",
    save: "Save",
    saved: "Saved",
    unsave: "Remove bookmark",
    share: "Share",
    copied: "Link copied",
    loginToReact: "Log in to react.",
    removePost: "Remove post",
    lockThread: "Lock thread",
    unlockThread: "Unlock thread",
    removeThread: "Remove thread",
    replyAs: (username: string) => `Reply as ${username}`,
    charLimit: (count: number) => `Plain text. Up to ${count.toLocaleString("en-US")} characters.`,
    postReply: "Post reply",
    replies: (count: number) => `${count} ${count === 1 ? "reply" : "replies"}`,
    loginPromptPrefix: "",
    loginPromptSuffix: " to reply to this thread.",
    loginLink: "Log in",
    lockedNotice: "This thread is locked. New replies are disabled.",
  },
  newThread: {
    title: "Start a thread",
    subtitle: "Threads are public. Do not include other people's personal information.",
    board: "Board",
    titleLabel: "Title",
    titlePlaceholder: "What is this thread about?",
    message: "Message",
    charLimit: (count: number) => `Plain text only. Up to ${count.toLocaleString("en-US")} characters.`,
    submit: "Post thread",
    cancel: "Cancel",
    noBoards: "No boards are open yet. Ask an administrator to create one.",
  },
  auth: {
    loginTitle: "Log in",
    loginSubtitle: "Use the same username and password you registered with.",
    username: "Username",
    password: "Password",
    loginButton: "Log in",
    noAccount: "No account yet?",
    registerLink: "Register",
    sentenceEnd: ".",
    registerTitle: "Create an account",
    registerSubtitle:
      "Pick a username you are comfortable showing to the whole school. Email is optional and is only used to contact you about your account.",
    usernameHint: "3–20 characters: letters, numbers, and underscores.",
    email: "Email",
    optional: "(optional)",
    emailHint: "Used only to contact you about your account.",
    passwordHint: "At least 10 characters. Use a passphrase you do not use anywhere else.",
    createButton: "Create account",
    haveAccount: "Already registered?",
    loginLink: "Log in",
  },
  moderation: {
    title: "Moderation",
    signedInAs: (username: string) =>
      `Signed in as ${username}. Every action is attributed to your account in the database.`,
    openReports: "Open reports",
    empty: "Nothing needs review right now.",
    reportedBy: (username: string, date: string) => `Reported by ${username} · ${date}`,
    openThread: "Open in thread",
    postContext: (author: string, thread: string, board: string) =>
      `${author} in ${thread} (${board})`,
    removedThread: "thread already removed",
    removedPost: "This post was already removed.",
    removePost: "Remove post",
    dismiss: "Dismiss report",
    closeReport: "Close report",
  },
  notFound: {
    code: "404",
    heading: "We could not find that page.",
    body: "The thread may have been removed, or the link may be wrong.",
    back: "Back to the boards",
  },
  search: {
    title: "Search",
    placeholder: "Search threads and replies",
    submit: "Search",
    resultCount: (count: number) =>
      `${count} ${count === 1 ? "result" : "results"}`,
    empty: "No threads matched.",
    tagLabel: (tag: string) => `Tag #${tag}`,
    clearTag: "Clear tag",
  },
  bookmarks: {
    title: "Saved threads",
    empty: "You have not saved any threads yet.",
    savedAt: (date: string) => `Saved ${date}`,
  },
  footer: {
    disclaimer:
      "A community-run student project. Not an official communication channel of Kindai University Toyooka Junior & Senior High School.",
    license: "Built with Next.js and Prisma. Licensed under MIT.",
  },
};

const ja: typeof en = {
  meta: {
    title: "Toyooka BBS",
    description: "近畿大学附属豊岡中学校・高等学校の生徒が使う、学校コミュニティの掲示板です。",
  },
  nav: {
    boards: "ボード",
    newThread: "スレッドを立てる",
    moderation: "モデレーション",
    search: "検索",
    bookmarks: "保存",
    logOut: "ログアウト",
    logIn: "ログイン",
    register: "新規登録",
  },
  language: {
    label: "表示言語",
  },
  sort: {
    latest: "新着",
    hot: "人気",
  },
  roles: {
    STUDENT: "生徒",
    MODERATOR: "モデレーター",
    ADMIN: "管理者",
  },
  home: {
    eyebrow: "生徒のコミュニティ",
    title: "学校のみんなが話せる場所。",
    subtitle:
      "質問したり、部活の連絡を共有したり、一緒に勉強する相手を探したり。ここは誰でも読める場所なので、全校生徒が読んでいるつもりで書いてください。",
    startThread: "スレッドを立てる",
    browseBoards: "ボードを見る",
    recent: "最近の投稿",
    newestThreads: (count: number) => `新しいスレッド ${count} 件`,
    empty: "まだスレッドがありません。最初の 1 本を立ててみませんか。",
    byReplies: (author: string, replies: number) => `${author}・返信 ${replies} 件`,
    boards: "ボード",
    boardThreads: (count: number) => `スレッド ${count} 件`,
    rulesTitle: "投稿する前に",
    rules: [
      "人を攻撃しない。意見が違っても、相手ではなく考え方について話す。",
      "他の人の名前、住所、写真、連絡先は書かない。",
      "おかしいと思ったら、通報ボタンを使う。",
    ],
  },
  board: {
    breadcrumb: "ボード",
    visibleThreads: (count: number) => `表示中のスレッド ${count} 件`,
    newThread: "スレッドを立てる",
    empty: "まだスレッドがありません。最初の 1 本を立ててください。",
    pinned: "固定",
    locked: "ロック中",
    threadMeta: (author: string, replies: number) => `${author}・返信 ${replies} 件`,
  },
  thread: {
    startedBy: (author: string, date: string) => `${author} が ${date} に作成`,
    originalPost: "最初の投稿",
    postNumber: (index: number) => `#${index}`,
    removed: "モデレーターが削除しました。",
    report: "通報",
    reportPlaceholder: "この投稿のどこが問題ですか？",
    sendReport: "通報を送る",
    like: "いいね",
    liked: "いいね済み",
    save: "保存",
    saved: "保存済み",
    unsave: "保存を解除",
    share: "共有",
    copied: "リンクをコピーしました",
    loginToReact: "反応するにはログインしてください。",
    removePost: "投稿を削除",
    lockThread: "スレッドをロック",
    unlockThread: "ロックを解除",
    removeThread: "スレッドを削除",
    replyAs: (username: string) => `${username} として返信`,
    charLimit: (count: number) => `プレーンテキスト。${count.toLocaleString("ja-JP")} 文字まで。`,
    postReply: "返信する",
    replies: (count: number) => `返信 ${count} 件`,
    loginPromptPrefix: "返信するには",
    loginPromptSuffix: "してください。",
    loginLink: "ログイン",
    lockedNotice: "このスレッドはロックされています。新しい返信はできません。",
  },
  newThread: {
    title: "スレッドを立てる",
    subtitle: "スレッドは公開されます。他の人の個人情報は書かないでください。",
    board: "ボード",
    titleLabel: "タイトル",
    titlePlaceholder: "どんな話題ですか？",
    message: "本文",
    charLimit: (count: number) => `プレーンテキストのみ。${count.toLocaleString("ja-JP")} 文字まで。`,
    submit: "投稿する",
    cancel: "キャンセル",
    noBoards: "まだボードがありません。管理者に作成を依頼してください。",
  },
  auth: {
    loginTitle: "ログイン",
    loginSubtitle: "登録したユーザー名とパスワードを入力してください。",
    username: "ユーザー名",
    password: "パスワード",
    loginButton: "ログイン",
    noAccount: "アカウントをお持ちでない方",
    registerLink: "新規登録",
    sentenceEnd: "。",
    registerTitle: "アカウントを作成",
    registerSubtitle:
      "全校生徒に見られても困らないユーザー名を選んでください。メールアドレスは任意で、アカウントに関する連絡にだけ使います。",
    usernameHint: "3〜20 文字。半角英数字とアンダースコア（_）が使えます。",
    email: "メールアドレス",
    optional: "（任意）",
    emailHint: "アカウントに関する連絡にのみ使用します。",
    passwordHint: "10 文字以上。他のサイトで使っていないパスフレーズにしてください。",
    createButton: "アカウントを作成",
    haveAccount: "すでにアカウントをお持ちの方",
    loginLink: "ログイン",
  },
  moderation: {
    title: "モデレーション",
    signedInAs: (username: string) =>
      `${username} としてログイン中です。すべての操作は、アカウントと一緒にデータベースへ記録されます。`,
    openReports: "未処理の通報",
    empty: "今のところ、確認が必要な通報はありません。",
    reportedBy: (username: string, date: string) => `${username} が ${date} に通報`,
    openThread: "スレッドで開く",
    postContext: (author: string, thread: string, board: string) =>
      `${author} の投稿（${thread}／${board}）`,
    removedThread: "スレッドはすでに削除されています",
    removedPost: "この投稿はすでに削除されています。",
    removePost: "投稿を削除",
    dismiss: "通報を却下",
    closeReport: "通報を閉じる",
  },
  notFound: {
    code: "404",
    heading: "ページが見つかりません。",
    body: "スレッドが削除されたか、リンクが間違っている可能性があります。",
    back: "ボードに戻る",
  },
  search: {
    title: "検索",
    placeholder: "スレッドと返信を検索",
    submit: "検索",
    resultCount: (count: number) => `${count} 件`,
    empty: "該当するスレッドがありません。",
    tagLabel: (tag: string) => `タグ #${tag}`,
    clearTag: "タグを解除",
  },
  bookmarks: {
    title: "保存したスレッド",
    empty: "まだ保存したスレッドはありません。",
    savedAt: (date: string) => `${date} に保存`,
  },
  footer: {
    disclaimer:
      "生徒が運営する非公式のプロジェクトです。近畿大学附属豊岡中学校・高等学校の公式な連絡手段ではありません。",
    license: "Next.js と Prisma で構築。MIT ライセンスで公開しています。",
  },
};

export const dictionaries: Record<Locale, typeof en> = { en, ja };

export function t(locale: Locale): typeof en {
  return dictionaries[locale];
}
