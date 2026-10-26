import type { Locale } from "@/lib/locales";

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type PolicyDocument = {
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
};

export type PolicyKey = "rules" | "privacy" | "moderation" | "terms";

/**
 * Each page carries the date it last changed. A correction to one document must
 * not quietly change the date on the others, because a reader uses that date to
 * judge whether a promise they relied on has been rewritten.
 */
export const POLICY_UPDATES: Record<PolicyKey, string> = {
  rules: "2026-10-24",
  privacy: "2026-10-26",
  moderation: "2026-10-24",
  terms: "2026-10-26",
};

/** The newest revision in the set; equal to the latest value in POLICY_UPDATES. */
export const POLICY_UPDATED = "2026-10-26";

/**
 * Public policy text lives in code so the English and Japanese editions change
 * together. Keep every promise checkable against the implemented behavior; when
 * a rule is aspirational, say so explicitly.
 */
export const POLICIES: Record<Locale, Record<PolicyKey, PolicyDocument>> = {
  en: {
    rules: {
      title: "Community rules",
      intro:
        "This is a school forum. Anyone at school, including teachers, can read what you write here. Write as if the whole school is reading, because it is.",
      updated: `Last updated: ${POLICY_UPDATES.rules}`,
      sections: [
        {
          heading: "1. Be kind",
          paragraphs: [
            "Disagree with ideas, not with people. Harassment, threats, slurs, and coordinated pile-ons are not allowed.",
            "If a thread makes you angry, step away before replying. You can report a post instead of arguing with it.",
          ],
        },
        {
          heading: "2. Protect privacy",
          bullets: [
            "Do not post anyone's real name, address, phone number, email address, class schedule, or photos without permission.",
            "Do not screenshot private messages or share someone's account details.",
            "Do not try to identify a person who is posting under a pseudonym.",
            "Your own username is public. Your email address is optional and is never shown to other students.",
          ],
        },
        {
          heading: "3. Keep school work honest",
          bullets: [
            "Do not share exam questions or answers while an exam is running.",
            "Do not impersonate a teacher, a student, or a club officer.",
            "Ask about assignments and study methods; do not ask others to do the work for you.",
          ],
        },
        {
          heading: "4. Stay on purpose",
          bullets: [
            "No spam, advertising, referral links, or unrelated promotion.",
            "Use the board and tags that fit the topic. One thread per event or announcement is enough.",
            "Do not repeatedly bump a thread just to keep it at the top.",
          ],
        },
        {
          heading: "5. Use reports instead of fights",
          paragraphs: [
            "The Report button on every post reaches the moderators. The person you report is not told who reported them.",
            "Do not retaliate against someone who reported you, and do not file reports to silence opinions you dislike.",
          ],
        },
        {
          heading: "6. Accounts are personal",
          bullets: [
            "One account per person. Do not share your password or let someone else post from your account.",
            "You are responsible for what is posted from your account.",
          ],
        },
        {
          heading: "7. When a rule is broken",
          paragraphs: [
            "A moderator can remove a post, lock a thread, or remove a thread. Removed posts stay visible as a placeholder and the action is recorded in the audit log.",
            "Serious safety issues, threats, or personal information are escalated to the teacher advisor and, when necessary, to the school.",
            "See the moderation policy for how reports are handled and how to appeal.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy notice",
      intro:
        "Short version: this site stores what it needs to run a forum, shows only your username publicly, and uses no analytics, advertising, or third-party trackers.",
      updated: `Last updated: ${POLICY_UPDATES.privacy}`,
      sections: [
        {
          heading: "What we store",
          bullets: [
            "Your username, which is public, and an optional email address, which is never displayed to other users.",
            "A password hash made with scrypt. The plain password is never stored or logged.",
            "Your threads, replies, likes, bookmarks, and the tags attached to your threads. These are public unless removed by a moderator.",
            "Read timestamps, so the site can show a New badge. They store only a time and a thread id.",
            "When you last opened the notification inbox, so the site knows which replies, comments, likes, and saves are new to you. The events themselves are read from the rows already listed here; opening the inbox stores one timestamp.",
            "Rate-limit rows: a key, a count, and a reset time, one per window. When the deployment runs behind a reverse proxy, the key includes the client IP address; without a proxy every request shares a single key. Expired rows are deleted, and the longest window is 24 hours.",
            "Reports you file, including the reason and the reported post. Moderators can see the report; the reported person cannot see who filed it.",
            "Moderation actions in an audit log: who acted, what they did, the target, and when.",
            "Session records: a hash of the session token, its expiry, and when it was created.",
          ],
        },
        {
          heading: "What we do not store",
          bullets: [
            "No real name, grade, class, birthday, photo, or student number is required.",
            "No profile of your interests or behaviour. Nothing here measures what you read in order to target advertising, because there is no advertising.",
            "No analytics, advertising identifiers, or third-party tracking scripts.",
          ],
        },
        {
          heading: "Cookies",
          bullets: [
            "toyooka_session keeps you signed in. It is HttpOnly, SameSite=Lax, and expires after 30 days.",
            "locale remembers whether you chose Japanese or English. It expires after one year and carries no identity.",
            "There are no other cookies. Clearing them signs you out and resets the language choice.",
          ],
        },
        {
          heading: "Who can read what",
          bullets: [
            "Anyone on the internet can read public threads and replies, even without an account.",
            "Moderators can see the report queue, automatic flags, and the audit log. They cannot see your email address in the interface.",
            "The maintainer has direct database access for operation and repair.",
            "The teacher advisor can request specific records through the maintainer when there is a safety concern. There is no bulk staff access.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Active threads and replies stay until the site is retired or you ask the maintainer to remove your content.",
            "Removed content is soft-deleted: the body remains in the database for audit and is shown as a placeholder. There is no automatic purge yet.",
            "Sessions expire after 30 days. Reports and audit rows are kept while they are useful for safety and accountability.",
            "A retention schedule (for example, purging removed bodies after 180 days) is documented but is not enforced by code yet. The school and the maintainer must agree before it is enabled.",
          ],
        },
        {
          heading: "Your choices",
          bullets: [
            "You can ask the maintainer to correct or remove your own content, or to delete your account.",
            "Account deletion is handled manually today; there is no self-service delete button yet.",
            "You can stop using the site at any time. Posts already made remain part of the discussion unless removed.",
          ],
        },
        {
          heading: "Minors and safety",
          paragraphs: [
            "Most users are minors. The site deliberately collects as little personal data as possible and has no direct messages or uploads.",
            "If you believe someone is in immediate danger, contact a teacher, your guardian, or the emergency services. This site is not monitored around the clock.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "When this notice changes, the date above changes and the site announces the change in the Site Feedback board.",
          ],
        },
      ],
    },
    moderation: {
      title: "Moderation policy",
      intro:
        "Every report is reviewed by a person. Automatic word matching only sorts the queue; it never hides or deletes a post on its own.",
      updated: `Last updated: ${POLICY_UPDATES.moderation}`,
      sections: [
        {
          heading: "What moderators can do today",
          bullets: [
            "Remove a post. It becomes a visible placeholder, and the body stays in the database for audit.",
            "Lock a thread so it stays readable but accepts no new replies.",
            "Remove a thread so it disappears from boards and direct links.",
            "Dismiss a report without removing the post.",
            "Every one of these actions is written to the audit log with the moderator's account.",
          ],
        },
        {
          heading: "How a report is handled",
          bullets: [
            "Reports enter one queue, oldest first. During the beta, the target is a first response within 48 hours.",
            "A moderator may remove the post, dismiss the report, or ask for more context in the thread.",
            "The reported person is not told who reported them.",
            "A report is not a verdict. Moderators are expected to read the surrounding thread before acting.",
          ],
        },
        {
          heading: "Automatic flags",
          paragraphs: [
            "A local word list creates an automatic flag when a post matches. The flag appears in the same queue with an Auto-detected label and the matched terms.",
            "Automatic flags are advisory. False positives, especially in health or biology discussions, are expected and are dismissed by a human.",
          ],
        },
        {
          heading: "Accounts and escalation",
          bullets: [
            "Account suspension is not implemented yet. Serious or repeated violations are handled by the maintainer and the teacher advisor outside the moderation screen.",
            "Threats, stalking, disclosure of personal information, and anything involving immediate safety are escalated to the school.",
            "Moderators do not use their access to read email addresses, harass users, or win arguments.",
            "A moderator with a personal conflict in a thread should leave that report to someone else.",
          ],
        },
        {
          heading: "Appeals",
          paragraphs: [
            "If your post was removed and you think the decision was wrong, do not repost it. Ask in the Site Feedback board or contact the maintainer, and include the thread link.",
            "The teacher advisor is the next step if the maintainer and the moderator cannot resolve it.",
          ],
        },
        {
          heading: "Emergencies",
          paragraphs: [
            "This site is not an emergency service and is not monitored 24 hours a day. If someone is in immediate danger, contact a teacher, the school office, your guardian, or the emergency services first.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of use",
      intro:
        "Short version: what you post stays yours, you give this site permission to show it, and a post that breaks the rules can be removed. This page is the agreement that the community rules and the privacy notice hang from.",
      updated: `Last updated: ${POLICY_UPDATES.terms}`,
      sections: [
        {
          heading: "1. What this agreement covers",
          paragraphs: [
            "These terms are the agreement between you and the people who run this site. They apply to every page, form, and downloadable file on this domain, and they take effect when you first use the site.",
            "The community rules, the privacy notice, and the moderation policy are part of these terms. Where a document is more specific than this page, the specific document governs that subject: the rules for conduct, the privacy notice for stored data, and the moderation policy for how a report is reviewed.",
            "If you do not accept these terms, do not use the site.",
          ],
        },
        {
          heading: "2. Who may use the site",
          bullets: [
            "The site is for students and staff of the school. Guests may read public threads without an account.",
            "Registration is not gated yet: the site does not check that you belong to the school. Belonging is a condition of use, not a lock on the door, and deciding how registration is restricted is still open (question Q5 in this project's notes).",
            "One account per person. Do not open another account to get around a removal, a limit, or a suspension.",
            "If you are under 18, take part only when a teacher or your guardian knows that you use this site.",
            "You are responsible for your password. Every action taken while your account is signed in is attributed to your account, and a moderation action is recorded with the account that performed it.",
          ],
        },
        {
          heading: "3. What you write stays yours",
          paragraphs: [
            "You keep the copyright in everything you post. These terms do not transfer it to the school, to the maintainers, or to anyone else.",
            "To run the site, you give the people who operate it a non-exclusive, royalty-free permission to store, display, back up, export, and moderate what you post. That permission exists for one purpose, which is operating this site, and it covers nothing else: it does not allow selling your writing, licensing it to a third party, or publishing it outside this site.",
            "The permission to show a post to other students ends when that post is removed or your account is deleted. A removed post stays in the database as a placeholder, and a moderator handling a report can still read it. Copies that already exist inside a backup, an audit record, or a downloaded thread keep the permission until that copy is deleted under the retention rules in the privacy notice, which that notice says the code does not enforce yet.",
            "Post only what you wrote, or what you have the right to post. Do not paste someone else's text, image, or file without permission.",
            "A moderator may remove a post and leave a placeholder in its place. Posting here means accepting that this can happen without your prior consent.",
          ],
        },
        {
          heading: "4. What you must not do",
          bullets: [
            "Post another person's real name, address, phone number, class schedule, or photograph without their permission.",
            "Threaten, harass, stalk, or organise a group against a person.",
            "Impersonate a teacher, a student, a club officer, or this site.",
            "Break the law, or use the site to plan something that would.",
            "Probe, overload, or attempt to break the site, another account, or the moderators' work.",
            "Copy the site's posts in bulk for use somewhere else, or post advertising, referral links, and spam.",
            "The community rules expand on each of these, and they are part of this agreement.",
          ],
        },
        {
          heading: "5. What the operators may do",
          bullets: [
            "Remove a post, lock a thread, remove a thread, or archive a board. Every one of these actions is recorded in the audit log.",
            "Suspend an account once the moderation screen supports it. Until then a suspension is handled by the maintainer outside the interface.",
            "Change the site, and eventually close it. It is run by students, so it depends on the people running it, and it can be offline during an exam period, a server move, or the end of a school year.",
            "None of this obliges the operators to keep a post, a board, or the site online, or to publish a reason, except where the moderation policy says a reason is given.",
          ],
        },
        {
          heading: "6. Taking your writing with you",
          paragraphs: [
            "Every thread can be downloaded as a plain text file from its own page. Use that if you want to keep a discussion, and use it before the site closes.",
            "Account deletion is handled by the maintainer today, by hand. Ask them, and say whether you want your posts removed or left in place under your username.",
          ],
        },
        {
          heading: "7. What is not promised",
          paragraphs: [
            "The site is provided as it is. It may lose data, display something wrong, or be unreachable. The people who run it are students, and they cannot promise that a post will still be available next year.",
            "The site is not an official communication channel of the school. Anything that affects your grades, your enrolment, or your safety comes from a teacher or the school office, not from a thread here.",
            "The site is not an emergency service and is not monitored around the clock. If someone is in immediate danger, contact a teacher, the school office, your guardian, or the emergency services.",
          ],
        },
        {
          heading: "8. Data and privacy",
          paragraphs: [
            "What is stored, who can read it, and how long it is kept are set out in the privacy notice, which is part of these terms.",
            "There is no analytics, no advertising, and no third-party tracker here. What you write is not sold, and it is not used to build a profile of you for anyone else.",
          ],
        },
        {
          heading: "9. Changes to these terms",
          paragraphs: [
            "When these terms change, the date at the top of the page changes with them.",
            "A change that affects what you may post, or how your writing is used, is announced in the Site Feedback board before it takes effect, unless the change is urgent for safety.",
            "Continuing to use the site after a change means the new version applies to you. If you do not accept it, stop using the site and ask the maintainer to remove your content.",
          ],
        },
        {
          heading: "10. Law and contact",
          bullets: [
            "These terms follow Japanese law.",
            "Contact the maintainer through the Site Feedback board, or at the address on the project's repository page. If that does not settle the matter, ask the teacher advisor.",
            "If a part of these terms is found to be unenforceable, the rest of the terms still apply.",
          ],
        },
      ],
    },
  },
  ja: {
    rules: {
      title: "コミュニティルール",
      intro:
        "ここは学校の掲示板です。先生を含め、学校の誰でもあなたの書き込みを読めます。全校生徒が読んでいるつもりで書いてください。",
      updated: `最終更新: ${POLICY_UPDATES.rules}`,
      sections: [
        {
          heading: "1. 人を傷つけない",
          paragraphs: [
            "意見が違っても、相手ではなく考え方について話してください。嫌がらせ、脅し、差別的な言葉、大勢で一人を攻撃する行為は認めません。",
            "腹が立ったときは、返信する前に少し離れてください。言い返す代わりに通報できます。",
          ],
        },
        {
          heading: "2. 個人情報を守る",
          bullets: [
            "本人の許可なく、実名、住所、電話番号、メールアドレス、時間割、写真を投稿しないでください。",
            "私的なメッセージのスクリーンショットや、他の人のアカウント情報を共有しないでください。",
            "偽名で投稿している人の身元を推測したり、特定しようとしたりしないでください。",
            "自分のユーザー名は公開されます。メールアドレスは任意で、他の生徒には表示されません。",
          ],
        },
        {
          heading: "3. 勉強の公正さを守る",
          bullets: [
            "試験の実施中に、問題や解答を共有しないでください。",
            "先生、生徒、部活動の役員になりすまさないでください。",
            "課題や勉強の進め方を聞くのはかまいませんが、他人に課題をやらせるのはやめてください。",
          ],
        },
        {
          heading: "4. 目的に沿って使う",
          bullets: [
            "スパム、宣伝、紹介リンク、話題と関係のない勧誘は禁止です。",
            "内容に合ったボードとタグを使ってください。行事や連絡のスレッドは 1 本で足ります。",
            "先頭に上げるためだけに、何度も返信してスレッドを押し上げないでください。",
          ],
        },
        {
          heading: "5. 言い争いではなく通報を使う",
          paragraphs: [
            "各投稿の通報ボタンはモデレーターに届きます。通報した人の名前が、通報された相手に伝わることはありません。",
            "通報した人への報復や、気に入らない意見を黙らせるための通報はやめてください。",
          ],
        },
        {
          heading: "6. アカウントは本人のもの",
          bullets: [
            "アカウントは 1 人 1 つです。パスワードを共有したり、他の人に投稿させたりしないでください。",
            "自分のアカウントから投稿された内容は、自分が責任を持ってください。",
          ],
        },
        {
          heading: "7. ルールが破られたとき",
          paragraphs: [
            "モデレーターは投稿の削除、スレッドのロック、スレッドの削除ができます。削除された投稿はプレースホルダーとして残り、操作は監査ログに記録されます。",
            "安全に関わる深刻な事案、脅し、個人情報の流出は、担当教員に報告し、必要に応じて学校へつなぎます。",
            "通報の扱い方と異議申し立ての方法は、モデレーション方針に書いてあります。",
          ],
        },
      ],
    },
    privacy: {
      title: "プライバシー通知",
      intro:
        "短く言うと、このサイトは掲示板を動かすために必要な情報だけを保存し、公開するのはユーザー名だけです。アクセス解析、広告、外部のトラッカーは使いません。",
      updated: `最終更新: ${POLICY_UPDATES.privacy}`,
      sections: [
        {
          heading: "保存する情報",
          bullets: [
            "ユーザー名（公開）と、任意のメールアドレス（他の利用者には表示しません）。",
            "scrypt で作ったパスワードのハッシュ。平文のパスワードは保存も記録もしません。",
            "スレッド、返信、いいね、保存、スレッドに付けたタグ。モデレーターが削除しない限り公開されます。",
            "既読の時刻。「新着」を表示するために使い、時刻とスレッド ID だけを保存します。",
            "通知を最後に開いた時刻。返信・コメント・いいね・保存のうち、どれがまだ見ていないものかを判定するために使います。通知そのものは上の表の行から読み出すだけで、保存するのはこの時刻 1 つです。",
            "レート制限の行（キー、回数、リセット時刻を 1 組として、ウィンドウごとに 1 行）。リバースプロキシの背後で動かしている場合はキーに接続元の IP アドレスが入り、プロキシがない場合はすべてのリクエストが 1 つのキーを共有します。期限が切れた行は削除され、最も長いウィンドウは 24 時間です。",
            "通報した内容（理由と対象の投稿）。モデレーターは見られますが、通報された人に通報者の名前は伝わりません。",
            "モデレーション操作の監査ログ（行為者、操作、対象、時刻）。",
            "セッションの記録（トークンのハッシュ、有効期限、作成時刻）。",
          ],
        },
        {
          heading: "保存しない情報",
          bullets: [
            "本名、学年、クラス、誕生日、写真、出席番号は求めません。",
            "興味や行動の記録。何を読んだかを広告の出し分けに使うことはありません。そもそも広告がありません。",
            "アクセス解析、広告の識別子、外部の追跡スクリプトはありません。",
          ],
        },
        {
          heading: "Cookie",
          bullets: [
            "toyooka_session はログイン状態を保ちます。HttpOnly、SameSite=Lax で、30 日で失効します。",
            "locale は日本語と英語のどちらを選んだかを覚えます。1 年で失効し、身元の情報は含みません。",
            "この 2 つ以外の Cookie はありません。消すとログアウトし、言語の選択も初期化されます。",
          ],
        },
        {
          heading: "誰が読めるか",
          bullets: [
            "公開スレッドと返信は、アカウントのない人も含め、インターネット上の誰でも読めます。",
            "モデレーターは通報キュー、自動フラグ、監査ログを見られます。画面からメールアドレスを見ることはできません。",
            "保守担当は、運用と復旧のためにデータベースへ直接アクセスします。",
            "担当教員は、安全上の懸念があるときに、保守担当を通じて特定の記録を求められます。教職員全体が一括で閲覧する経路はありません。",
          ],
        },
        {
          heading: "保存する期間",
          paragraphs: [
            "公開中のスレッドと返信は、サイトを閉じるか、本人から削除の依頼があるまで残ります。",
            "削除した内容は論理削除です。本文は監査のためにデータベースに残り、画面にはプレースホルダーを表示します。自動削除はまだありません。",
            "セッションは 30 日で失効します。通報と監査の記録は、安全と説明責任のために必要な間だけ保持します。",
            "削除した本文を 180 日後に消す、といった保存期間の案は文書にはありますが、まだコードでは実行していません。有効にする前に、学校と保守担当の合意が必要です。",
          ],
        },
        {
          heading: "本人ができること",
          bullets: [
            "自分の投稿の訂正や削除、アカウントの削除は、保守担当に依頼できます。",
            "アカウントの削除は現在手作業です。画面から自分で消すボタンはまだありません。",
            "いつでも利用をやめられます。すでに投稿した内容は、削除されない限り議論の一部として残ります。",
          ],
        },
        {
          heading: "未成年の利用と安全",
          paragraphs: [
            "利用者の多くは未成年です。このサイトは個人情報をできるだけ集めず、ダイレクトメッセージもアップロードもありません。",
            "誰かが差し迫った危険にあると思ったら、先生、保護者、または緊急窓口に連絡してください。このサイトは 24 時間監視されていません。",
          ],
        },
        {
          heading: "変更",
          paragraphs: [
            "この通知を変えたときは、上の日付を更新し、サイトへの意見ボードで知らせます。",
          ],
        },
      ],
    },
    moderation: {
      title: "モデレーション方針",
      intro:
        "通報はすべて人が確認します。自動の語句照合はキューを並べ替えるだけで、投稿を勝手に隠したり削除したりすることはありません。",
      updated: `最終更新: ${POLICY_UPDATES.moderation}`,
      sections: [
        {
          heading: "現在モデレーターができること",
          bullets: [
            "投稿を削除する。画面にはプレースホルダーが残り、本文は監査のためにデータベースに残ります。",
            "スレッドをロックする。読める状態のまま、新しい返信を受け付けません。",
            "スレッドを削除する。ボードからも直接リンクからも見えなくなります。",
            "投稿を残したまま通報を却下する。",
            "どの操作も、モデレーターのアカウントと一緒に監査ログへ記録されます。",
          ],
        },
        {
          heading: "通報の扱い",
          bullets: [
            "通報は 1 つのキューに古い順で入ります。ベータ期間中は、48 時間以内の初回対応を目標にします。",
            "モデレーターは投稿を削除するか、通報を却下するか、スレッドで補足を求めることができます。",
            "通報された人に、通報した人の名前は伝わりません。",
            "通報は判決ではありません。モデレーターは、操作の前に前後の文脈を読むことになっています。",
          ],
        },
        {
          heading: "自動フラグ",
          paragraphs: [
            "ローカルの語句リストに一致すると、自動フラグが立ちます。同じキューに「自動検出」と一致した語が表示されます。",
            "自動フラグは助言です。健康や生物の話題では誤検出も起こり得るので、人が確認して却下します。",
          ],
        },
        {
          heading: "アカウントとエスカレーション",
          bullets: [
            "アカウントの停止機能はまだありません。深刻な違反や繰り返しの違反は、モデレーション画面の外で、保守担当と担当教員が対応します。",
            "脅し、つきまとい、個人情報の流出、差し迫った安全に関わる事案は、学校へエスカレーションします。",
            "モデレーターは、その立場を使ってメールアドレスを読んだり、利用者を困らせたり、議論に勝とうとしたりしません。",
            "自分の人間関係が絡むスレッドの通報は、他の人に任せます。",
          ],
        },
        {
          heading: "異議申し立て",
          paragraphs: [
            "自分の投稿が削除され、判断が違うと思ったら、同じ内容を投稿し直さないでください。サイトへの意見ボードか保守担当に、スレッドのリンクを添えて相談してください。",
            "保守担当とモデレーターで解決しない場合は、担当教員が次の窓口になります。",
          ],
        },
        {
          heading: "緊急時",
          paragraphs: [
            "このサイトは緊急連絡の手段ではありません。24 時間監視もしていません。誰かが差し迫った危険にあるときは、まず先生、学校の事務室、保護者、または緊急窓口に連絡してください。",
          ],
        },
      ],
    },
    terms: {
      title: "利用規約",
      intro:
        "要点：投稿したものの著作権はあなたに残ります。このサイトに表示する許可だけをいただきます。ルールに反する投稿は削除することがあります。このページは、コミュニティルールとプライバシー通知の土台になる約束です。",
      updated: `最終更新: ${POLICY_UPDATES.terms}`,
      sections: [
        {
          heading: "1. この規約が定めること",
          paragraphs: [
            "この規約は、あなたとこのサイトの運営者のあいだの約束です。このドメインのすべてのページ、フォーム、ダウンロードできるファイルに適用され、あなたがこのサイトを使い始めた時点で効力を持ちます。",
            "コミュニティルール、プライバシー通知、モデレーション方針も、この規約の一部です。内容が重なる部分では、より具体的な文書が優先されます。行動についての決まりはコミュニティルール、保存される情報はプライバシー通知、通報の扱いはモデレーション方針に従います。",
            "この規約に同意できない場合は、このサイトを使わないでください。",
          ],
        },
        {
          heading: "2. 利用できる人",
          bullets: [
            "このサイトは、本校の生徒と教職員のためのものです。アカウントがなくても、公開されているスレッドは誰でも読めます。",
            "登録はまだ制限されていません。本校の関係者かどうかを確認する仕組みがありません。関係者であることは利用の条件であって、入り口の鍵ではありません。登録をどう制限するかは未決のままです（このプロジェクトの記録では Q5）。",
            "アカウントは 1 人 1 つです。削除や制限を避けるために、もう 1 つ作ることはしないでください。",
            "18 歳未満の方は、先生または保護者がこのサイトの利用を知っている場合にだけ参加してください。",
            "パスワードは自分で管理してください。ログイン中のアカウントによる操作はすべてそのアカウントのものとして扱われ、モデレーション操作は実行したアカウントとともに監査ログに残ります。",
          ],
        },
        {
          heading: "3. 投稿した文章の権利",
          paragraphs: [
            "投稿した内容の著作権は、あなたに残ります。この規約は、その権利を学校、運営者、その他の誰かへ譲渡するものではありません。",
            "サイトを運営するために、運営者に対して、投稿を保存・表示・バックアップ・書き出し・モデレーションする非独占的で無償の許可を与えていただきます。この許可の目的はこのサイトの運営だけで、それ以外には及びません。あなたの文章を販売すること、第三者に利用許諾すること、このサイトの外で公開することは含みません。",
            "他の生徒に投稿を見せる許可は、その投稿が削除されたとき、またはアカウントが削除されたときに終わります。削除された投稿はプレースホルダーとしてデータベースに残り、通報を扱うモデレーターは本文を読むことができます。バックアップ、監査記録、書き出したスレッドの中にすでに存在する複製については、プライバシー通知に書かれた保存の決まりに従って削除されるまで許可が続きます（その決まりがまだコードで自動化されていないことも、同じ通知に書かれています）。",
            "自分で書いたもの、または投稿する権利があるものだけを投稿してください。他人の文章、画像、ファイルを、許可なく貼り付けないでください。",
            "モデレーターは投稿を削除し、その場所にプレースホルダーを残すことがあります。ここに投稿することは、事前の同意なしにそうなることを受け入れることを意味します。",
          ],
        },
        {
          heading: "4. してはいけないこと",
          bullets: [
            "他人の本名、住所、電話番号、時間割、写真を、本人の許可なく投稿する。",
            "脅す、つきまとう、嫌がらせをする、大勢で一人を攻撃する。",
            "先生、生徒、部活動の役員、またはこのサイトになりすます。",
            "法律に反する行為、またはそれを計画するためにこのサイトを使う。",
            "このサイト、他のアカウント、モデレーターの作業を妨害したり、突破しようとしたりする。",
            "投稿を大量にコピーして他所で使う。宣伝、紹介リンク、スパムを投稿する。",
            "それぞれの詳しい説明はコミュニティルールにあり、そのルールもこの規約の一部です。",
          ],
        },
        {
          heading: "5. 運営ができること",
          bullets: [
            "投稿の削除、スレッドのロック、スレッドの削除、ボードのアーカイブ。いずれも監査ログに記録されます。",
            "モデレーション画面が対応したのち、アカウントの停止。それまでは保守担当が画面の外で対応します。",
            "サイトの変更、および最終的な閉鎖。生徒が運営しているため、運営する人がいなくなれば続きません。試験期間、サーバーの移転、年度の区切りには、つながらないことがあります。",
            "運営者は、投稿・ボード・サイトを残す義務を負いません。理由の公開も、モデレーション方針に書かれている場合を除いて義務ではありません。",
          ],
        },
        {
          heading: "6. 自分の文章を持ち出す",
          paragraphs: [
            "スレッドは、そのページからプレーンテキストのファイルとして保存できます。残しておきたい議論は、サイトが閉じる前に書き出してください。",
            "アカウントの削除は、現在は保守担当が手作業で行います。依頼するときに、投稿を削除するか、ユーザー名のまま残すかを伝えてください。",
          ],
        },
        {
          heading: "7. 約束しないこと",
          paragraphs: [
            "このサイトは現状のまま提供されます。データを失うこと、表示が誤ること、つながらなくなることがあります。運営者は生徒であり、投稿が来年も残っていることを約束できません。",
            "このサイトは学校の公式な連絡手段ではありません。成績、進路、安全に関わる連絡は、先生または学校の事務室から来るもので、ここのスレッドではありません。",
            "このサイトは緊急連絡の手段ではなく、24 時間の監視もしていません。誰かが差し迫った危険にあるときは、先生、学校の事務室、保護者、または緊急窓口に連絡してください。",
          ],
        },
        {
          heading: "8. データとプライバシー",
          paragraphs: [
            "何を保存し、誰が読めて、いつまで残るかは、プライバシー通知に書かれています。その通知もこの規約の一部です。",
            "アクセス解析、広告、外部の追跡はありません。書いた内容が販売されることも、誰かのためにあなたの傾向を分析する材料にされることもありません。",
          ],
        },
        {
          heading: "9. この規約の変更",
          paragraphs: [
            "この規約を変更したときは、ページ上部の日付も変わります。",
            "投稿できる内容、または書いたものの使われ方に関わる変更は、安全上急ぐ場合を除いて、効力が生じる前に「サイトへの意見」ボードで知らせます。",
            "変更のあとも使い続ける場合は、新しい内容に同意したものとみなします。同意できない場合は利用をやめ、保守担当に自分の内容の削除を依頼してください。",
          ],
        },
        {
          heading: "10. 準拠法と連絡先",
          bullets: [
            "この規約は日本法に従います。",
            "連絡先は「サイトへの意見」ボード、またはプロジェクトのリポジトリページに記載のアドレスです。それでも解決しない場合は、担当教員に相談してください。",
            "この規約の一部が効力を持たないと判断された場合でも、残りの部分は引き続き適用されます。",
          ],
        },
      ],
    },
  },
};

export function policyFor(locale: Locale, key: PolicyKey): PolicyDocument {
  return POLICIES[locale][key];
}
