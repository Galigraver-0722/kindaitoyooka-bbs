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

export type PolicyKey = "rules" | "privacy" | "moderation";

export const POLICY_UPDATED = "2026-10-24";

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
      updated: `Last updated: ${POLICY_UPDATED}`,
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
      updated: `Last updated: ${POLICY_UPDATED}`,
      sections: [
        {
          heading: "What we store",
          bullets: [
            "Your username, which is public, and an optional email address, which is never displayed to other users.",
            "A password hash made with scrypt. The plain password is never stored or logged.",
            "Your threads, replies, likes, bookmarks, and the tags attached to your threads. These are public unless removed by a moderator.",
            "Read timestamps, so the site can show a New badge. They store only a time and a thread id.",
            "Reports you file, including the reason and the reported post. Moderators can see the report; the reported person cannot see who filed it.",
            "Moderation actions in an audit log: who acted, what they did, the target, and when.",
            "Session records: a hash of the session token, its expiry, and when it was created.",
          ],
        },
        {
          heading: "What we do not store",
          bullets: [
            "No real name, grade, class, birthday, photo, or student number is required.",
            "No IP address is written to the database. Rate-limit counters live in process memory and disappear when the app restarts.",
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
      updated: `Last updated: ${POLICY_UPDATED}`,
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
  },
  ja: {
    rules: {
      title: "コミュニティルール",
      intro:
        "ここは学校の掲示板です。先生を含め、学校の誰でもあなたの書き込みを読めます。全校生徒が読んでいるつもりで書いてください。",
      updated: `最終更新: ${POLICY_UPDATED}`,
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
      updated: `最終更新: ${POLICY_UPDATED}`,
      sections: [
        {
          heading: "保存する情報",
          bullets: [
            "ユーザー名（公開）と、任意のメールアドレス（他の利用者には表示しません）。",
            "scrypt で作ったパスワードのハッシュ。平文のパスワードは保存も記録もしません。",
            "スレッド、返信、いいね、保存、スレッドに付けたタグ。モデレーターが削除しない限り公開されます。",
            "既読の時刻。「新着」を表示するために使い、時刻とスレッド ID だけを保存します。",
            "通報した内容（理由と対象の投稿）。モデレーターは見られますが、通報された人に通報者の名前は伝わりません。",
            "モデレーション操作の監査ログ（行為者、操作、対象、時刻）。",
            "セッションの記録（トークンのハッシュ、有効期限、作成時刻）。",
          ],
        },
        {
          heading: "保存しない情報",
          bullets: [
            "本名、学年、クラス、誕生日、写真、出席番号は求めません。",
            "IP アドレスはデータベースに書きません。レート制限のカウンターはプロセスのメモリにあり、再起動で消えます。",
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
      updated: `最終更新: ${POLICY_UPDATED}`,
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
  },
};

export function policyFor(locale: Locale, key: PolicyKey): PolicyDocument {
  return POLICIES[locale][key];
}
