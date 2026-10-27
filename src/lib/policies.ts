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
  rules: "2026-10-27",
  privacy: "2026-10-27",
  moderation: "2026-10-27",
  terms: "2026-10-27",
};

/** The newest revision in the set; equal to the latest value in POLICY_UPDATES. */
export const POLICY_UPDATED = "2026-10-27";

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
        "These rules say what may be posted here, and how to behave while posting. They are part of the terms of use, and a breach is handled under the moderation policy. Read them once; the site does not show them again.",
      updated: `Last updated: ${POLICY_UPDATES.rules}`,
      sections: [
        {
          heading: "1. How to read these rules",
          paragraphs: [
            "Every rule below applies to threads, replies, titles, tags, board names, board descriptions, and usernames. There are no images and no file uploads, so the rules are about text.",
            "A rule names the kind of behaviour it forbids. If something is not named but plainly belongs to the same kind, it is treated the same way. If you are unsure whether a post is allowed, ask in the Site Feedback board before posting.",
          ],
        },
        {
          heading: "2. Treat people as people",
          bullets: [
            "Disagree with an argument; do not attack the person making it. Insults, mockery aimed at a person, and sarcasm meant to humiliate are harassment.",
            "No threats, no intimidation, and no stalking: not in a thread, and not by following someone across threads.",
            "No coordinated pile-ons. Calling in several accounts against one person is harassment even when each message looks mild.",
            "Do not keep replying to someone who has asked you to stop. Report instead.",
          ],
        },
        {
          heading: "3. Protect personal information",
          bullets: [
            "Do not post anyone's real name, address, phone number, email address, class schedule, student number, photographs, family details, health information, or club membership without their permission.",
            "Do not try to work out who is posting under a pseudonym, and do not publish a guess. A pseudonym is there so that a question can be asked at all.",
            "Do not screenshot or forward private messages, and do not share someone's account details.",
            "Your own username is public. Your email address is optional and is never shown to other users.",
          ],
        },
        {
          heading: "4. No sexual content, and nothing sexual about minors",
          paragraphs: [
            "Sexual content is not allowed anywhere on this site. Content that sexualises a minor is not allowed in any form, including jokes, links, and descriptions.",
            "If something of that kind appears, report it immediately. It is treated as an emergency case rather than an ordinary report.",
          ],
        },
        {
          heading: "5. No violence, threats, or encouragement of self-harm",
          bullets: [
            "No instructions for making weapons or causing harm, and no praise for violence.",
            "Do not encourage suicide, self-harm, or disordered eating, and do not describe methods.",
            "If you are worried about someone, say so plainly and tell a teacher. This site is not monitored around the clock and cannot be the place where a risk is noticed.",
          ],
        },
        {
          heading: "6. Keep school work honest",
          bullets: [
            "Do not share exam questions or answers while an exam is running.",
            "Do not impersonate a teacher, a student, a club officer, a moderator, or the site itself.",
            "Ask about assignments and study methods; do not ask someone else to do the work for you.",
            "When you use someone else's explanation or source, say where it came from.",
          ],
        },
        {
          heading: "7. No spam, advertising, or off-purpose use",
          bullets: [
            "No advertising, referral links, affiliate links, or recruiting for a group outside the school.",
            "One thread per event or announcement is enough. Do not open a second thread to repeat the same content.",
            "Do not bump a thread repeatedly to keep it at the top. A reply should add an answer or a detail, not push the thread up.",
            "Board names, descriptions, and tags follow the same rules as posts.",
          ],
        },
        {
          heading: "8. No illegal or dangerous activity",
          bullets: [
            "No sales or promotion of drugs, alcohol, tobacco, weapons, or age-restricted goods.",
            "No instructions for trespass, theft, fraud, or anything else illegal.",
            "No links to pirated material or to sites that distribute it.",
          ],
        },
        {
          heading: "9. Use the site as intended",
          bullets: [
            "Post in the board that fits, and add tags that describe the topic. The compose form suggests tags per board.",
            "Write a title that says what the thread is about. A title like \"help\" makes the thread impossible to find later.",
            "Japanese and English are both fine. Write in a way that the next reader can follow.",
            "Quote only the part of a reply you are answering. A wall of quoted text makes a thread unreadable.",
          ],
        },
        {
          heading: "10. Rules about the software itself",
          bullets: [
            "Do not run bots, crawlers, or scripts that post, edit, or react automatically.",
            "Do not copy the site's threads in bulk for use somewhere else.",
            "Do not probe, overload, or attempt to break the site, another account, or the moderator console.",
            "Do not create accounts to get around a removal, a rate limit, or a suspension.",
            "Do not try to get around the automatic word check. Some wording is refused before it is posted; other wording is accepted and queued for a moderator. Both lists live in the code, and disguising a word is itself a breach.",
          ],
        },
        {
          heading: "11. Reports are a feature, not a weapon",
          paragraphs: [
            "The Report button reaches the moderators. The reported person is not told who filed the report.",
            "Do not report an opinion you merely dislike, and do not report several times to push a post up the queue. Reporting in bad faith is itself a breach.",
            "Do not retaliate against someone who reported you, and do not retaliate against a moderator for a decision.",
          ],
        },
        {
          heading: "12. What happens when a rule is broken",
          bullets: [
            "A moderator may remove a post or a thread, lock a thread, or dismiss a report. Removal leaves a visible placeholder, and the action is written to the audit log.",
            "Repeated or serious breaches can lead to suspension. A suspended account cannot sign in and its sessions are deleted; its posts stay for the record.",
            "Threats, stalking, personal-information leaks, and anything involving immediate danger are escalated to the teacher advisor and, when necessary, to the school.",
            "The order of steps, the response target, and the appeal route are in the moderation policy.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy notice",
      intro:
        "Short version: this site stores what a forum needs, shows only your username publicly, and uses no analytics, no advertising, and no third-party tracker. This notice lists each item so that you can check it against what the site actually does.",
      updated: `Last updated: ${POLICY_UPDATES.privacy}`,
      sections: [
        {
          heading: "1. What this notice covers",
          paragraphs: [
            "This notice describes the personal data handled by this site: what is stored, why, who can read it, how long it is kept, and what you can ask for. It is part of the terms of use.",
            "It does not cover what a teacher, a school system, or another website does with something you tell them outside this site.",
          ],
        },
        {
          heading: "2. Who is responsible",
          bullets: [
            "The student maintainer operates the site and has direct access to the database for operation and repair.",
            "The teacher advisor can ask the maintainer for specific records when there is a safety concern. There is no bulk staff access and no staff account role.",
            "There is no data protection officer, and no company operates the site. For any request in this notice, contact the maintainer through the Site Feedback board or the address on the project's repository page.",
          ],
        },
        {
          heading: "3. What is stored",
          bullets: [
            "Your account: username (public), an optional email address (never shown to other users), a password hash made with scrypt, and the colours and bio you choose for your profile.",
            "When you registered, the moment you accepted the four documents and the version of each one: terms, rules, privacy notice, moderation policy. This is the record that you consented.",
            "Your content: threads, replies, titles, tags, likes, bookmarks, and the boards you open. Public unless a moderator removes them.",
            "Read markers: a timestamp per thread, used for the New badge. They store a time and a thread id, nothing else.",
            "Two inbox timestamps: when you last opened the notification panel and when you last opened the announcements panel. The lists themselves are computed from other rows; only the moment is stored.",
            "Reports you file: the reason, the post, and whether the report came from a person or from the automatic word check. Moderators see the report; the reported person does not see who filed it.",
            "Moderation records: the audit log stores the account, the action, the target, the time, and an optional detail for every removal, lock, report decision, suspension, role change, and board archive.",
            "Refused writes: when the word check stops a post, the site stores your account, the page you were writing on, which field matched, the matched word, the first 200 characters of the text, and the time. The post itself is not created. Moderators see this list; other readers do not.",
            "Sessions: a SHA-256 hash of the session token, its expiry, and when it was created. The token itself is never stored.",
            "Rate-limit rows: one row per time window, holding a key, a count, and a reset time. When the deployment runs behind a reverse proxy, the key includes the client IP address; without a proxy, every request shares a single key. Expired rows are deleted, and the longest window is 24 hours.",
          ],
        },
        {
          heading: "4. What is not stored",
          bullets: [
            "No real name, grade, class, birthday, photograph, student number, or address is required or requested.",
            "No IP address is stored except inside a rate-limit key, as described above.",
            "The site has no analytics, advertising identifier, third-party tracking script, or social plug-in.",
            "No private messages, no file uploads, and no images: the site accepts text only.",
            "No profile of your interests or behaviour is built, and nothing is sold or shared for advertising.",
          ],
        },
        {
          heading: "5. Why it is stored",
          bullets: [
            "To run the forum: show threads, remember what you have read, and keep you signed in.",
            "To keep people safe: receive reports, flag text for a human to review, and record what a moderator did.",
            "To prevent abuse: rate-limit repeated attempts and keep the evidence of a repeated breach.",
            "To show that consent was given: the timestamp stored at registration and the version of each document accepted.",
          ],
        },
        {
          heading: "6. Cookies",
          bullets: [
            "`toyooka_session` keeps you signed in. It is HttpOnly, SameSite=Lax, Secure in production, and expires after 30 days. Signing out deletes the server-side session.",
            "`locale` remembers whether you chose Japanese or English. It lasts one year and carries no identity.",
            "`theme` remembers which of the two designs you chose. It lasts one year, is set by the page rather than the server, and carries no identity.",
            "There are no other cookies and no third-party requests. Clearing cookies signs you out and resets both choices.",
          ],
        },
        {
          heading: "7. Who can read what",
          bullets: [
            "Anyone with the address of a thread can read it, without an account.",
            "Search engines are currently asked not to index the site, but that is a request to crawlers, not a lock: a link you share can still be opened by anyone who receives it.",
            "Moderators and administrators see the report queue, automatic flags, the audit log, and account status. They cannot see an email address in the interface.",
            "The maintainer can read the database directly when operating or repairing the site.",
            "The teacher advisor can request specific records through the maintainer when there is a safety concern.",
          ],
        },
        {
          heading: "8. How long it is kept",
          bullets: [
            "Active threads and replies stay until you ask for removal or the site is retired.",
            "Removed content is soft-deleted: the text stays in the database so a decision can be reviewed, and the page shows a placeholder. No purge period has been agreed yet, and the code does not enforce one.",
            "Sessions expire after 30 days. Signing out, changing a password through the maintainer, and suspension all delete the account's sessions.",
            "Rate-limit rows are deleted when their window expires; the longest window is 24 hours.",
            "Reports and audit rows are kept while they are useful for safety and accountability.",
            "Backups are files taken by the operator. A copy of your content inside a backup remains until that backup is deleted, on whatever schedule the operator keeps. This notice cannot promise that schedule for the operator.",
          ],
        },
        {
          heading: "9. Minors",
          paragraphs: [
            "Most users are minors, and the site is designed around that: pseudonymous usernames, optional email, no uploads, no direct messages, no advertising, and no third-party scripts.",
            "If you are under 18, use the site with the knowledge of a teacher or guardian. If you believe someone is in immediate danger, contact a teacher, your guardian, or the emergency services; this site is not monitored around the clock.",
          ],
        },
        {
          heading: "10. Your choices and rights",
          bullets: [
            "You can ask what is stored about you, ask for a correction, ask for your content to be removed, or ask for your account to be deleted.",
            "You can withdraw consent by asking the maintainer to delete the account. Withdrawal stops future processing; it does not undo actions already taken, and rows that the audit log or safety records require can be kept.",
            "Deletion is handled by hand today; there is no self-service delete button. Expect the maintainer to ask you to confirm from the account itself.",
            "Some requests can be limited: the audit log exists so that a moderation decision can be reviewed, and a backup has to be replaced before a copy disappears. When a limit applies, the maintainer should say which and why.",
            "If an answer does not satisfy you, ask the teacher advisor next.",
          ],
        },
        {
          heading: "11. Security and incidents",
          bullets: [
            "Passwords are hashed with scrypt and never stored or logged in plain text. Session tokens are random, and only their SHA-256 hash reaches the database.",
            "Every page that changes something checks the account and the role on the server; the interface is not the control.",
            "The deployment is expected to run over HTTPS. Cookies are marked Secure in production.",
            "If a leak is confirmed, the maintainer informs the teacher advisor and the affected accounts, rotates what can be rotated, and records what happened. The project has no 24-hour on-call and cannot promise a response time for a report received at night.",
          ],
        },
        {
          heading: "12. Changes and contact",
          paragraphs: [
            "When this notice changes, the date at the top changes. A change that affects what is collected, who can read it, or how long it is kept is announced in the Site Feedback board before it takes effect, unless safety makes that impossible.",
            "Send questions and requests to the Site Feedback board, or to the address on the project's repository page. If that does not settle it, ask the teacher advisor.",
          ],
        },
      ],
    },
    moderation: {
      title: "Moderation policy",
      intro:
        "Every report is read by a person. Automatic matching does two things: a short blocklist refuses certain wording before it becomes a post, and anything else it recognises is queued for a moderator as a hint. It never hides, edits, or deletes a post that already exists. This policy states who may act, what they may and may not do, and how a decision can be questioned.",
      updated: `Last updated: ${POLICY_UPDATES.moderation}`,
      sections: [
        {
          heading: "1. Scope",
          paragraphs: [
            "This policy covers the moderator console, where reports, accounts, content, and boards are handled, and the audit log that records every action taken there.",
            "It applies to posts, replies, threads, board metadata, and usernames. What happens outside the console (asking the teacher advisor, or the school) is described in section 11.",
          ],
        },
        {
          heading: "2. Roles",
          bullets: [
            "Students can post, reply, react, report, and open their own board. They cannot reach the console.",
            "Moderators handle reports and content, and may suspend a student account.",
            "Administrators do everything a moderator does, and in addition may suspend a moderator, change roles, and archive or restore a board.",
            "The console is at `/admin`. The older `/moderation` address redirects there, so there is one entry point.",
          ],
        },
        {
          heading: "3. What moderators can do",
          bullets: [
            "Remove a single post. The page keeps a placeholder and the text stays in the database for review.",
            "Lock a thread so it stays readable and accepts no new replies, or remove a whole thread.",
            "Dismiss a report without acting, or remove the post and resolve it. The outcome (removed or dismissed) and the acting account are recorded.",
            "Suspend a student account with a written reason, and restore it later.",
            "Report against a moderator is handled by an administrator, because a moderator may not suspend a moderator.",
          ],
        },
        {
          heading: "4. What moderators cannot do",
          bullets: [
            "Suspend an administrator, or suspend themselves. Suspending a moderator is reserved for an administrator.",
            "Demote the last remaining administrator; the console refuses it, because nobody would be left to restore access.",
            "Change their own role, or anyone's role, unless they are an administrator.",
            "Read an email address through the interface, use the console to win an argument, or act on a report they are involved in; that report goes to someone else.",
            "Use the automatic flag list as a verdict. A flag is a prompt to read the thread, nothing more.",
          ],
        },
        {
          heading: "5. How a report is handled",
          bullets: [
            "Reports enter one queue, oldest first, ten per page. The target is a first response within 48 hours during the beta.",
            "One reader filing the same report twice on the same post keeps one open entry, so the queue does not fill with duplicates.",
            "Before acting, read the surrounding thread. A quoted line can look worse than the exchange it came from.",
            "Decide one of three things: remove, dismiss, or ask in the thread for context. Then record the decision.",
            "The reported person is not told who reported them, and the reporter is not told the outcome.",
          ],
        },
        {
          heading: "6. Automatic flags",
          bullets: [
            "Every write is checked: thread titles, bodies, tags, replies, board names, board descriptions, and profile bios. Matching runs on normalised text: full-width and half-width forms count as the same word, and Japanese matching drops spaces and punctuation, so 「死 ね」 is still caught. English keeps word boundaries, so a deliberately spaced spelling can slip past; report it when you see one.",
            "The list has two layers. A short blocklist refuses the post outright: terms whose only ordinary use is abusive, such as a direct death threat, sexual violence, sexual content involving minors, or a slur. The author is told the wording cannot be posted, and the text is not stored.",
            "A longer list is advisory. It accepts the post and files an automatic entry in the same queue, labelled Auto-detected with the matched terms. Ambiguous words belong here, along with vocabulary from the CC BY 4.0 `naughty-words` lists that a school may legitimately discuss.",
            "Distress is not a violation. Phrases about wanting to disappear or to hurt oneself are queued, never refused, so that a person reads them and can reach out instead of the software hiding them.",
            "A refused write leaves no post, but the attempt is recorded: the account, the surface it came from, which field matched, the matched word, and the first 200 characters of the text. Moderators see this under Blocked in the console. The record is a signal, not a penalty; a student who keeps hitting it needs a conversation, not a removal.",
            "A moderator who dismisses a flag leaves no trace on the post and no penalty on the author.",
          ],
        },
        {
          heading: "7. Enforcement ladder",
          bullets: [
            "Most cases end with a removal or a dismissal, and the thread stays readable so the context survives.",
            "A repeated breach in the same thread can lead to locking the thread, which stops the exchange without erasing it.",
            "A repeated or serious breach across threads can lead to suspension. The reason is written down and stays with the account.",
            "Threats, stalking, disclosure of personal information, sexual content involving a minor, and anything involving immediate danger skip the ladder and go to escalation.",
            "There is no formal warning-point system. Consistency comes from the audit log and from discussing borderline cases, not from a score.",
          ],
        },
        {
          heading: "8. Suspension and restoration",
          bullets: [
            "A suspended account cannot sign in, and every session it held is deleted. Its posts and replies stay, so a thread does not lose its context.",
            "The account records the moment of suspension and the written reason. The action appears in the audit log.",
            "Restoration is the same decision in reverse and follows the same role rules. A restored account can sign in again; its old sessions do not come back.",
            "An administrator account cannot be suspended through the console. Removing an administrator's access is a role change, and it follows the last-administrator rule.",
          ],
        },
        {
          heading: "9. Appeals",
          paragraphs: [
            "If your post was removed or your account was suspended and you think the decision was wrong, do not repost the content and do not open a second account. Ask in the Site Feedback board or contact the maintainer, and include the thread link or the account name.",
            "A different moderator reviews the decision where possible. A suspension appeal is reviewed by an administrator.",
            "If the maintainer and the moderators cannot settle it, the teacher advisor is the next step.",
          ],
        },
        {
          heading: "10. Audit and accountability",
          bullets: [
            "Every removal, lock, report decision, suspension, restoration, role change, and board archive writes a row: who acted, what they did, the target, and when.",
            "Rows are append-only. There is no interface for editing or deleting an audit row, and a mistaken action is corrected by a new action, not by rewriting history.",
            "The audit log is visible to moderators and administrators. It is also what turns the 48-hour target into something a reader can check.",
          ],
        },
        {
          heading: "11. Emergencies and escalation",
          bullets: [
            "This site is not an emergency service and is not monitored around the clock.",
            "If someone is in immediate danger, contact a teacher, the school office, a guardian, or the emergency services first, and report the post afterwards.",
            "Serious safety cases are escalated to the teacher advisor and, when necessary, to the school. That step happens outside the console and is not recorded as a public action.",
          ],
        },
        {
          heading: "12. Changes to this policy",
          paragraphs: [
            "When this policy changes, the date at the top changes with it.",
            "A change to what a moderator may do, or to how a decision can be appealed, is announced in the Site Feedback board before it takes effect, unless safety makes that impossible.",
            "The moderation policy is part of the terms of use, so a breach of the rules is handled under both documents.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of use",
      intro:
        "These are the terms that registration asks you to accept. They define your account, what you may post, what the moderators may remove, which rights you keep, and what the operators do and do not promise. The community rules, the privacy notice, and the moderation policy are part of these terms.",
      updated: `Last updated: ${POLICY_UPDATES.terms}`,
      sections: [
        {
          heading: "1. Definitions",
          bullets: [
            "**The site**: this domain, its pages and forms, and any file it lets you download.",
            "**The operators**: the student maintainer, and the moderators and administrators who act through the console.",
            "**You**: the person holding the account, or the guest reading without one.",
            "**Content**: what a person posts here: threads, replies, titles, tags, usernames, board names, board descriptions, and profile fields. The site has no uploads.",
            "**Moderator** and **administrator**: the two roles that may act on other people's content. Administrator is the higher role; the differences are listed in the moderation policy.",
            "**These terms**: this document together with the three documents it declares part of it.",
          ],
        },
        {
          heading: "2. Accepting these terms",
          bullets: [
            "You accept by ticking one box per document on the registration form: these terms, the community rules, the privacy notice, and the moderation policy. The server checks all four, so a request that skips any of them is refused even if the browser's check is bypassed.",
            "The acceptance is stored as a timestamp and as the version of each of the four documents, since they are revised separately. That record exists so a later question about what you agreed to has an answer.",
            "Accounts created before the requirement existed have no record. Continuing to use the site accepts the current version.",
            "If you do not accept, do not register. If you already have an account and no longer accept, stop using the site and ask the maintainer to remove your content.",
          ],
        },
        {
          heading: "3. Who may use the site",
          bullets: [
            "The intended users are students and staff of the school. Guests may read public threads without an account.",
            "If you are under 18, use the site with the knowledge of a teacher or your guardian.",
            "Registration is not restricted by school membership: the site does not check that you belong to the school. Belonging is a condition of use, not an access control, and how registration should be restricted is still an open question for the school.",
            "One account per person. Opening another account to get around a removal, a limit, or a suspension is a breach of these terms.",
          ],
        },
        {
          heading: "4. Your account",
          bullets: [
            "You choose a username, which is public, and optionally an email address, which is never shown to other users.",
            "You are responsible for your password. Every action taken while your account is signed in is attributed to it, including moderation actions if you hold a role.",
            "There is no email reset. If you lose the password, ask a teacher or the maintainer; a reset prints a new password once and signs out every session on the account.",
            "You may ask the maintainer to delete your account. Deletion is done by hand today; there is no self-service button.",
            "An administrator may change your role. A moderator or administrator may suspend the account under the moderation policy; a suspended account cannot sign in and its sessions are deleted.",
          ],
        },
        {
          heading: "5. Your content stays yours",
          bullets: [
            "You keep the copyright in what you post. These terms do not transfer it to the school, to the operators, or to anyone else.",
            "You grant the operators a non-exclusive, royalty-free permission to store, display, back up, export, and moderate your content. The permission exists to operate this site and covers nothing else: it does not allow selling your writing, licensing it to a third party, or publishing it outside this site.",
            "The permission to show your content to other students ends when it is removed or your account is deleted. A removed item stays in the database as a placeholder, and a moderator handling a report can still read it. Copies inside a backup, an audit record, or a downloaded thread keep the permission until that copy is deleted under the retention rules in the privacy notice, which the code does not enforce yet.",
            "Post only what you wrote yourself, or what you have the right to post. Do not copy text from elsewhere without saying where it came from.",
            "A moderator may remove content and leave a placeholder. Registering means accepting that this can happen without your prior consent.",
          ],
        },
        {
          heading: "6. Prohibited content",
          bullets: [
            "Harassment, threats, intimidation, stalking, or organising other people against one person.",
            "Discrimination or slurs about nationality, ethnicity, religion, sex, disability, appearance, or family.",
            "Another person's real name, address, phone number, schedule, photograph, or account details without permission, or an attempt to identify someone posting under a pseudonym.",
            "Any sexual content, and any sexualisation of a minor in any form.",
            "Encouraging suicide, self-harm, or disordered eating, or describing how to do it.",
            "Illegal activity, weapons, drugs, or instructions for harming a person.",
            "Impersonating a teacher, a student, a club officer, a moderator, or the site.",
            "Exam questions or answers while an exam is running, or asking someone else to do your work.",
            "Advertising, referral links, scams, or repeated off-topic promotion.",
            "Malware, phishing, or content designed to break the site or someone's device.",
          ],
        },
        {
          heading: "7. Prohibited conduct",
          bullets: [
            "Sharing an account, or posting as someone else.",
            "Opening accounts to avoid a removal, a rate limit, or a suspension.",
            "Running bots or scripts that post, edit, or react without a person doing it.",
            "Copying the site's threads in bulk, or scraping it for use somewhere else.",
            "Probing, overloading, or attempting to break the site, another account, or the moderator console.",
            "Trying to get around the rate limits or the automatic word check.",
            "Reporting in bad faith to silence an opinion, or retaliating against someone who reported you.",
          ],
        },
        {
          heading: "8. Moderation and enforcement",
          bullets: [
            "Moderators may remove a post, lock a thread, remove a thread, and decide a report. Administrators may also archive or restore a board, change roles, and suspend a moderator.",
            "A moderator may suspend a student. Only an administrator may suspend a moderator. Nobody may suspend an administrator or their own account.",
            "Every action is written to the audit log with the account that took it. Removed content leaves a placeholder rather than disappearing.",
            "The moderation policy describes the order of steps and the response target. These terms leave the operators the discretion to act faster when safety requires it.",
            "The operators are not obliged to give a reason before acting. The reason is recorded in the audit log, and the appeal route in the moderation policy is how you question it.",
          ],
        },
        {
          heading: "9. Suspension and ending your access",
          bullets: [
            "Suspension is reversible. The account cannot sign in, its sessions are deleted, and the reason and the moment are recorded.",
            "The operators may suspend an account for a breach of these terms or of the community rules, to protect a person, or while a report is being investigated.",
            "You may ask for the decision to be reviewed through the appeal route in the moderation policy.",
            "The operators may close the site. It is run by students and depends on them, so it can end when the people running it graduate or step down.",
          ],
        },
        {
          heading: "10. Availability and changes to the service",
          bullets: [
            "The site is run by students. It can be unavailable during examinations, a server move, a holiday, or a change of maintainer.",
            "No uptime, durability, or future availability is promised. Data loss is possible, and the operators are not able to guarantee that a post will still be reachable next year.",
            "Features may be added, changed, or withdrawn. A change that affects your rights under these terms is handled under section 12.",
          ],
        },
        {
          heading: "11. Data and privacy",
          paragraphs: [
            "The privacy notice describes what is stored, why, who can read it, and how long it is kept. It is part of these terms.",
            "There is no analytics, no advertising, and no third-party tracker. Your content is not sold and is not used to build a profile of you for anyone else.",
          ],
        },
        {
          heading: "12. Changes to these terms",
          bullets: [
            "When these terms change, the date at the top changes with the text. The version stored with a registration is the version that account accepted.",
            "A change that affects what you may post, or how your content is used, is announced in the Site Feedback board before it takes effect, unless safety makes an announcement impossible.",
            "Continuing to use the site after a change accepts the new version. If you do not accept it, stop using the site and ask the maintainer to remove your content.",
          ],
        },
        {
          heading: "13. No warranty and limitation of liability",
          bullets: [
            "The site is provided as it is, without warranty of any kind, to the extent that the law allows.",
            "The operators are not liable for indirect or consequential loss, for lost content, or for an interruption of the service.",
            "Nothing in these terms excludes a right you have under Japanese law that cannot be waived, including any consumer right that applies to you.",
            "The site is not an emergency service, is not monitored around the clock, and is not an official communication channel of the school.",
          ],
        },
        {
          heading: "14. Law, severability, and contact",
          bullets: [
            "These terms follow Japanese law.",
            "If a part of these terms is found to be unenforceable, the rest still applies.",
            "These terms and the three documents they declare part of them are the whole agreement about using the site.",
            "Contact: the Site Feedback board, or the address on the project's repository page. If that does not settle the matter, ask the teacher advisor.",
          ],
        },
      ],
    },
  },
  ja: {
    rules: {
      title: "コミュニティルール",
      intro:
        "ここには何を書いてよいか、書くときにどう振る舞うかを定めます。このルールは利用規約の一部で、破られた場合はモデレーション方針に沿って扱います。登録時に一度読めば十分です。サイトから繰り返し表示することはありません。",
      updated: `最終更新: ${POLICY_UPDATES.rules}`,
      sections: [
        {
          heading: "1. このルールの読み方",
          paragraphs: [
            "以下のルールは、スレッド、返信、タイトル、タグ、ボード名、ボードの説明、ユーザー名のすべてに適用されます。画像もファイル添付もないサイトなので、対象は文章です。",
            "各条は、禁止する行為の種類を書いています。名前が挙がっていなくても同じ種類に明らかに入る行為は、同じように扱います。投稿してよいか迷ったら、投稿する前に「サイトへの意見」ボードで聞いてください。",
          ],
        },
        {
          heading: "2. 人を人として扱う",
          bullets: [
            "反論するのは意見に対してで、人に対してではありません。悪口、個人を狙ったからかい、相手を辱めるための皮肉は嫌がらせとみなします。",
            "脅し、威圧、つきまといは禁止です。スレッドの中でも、相手を追いかけて別のスレッドで続けるのも同じです。",
            "大勢で一人を囲む行為も禁止です。一つ一つの書き込みが穏やかでも、複数のアカウントで同じ相手を攻撃すれば嫌がらせになります。",
            "やめてほしいと言われたら、その相手への返信は止めてください。やり取りを続けたいときは、返信ではなく通報を使ってください。",
          ],
        },
        {
          heading: "3. 個人情報を守る",
          bullets: [
            "本人の許可なく、実名、住所、電話番号、メールアドレス、時間割、出席番号、写真、家族の情報、健康に関する情報、所属部活を投稿しないでください。",
            "偽名で書いている人の身元を推測したり、その推測を公開したりしないでください。偽名は、安心して質問できるようにするための仕組みです。",
            "私的なメッセージのスクリーンショットや転送、他人のアカウント情報の共有も禁止です。",
            "自分のユーザー名は公開されます。メールアドレスは任意で、他の利用者には表示されません。",
          ],
        },
        {
          heading: "4. 性的な内容、とくに未成年に関するものは禁止",
          paragraphs: [
            "性的な内容は、サイトのどこにも投稿できません。未成年を性的に扱う内容は、冗談やリンク、説明の形でも禁止です。",
            "見つけたらすぐ通報してください。通常の通報ではなく、緊急性のある案件として扱います。",
          ],
        },
        {
          heading: "5. 暴力・脅し・自傷の助長は禁止",
          bullets: [
            "武器の作り方や人を傷つける方法を書かないでください。暴力を肯定する内容も禁止です。",
            "自殺、自傷、摂食障害を勧めること、方法を書くことは禁止です。",
            "誰かのことが心配なときは、心配していると書き添えたうえで先生に伝えてください。このサイトは 24 時間の監視をしておらず、危険に気づく場所にはなれません。",
          ],
        },
        {
          heading: "6. 学習の公正さを守る",
          bullets: [
            "試験の実施中に、問題や解答を共有しないでください。",
            "先生、生徒、部活動の役員、モデレーター、サイトそのものになりすまさないでください。",
            "課題や勉強の進め方を聞くのはかまいませんが、他人に課題をやらせるのはやめてください。",
            "他人の説明や資料を使うときは、どこから取ったかを書いてください。",
          ],
        },
        {
          heading: "7. 宣伝・スパム・目的外利用の禁止",
          bullets: [
            "宣伝、紹介リンク、アフィリエイト、学校外の団体への勧誘は禁止です。",
            "行事や連絡のスレッドは 1 本で足ります。同じ内容を繰り返すために 2 本目を立てないでください。",
            "先頭に上げるためだけに何度も返信しないでください。返信は答えや補足のために使い、目立たせたいだけの返信はしないでください。",
            "ボード名、説明、タグにも投稿と同じルールが適用されます。",
          ],
        },
        {
          heading: "8. 違法・危険な行為の禁止",
          bullets: [
            "薬物、アルコール、たばこ、武器、年齢制限のある商品の販売や勧誘は禁止です。",
            "不法侵入、窃盗、詐欺、その他の違法行為のやり方を書かないでください。",
            "海賊版へのリンクや、それを配布するサイトへのリンクは禁止です。",
          ],
        },
        {
          heading: "9. サイトの使い方",
          bullets: [
            "内容に合ったボードに投稿し、話題を表すタグを付けてください。投稿画面にはボードごとのタグ候補が出ます。",
            "タイトルだけで何のスレッドか分かるように書いてください。「教えて」だけでは、後から探せません。",
            "日本語でも英語でもかまいません。次に読む人が追える書き方をしてください。",
            "引用は、返信したい部分だけにしてください。長い引用を積むとスレッドが読めなくなります。",
          ],
        },
        {
          heading: "10. ソフトウェアに対する禁止事項",
          bullets: [
            "自動で投稿・編集・リアクションするボットやスクリプトを動かさないでください。",
            "スレッドをまとめてコピーし、他所で使わないでください。",
            "サイト、他のアカウント、モデレーター用の画面を調べたり、負荷をかけたり、破ろうとしたりしないでください。",
            "削除や回数制限、利用停止を避けるためにアカウントを作り直さないでください。",
            "自動の語句チェックをすり抜けようとしないでください。",
          ],
        },
        {
          heading: "11. 通報は武器ではない",
          paragraphs: [
            "通報ボタンで送った内容は、モデレーターに届きます。通報された人に、誰が通報したかは伝わりません。",
            "気に入らない意見だからという理由で通報したり、順番を早めるために何度も通報したりしないでください。悪意のある通報もルール違反です。",
            "通報した人への報復、判断をしたモデレーターへの報復は禁止です。",
          ],
        },
        {
          heading: "12. ルールが破られたとき",
          bullets: [
            "モデレーターは投稿やスレッドを削除し、スレッドをロックし、通報を却下できます。削除した場所にはプレースホルダーが残り、操作は監査ログに記録されます。",
            "繰り返しや重大な違反は利用停止につながることがあります。停止されたアカウントはログインできず、そのセッションは削除されます。投稿は記録として残ります。",
            "脅し、つきまとい、個人情報の流出、差し迫った危険に関わる事案は、担当教員に伝え、必要なら学校に報告します。",
            "対応の順序、目標とする応答時間、異議申し立ての経路はモデレーション方針に書いています。",
          ],
        },
      ],
    },
    privacy: {
      title: "プライバシー通知",
      intro:
        "要点は三つです。掲示板を動かすのに必要な情報だけを保存し、公開するのはユーザー名だけ、アクセス解析・広告・外部の追跡は使いません。以下では項目ごとに、実際の動きと突き合わせられる形で書きます。",
      updated: `最終更新: ${POLICY_UPDATES.privacy}`,
      sections: [
        {
          heading: "1. この通知が扱う範囲",
          paragraphs: [
            "この通知では、このサイトが扱う個人情報について、何を保存し、なぜ保存し、誰が読め、いつまで残し、あなたが何を求められるのかを説明します。利用規約の一部です。",
            "このサイトの外で伝えた情報（先生、学校のシステム、他のウェブサイトなど）の扱いは対象外です。",
          ],
        },
        {
          heading: "2. 責任者",
          bullets: [
            "サイトは生徒の保守担当が運営しており、運用と修理のためにデータベースへ直接アクセスできます。",
            "担当教員は、安全上の懸念があるときに保守担当へ個別の記録を求めることができます。教職員全員がまとめて見られる仕組みや、教職員専用のアカウント区分はありません。",
            "データ保護責任者や運営企業はありません。この通知に関する連絡は、「サイトへの意見」ボードか、プロジェクトのリポジトリページに記載のアドレスへお願いします。",
          ],
        },
        {
          heading: "3. 保存する情報",
          bullets: [
            "アカウント：ユーザー名（公開）、任意のメールアドレス（他の利用者には表示しません）、scrypt で作ったパスワードのハッシュ、プロフィールに設定した色と自己紹介。",
            "登録時に 4 つの文書へ同意した日時と、文書ごとの版。同意の記録として保存します。",
            "投稿した内容：スレッド、返信、タイトル、タグ、いいね、保存、開いたボード。モデレーターが削除しない限り公開されます。",
            "既読の記録：スレッドごとの時刻。「新着」の表示に使い、時刻とスレッド ID だけを保存します。",
            "受信箱の時刻：通知パネルを最後に開いた時刻と、お知らせを最後に開いた時刻。一覧は他の行から計算し、保存するのは時刻だけです。",
            "通報した内容：理由、対象の投稿、人からの通報か自動の語句チェックによるものか。モデレーターは見られますが、通報された人に通報者は分かりません。",
            "モデレーションの記録：削除、ロック、通報の判断、利用停止、解除、役割の変更、ボードのアーカイブのたびに、実行したアカウント、操作、対象、時刻、任意の補足を監査ログに残します。",
            "拒否された書き込み：語句チェックが投稿を止めたとき、アカウント、投稿しようとしていた画面、一致した入力欄、一致した語、本文の先頭 200 文字、時刻を保存します。投稿そのものは作成しません。この一覧はモデレーターが確認でき、他の利用者には表示されません。",
            "セッション：トークンの SHA-256 ハッシュ、有効期限、作成時刻。トークンそのものは保存しません。",
            "回数制限の記録：一定の時間枠ごとに 1 行で、キー、回数、リセット時刻を持ちます。リバースプロキシの背後で動かしている場合はキーに接続元の IP アドレスが入り、プロキシがない場合はすべてのリクエストが 1 つのキーを共有します。期限が切れた行は削除され、最も長いウィンドウは 24 時間です。",
          ],
        },
        {
          heading: "4. 保存しない情報",
          bullets: [
            "本名、学年、クラス、誕生日、写真、出席番号、住所は求めませんし、保存しません。",
            "上に書いた回数制限のキーを除いて、IP アドレスは保存しません。",
            "アクセス解析、広告の識別子、外部の追跡スクリプト、SNS の埋め込みはありません。",
            "私的なメッセージ、ファイル添付、画像は扱いません。受け取るのは文章だけです。",
            "あなたの興味や行動を記録して、販売したり広告のために共有したりすることはありません。",
          ],
        },
        {
          heading: "5. 保存する理由",
          bullets: [
            "掲示板を動かすため：スレッドを表示し、どこまで読んだかを覚え、ログイン状態を保つ。",
            "安全を保つため：通報を受け取り、語句を人が確認できるように印を付け、モデレーターの操作を記録する。",
            "濫用を防ぐため：繰り返しの試行に回数制限をかけ、違反が繰り返された証拠を残す。",
            "同意があったことを示すため：登録時に保存する日時と、文書ごとの版。",
          ],
        },
        {
          heading: "6. Cookie",
          bullets: [
            "`toyooka_session` はログイン状態を保ちます。HttpOnly、SameSite=Lax、本番では Secure を付け、30 日で期限が切れます。ログアウトするとサーバー側のセッションは削除されます。",
            "`locale` は日本語と英語のどちらを選んだかを覚えます。1 年間有効で、個人を識別する情報は含みません。",
            "`theme` は二つのデザインのどちらを選んだかを覚えます。1 年間有効で、ページ側が設定し、個人を識別する情報は含みません。",
            "これ以外の Cookie はなく、外部へのリクエストもありません。Cookie を消すとログアウトされ、二つの選択も初期状態に戻ります。",
          ],
        },
        {
          heading: "7. 誰が読めるか",
          bullets: [
            "スレッドのアドレスを知っている人は、アカウントがなくても読めます。",
            "現在、検索エンジンにはサイトを登録しないようお願いしています。ただしこれはクローラーへのお願いであって鍵ではありません。リンクを共有すれば、受け取った人は誰でも開けます。",
            "モデレーターと管理者は、通報の一覧、自動フラグ、監査ログ、アカウントの状態を見られます。画面からメールアドレスを読むことはできません。",
            "保守担当は、運用や修理のためにデータベースを直接読むことができます。",
            "担当教員は、安全上の懸念があるときに、保守担当を通じて個別の記録を求められます。",
          ],
        },
        {
          heading: "8. 保存する期間",
          bullets: [
            "有効なスレッドと返信は、削除を依頼するかサイトを終えるまで残ります。",
            "削除した内容は論理削除です。判断を後から確認できるように本文はデータベースに残り、画面にはプレースホルダーが出ます。削除した本文をいつ消すかはまだ決まっておらず、コードでも自動化されていません。",
            "セッションは 30 日で期限が切れます。ログアウト、保守担当によるパスワード再設定、利用停止のいずれでも、そのアカウントのセッションは削除されます。",
            "回数制限の行は期限が切れると削除されます。最も長いウィンドウは 24 時間です。",
            "通報と監査の行は、安全と説明責任のために役立つ間は残します。",
            "バックアップは運営者が取得するファイルです。バックアップの中の複製は、運営者が定める周期でそのバックアップを消すまで残ります。この通知では、バックアップの保存期間までは約束できません。",
          ],
        },
        {
          heading: "9. 未成年の利用",
          paragraphs: [
            "利用者の多くは未成年で、サイトはそれを前提に作っています。ユーザー名は偽名でよく、メールアドレスは任意です。添付も私的メッセージもなく、広告も外部スクリプトもありません。",
            "18 歳未満の方は、先生か保護者が利用を知っている状態で使ってください。誰かが差し迫った危険にあると思うときは、先生、保護者、緊急窓口に連絡してください。このサイトは 24 時間の監視をしていません。",
          ],
        },
        {
          heading: "10. 本人の選択と権利",
          bullets: [
            "自分について保存されている情報の開示、内容の訂正、投稿の削除、アカウントの削除を求めることができます。",
            "同意を撤回するときは、保守担当にアカウントの削除を依頼してください。撤回すると、それ以降の取扱いは止まりますが、すでに行われた操作は取り消されません。監査ログや安全の記録として必要な行は残ることがあります。",
            "削除は現在手作業です。自分で消せるボタンはありません。保守担当は、そのアカウントから本人確認を求めることがあります。",
            "一部の依頼には制限が付きます。監査ログはモデレーションの判断を後から確認するためにあり、バックアップは、該当する複製が消えるまで保管を続ける必要があります。制限が付く場合は、保守担当が何をどこまでできるかを伝えます。",
            "回答に納得できない場合は、次に担当教員へ相談してください。",
          ],
        },
        {
          heading: "11. 安全対策と事故のとき",
          bullets: [
            "パスワードは scrypt でハッシュ化し、平文では保存も記録もしません。セッショントークンは乱数で、データベースに届くのは SHA-256 ハッシュだけです。",
            "何かを変更する画面はすべて、サーバー側でアカウントと役割を確認します。ボタンを隠すことは制御ではありません。",
            "本番は HTTPS での運用を前提としており、Cookie には Secure を付けます。",
            "漏えいが確認された場合、保守担当は担当教員と影響のあるアカウントに伝え、変更できるものは変更し、起きたことを記録します。24 時間体制ではないため、夜間に届いた報告への応答時間は約束できません。",
          ],
        },
        {
          heading: "12. 変更と連絡先",
          paragraphs: [
            "この通知を変更したときは、上部の日付が変わります。集める情報、読める人、保存する期間に関わる変更は、安全上急ぐ場合を除いて、効力が生じる前に「サイトへの意見」ボードで知らせます。",
            "質問や依頼は「サイトへの意見」ボード、またはプロジェクトのリポジトリページに記載のアドレスへお願いします。それでも解決しない場合は、担当教員に相談してください。",
          ],
        },
      ],
    },
    moderation: {
      title: "モデレーション方針",
      intro:
        "通報はすべて人が読みます。自動の語句照合には二つの働きがあります。遮断リストに当たった書き込みは投稿になる前に拒否し、それ以外で一致した語は人が読むための印としてキューに並べます。すでにある投稿を勝手に隠したり書き換えたり削除したりはしません。この方針では、誰が何をでき、何をできないのか、判断にどう異議を唱えられるのかを定めます。",
      updated: `最終更新: ${POLICY_UPDATES.moderation}`,
      sections: [
        {
          heading: "1. 適用範囲",
          paragraphs: [
            "この方針は、通報・アカウント・投稿・ボードを扱うモデレーター用の画面と、そこで行われた操作を記録する監査ログを対象にします。",
            "投稿、返信、スレッド、ボードの情報、ユーザー名に適用されます。画面の外での対応（担当教員や学校への連絡）は第 11 節に書いています。",
          ],
        },
        {
          heading: "2. 役割",
          bullets: [
            "生徒は投稿、返信、リアクション、通報、自分のボードの作成ができます。管理画面には入れません。",
            "モデレーターは通報と投稿を扱い、生徒のアカウントを停止できます。",
            "管理者はモデレーターのできることをすべて行え、さらにモデレーターの停止、役割の変更、ボードのアーカイブと復元ができます。",
            "管理画面は `/admin` です。以前の `/moderation` はここへリダイレクトするので、入口は一つだけです。",
          ],
        },
        {
          heading: "3. モデレーターができること",
          bullets: [
            "投稿を 1 件削除する。画面にはプレースホルダーが残り、本文は確認のためにデータベースに残ります。",
            "スレッドをロックして読めるまま返信を止める。またはスレッドごと削除する。",
            "通報を却下する、または投稿を削除したうえで解決済みにする。結末（削除・却下）と実行したアカウントが記録されます。",
            "理由を書いたうえで生徒のアカウントを停止し、あとから解除する。",
            "モデレーターへの通報は管理者が扱います。モデレーターは他のモデレーターを停止できないためです。",
          ],
        },
        {
          heading: "4. モデレーターができないこと",
          bullets: [
            "管理者の停止、自分の停止。他のモデレーターを停止できるのは管理者だけです。",
            "最後の 1 人である管理者の降格。画面が拒否します。アクセスを戻せる人がいなくなるためです。",
            "自分自身の役割の変更、および管理者でない場合の誰かの役割の変更。",
            "画面からメールアドレスを読むこと、議論に勝つために管理画面を使うこと、自分が関わっている通報を自分で処理すること。その通報は他の人に渡してください。",
            "自動フラグを結論として扱うこと。フラグはスレッドを読むきっかけにすぎません。",
          ],
        },
        {
          heading: "5. 通報の扱い",
          bullets: [
            "通報は 1 つのキューに入り、古い順に 1 ページ 10 件で表示されます。ベータ期間中の目標は 48 時間以内の初回対応です。",
            "同じ人が同じ投稿を繰り返し通報しても、未処理の項目は 1 つだけ残ります。キューが重複で埋まらないようにするためです。",
            "対応する前に、まわりのやり取りを読んでください。引用された一行だけを見ると、元のやり取りより強く見えることがあります。",
            "決めることは三つです。削除する、却下する、スレッドで経緯を聞く。決めたら記録します。",
            "通報された人に通報者は伝わりません。通報した人にも、キューの状態以上のことは伝わりません。",
          ],
        },
        {
          heading: "6. 自動フラグ",
          bullets: [
            "すべての書き込みを検査します。スレッドのタイトル、本文、タグ、返信、ボード名、ボードの説明、プロフィールの自己紹介が対象です。全角と半角は同じ語として扱います。日本語は空白や記号を取り除いてから照合するので、「死 ね」のように区切っても回避できません。英語は語の区切りを保つため、わざと区切ったつづりはすり抜けます。",
            "一覧は 2 層です。悪用するしかない短い語（直接の殺害予告、性暴力、子どもに関する性的内容、差別的な呼称）は投稿そのものを拒否します。投稿者には「この言葉は投稿できない」と伝え、本文は保存しません。",
            "もう一方の一覧は助言用です。投稿は受理し、同じキューに「自動検出」の印と一致した語を添えて記録します。曖昧な語や、CC BY 4.0 の `naughty-words` にある語のうち学校で正当に扱い得るものがここに入ります。",
            "つらさは違反ではありません。消えたい、自分を傷つけたいといった表現は拒否せず、キューに積みます。ソフトウェアが隠すのではなく、人が読んで声をかけられるようにするためです。",
            "拒否された書き込みは投稿になりませんが、試行は記録します。アカウント、どの画面から来たか、どの欄で一致したか、一致した語、本文の先頭 200 文字です。モデレーターは管理画面の「遮断」で確認できます。記録は処分ではなく合図です。何度も引っかかる生徒には、削除ではなく対話が必要です。",
            "却下したフラグは投稿に痕跡を残さず、投稿者にも不利益を与えません。",
          ],
        },
        {
          heading: "7. 対応の段階",
          bullets: [
            "多くの場合は削除か却下で終わります。スレッド自体は読めるまま残し、経緯を保ちます。",
            "同じスレッドでの繰り返しはロックの対象になります。会話を消さずに止めるためです。",
            "複数のスレッドにまたがる繰り返しや重大な違反は利用停止の対象になります。理由は記録され、アカウントとともに残ります。",
            "脅し、つきまとい、個人情報の流出、未成年に関する性的な内容、差し迫った危険は段階を飛ばして、担当教員や学校に伝えます。",
            "警告ポイントのような点数制度はありません。一貫性は、監査ログと、境界の事例を話し合うことで保ちます。",
          ],
        },
        {
          heading: "8. 利用停止と解除",
          bullets: [
            "停止されたアカウントはログインできず、持っていたセッションはすべて削除されます。投稿と返信は残るので、スレッドは文脈を失いません。",
            "停止した時刻と理由をアカウントに記録し、操作は監査ログにも残します。",
            "解除は停止の取り消しで、誰ができるかも同じルールです。解除すればログインできますが、以前のセッションは戻りません。",
            "管理者のアカウントを画面から停止することはできません。管理者のアクセスを外すのは役割の変更で、最後の管理者のルールに従います。",
          ],
        },
        {
          heading: "9. 異議申し立て",
          paragraphs: [
            "投稿の削除やアカウントの停止について、判断が違うと思ったときは、同じ内容を投稿し直さないでください。二つ目のアカウントも作らないでください。「サイトへの意見」ボードで尋ねるか保守担当に連絡し、スレッドのリンクかアカウント名を添えてください。",
            "可能な場合は別のモデレーターが判断を確認します。利用停止に対する申し立ては管理者が確認します。",
            "保守担当とモデレーターで解決しない場合は、担当教員が次の窓口です。",
          ],
        },
        {
          heading: "10. 監査と説明責任",
          bullets: [
            "削除、ロック、通報の判断、利用停止、解除、役割の変更、ボードのアーカイブは、実行者、操作、対象、時刻を 1 行として記録します。",
            "記録は追記のみです。監査の記録を編集・削除する画面はなく、誤った操作は履歴を書き換えずに新しい操作で訂正します。",
            "監査ログはモデレーターと管理者が読めます。48 時間という目標が守られたかを後から確認できるのも、この記録があるからです。",
          ],
        },
        {
          heading: "11. 緊急時とエスカレーション",
          bullets: [
            "このサイトは緊急連絡の手段ではなく、24 時間の監視もしていません。",
            "誰かが差し迫った危険にあるときは、まず先生、学校の事務室、保護者、緊急窓口に連絡し、そのあとで投稿を通報してください。",
            "重大な安全の案件は担当教員に伝え、必要なら学校に報告します。その対応は画面の外で行われ、公開される操作としては記録されません。",
          ],
        },
        {
          heading: "12. この方針の変更",
          paragraphs: [
            "この方針を変更したときは、上部の日付が変わります。",
            "モデレーターができること、または判断への異議の申し立て方に関わる変更は、安全上急ぐ場合を除いて、効力が生じる前に「サイトへの意見」ボードで知らせます。",
            "この方針は利用規約の一部です。ルール違反は両方の文書に沿って扱われます。",
          ],
        },
      ],
    },
    terms: {
      title: "利用規約",
      intro:
        "登録時に同意していただく規約です。アカウント、投稿できる内容、モデレーターが削除できるもの、あなたに残る権利、運営者が約束することとしないことを定めます。コミュニティルール、プライバシー通知、モデレーション方針は、この規約の一部です。",
      updated: `最終更新: ${POLICY_UPDATES.terms}`,
      sections: [
        {
          heading: "1. 定義",
          bullets: [
            "**本サイト**：このドメインと、そのページ、フォーム、ダウンロードできるファイル。",
            "**運営者**：生徒の保守担当と、管理画面で操作するモデレーターおよび管理者。",
            "**あなた**：アカウントを持つ人、またはアカウントなしで読む訪問者。",
            "**投稿内容**：スレッド、返信、タイトル、タグ、ユーザー名、ボード名、ボードの説明、プロフィールの項目。本サイトに添付機能はありません。",
            "**モデレーター**と**管理者**：他の人の投稿内容に操作できる二つの役割。管理者が上位で、違いはモデレーション方針に書いています。",
            "**本規約**：この文書と、この文書が一部と定める三つの文書。",
          ],
        },
        {
          heading: "2. 本規約への同意",
          bullets: [
            "登録画面のチェックボックスは、文書ごとに 1 つずつあります。本規約、コミュニティルール、プライバシー通知、モデレーション方針の 4 つです。判定はサーバー側で 4 つとも行うため、ブラウザの制御を回避したリクエストも拒否されます。",
            "同意は、日時と 4 つの文書それぞれの版として保存します。文書は個別に改訂されるので、あとから「何に同意したか」を確認できるようにするためです。",
            "この同意が必須になる前に作られたアカウントには、記録がありません。使い続けることは、現在の版に同意したものとして扱います。",
            "同意できない場合は登録しないでください。すでにアカウントがあり同意できない場合は、利用をやめ、保守担当に投稿内容の削除を依頼してください。",
          ],
        },
        {
          heading: "3. 利用できる人",
          bullets: [
            "対象は本校の生徒と教職員です。公開されているスレッドは、アカウントがなくても読めます。",
            "18 歳未満の方は、先生または保護者が利用を知っている状態で使ってください。",
            "登録は学校の所属で制限されていません。所属は利用の条件であって、入り口の鍵ではありません。登録の制限をどうするかは、学校側の未決事項です。",
            "アカウントは 1 人 1 つです。削除や回数制限、利用停止を避けるために別のアカウントを作ることは、本規約違反です。",
          ],
        },
        {
          heading: "4. アカウント",
          bullets: [
            "ユーザー名は自分で決め、公開されます。メールアドレスは任意で、他の利用者には表示されません。",
            "パスワードは自分で管理してください。ログイン中のアカウントによる操作は、すべてそのアカウントのものとして扱います。役割を持つ場合はモデレーション操作も含みます。",
            "メールによる再設定はありません。パスワードを忘れたら先生か保守担当に相談してください。再設定では新しいパスワードを一度だけ表示し、そのアカウントの全セッションをログアウトさせます。",
            "アカウントの削除は保守担当に依頼できます。現在は手作業で、自分で消せるボタンはありません。",
            "役割の変更は管理者が行います。モデレーターまたは管理者は、モデレーション方針に従ってアカウントを停止できます。停止されたアカウントはログインできず、セッションは削除されます。",
          ],
        },
        {
          heading: "5. 投稿した内容の権利",
          bullets: [
            "投稿した内容の著作権は、あなたに残ります。本規約は、その権利を学校、運営者、その他の誰かへ譲渡するものではありません。",
            "運営者には、投稿内容を保存・表示・バックアップ・書き出し・モデレーションする非独占的かつ無償の許諾を与えていただきます。目的は本サイトの運営だけで、販売、第三者への利用許諾、サイト外での公開は含みません。",
            "他の生徒に内容を見せる許可は、削除されたとき、またはアカウントが削除されたときに終わります。削除された項目はプレースホルダーとしてデータベースに残り、通報を扱うモデレーターは本文を読むことができます。バックアップ、監査記録、書き出したスレッドの中の複製は、プライバシー通知に書いた保存の決まりに従って削除されるまで続きます（その決まりはまだコードで自動化されていません）。",
            "自分で書いたもの、または投稿する権利があるものだけを投稿してください。他所から取った文章は、どこから取ったかを書いてください。",
            "モデレーターは投稿内容を削除し、その場所にプレースホルダーを残すことがあります。登録することは、事前の同意なしにそうなる場合があることを受け入れることでもあります。",
          ],
        },
        {
          heading: "6. 禁止される内容",
          bullets: [
            "嫌がらせ、脅し、威圧、つきまとい、大勢で一人を攻撃すること。",
            "国籍、民族、宗教、性別、障害、外見、家族に関する差別的な表現や中傷。",
            "本人の許可なく、実名、住所、電話番号、時間割、写真、アカウント情報を投稿すること。偽名の投稿者を特定しようとしたり、その推測を公開したりすること。",
            "性的な内容全般、および未成年を性的に扱う内容すべて。",
            "自殺、自傷、摂食障害を勧めること、またはその方法を書くこと。",
            "違法な行為、武器、薬物、人を傷つける方法の説明。",
            "先生、生徒、部活動の役員、モデレーター、本サイトになりすますこと。",
            "試験の実施中に問題や解答を共有すること、他人に課題をやらせること。",
            "宣伝、紹介リンク、詐欺、話題と関係のない勧誘の繰り返し。",
            "マルウェア、フィッシング、サイトや端末を壊す目的の内容。",
          ],
        },
        {
          heading: "7. 禁止される行為",
          bullets: [
            "アカウントを共有すること、他人になりすまして投稿すること。",
            "削除、回数制限、利用停止を避けるためにアカウントを作ること。",
            "人の操作なしに投稿・編集・リアクションするボットやスクリプトを動かすこと。",
            "スレッドをまとめてコピーすること、他所で使うために取得すること。",
            "本サイトや他のアカウント、モデレーター用の画面を調べたり、負荷をかけたり、破ろうとしたりすること。",
            "回数制限や自動の語句チェックを回避しようとすること。",
            "気に入らない意見を黙らせるための通報、通報した人への報復。",
          ],
        },
        {
          heading: "8. モデレーションと制裁",
          bullets: [
            "モデレーターは投稿の削除、スレッドのロック、スレッドの削除、通報の判断ができます。管理者はさらに、ボードのアーカイブと復元、役割の変更、モデレーターの停止ができます。",
            "モデレーターは生徒を停止できます。モデレーターを停止できるのは管理者だけです。管理者と自分自身は、誰も停止できません。",
            "操作はすべて、実行したアカウントとともに監査ログに記録されます。削除された内容は消えるのではなく、プレースホルダーが残ります。",
            "対応の順序と目標とする応答時間はモデレーション方針に書いています。安全のために必要と判断したときは、本規約は運営者がより早く動く裁量を認めます。",
            "運営者は、行動する前に理由を告げる義務を負いません。理由は監査ログに残り、それを問い直す経路はモデレーション方針の異議申し立てです。",
          ],
        },
        {
          heading: "9. 利用停止と利用の終了",
          bullets: [
            "利用停止は元に戻せます。ログインできなくなり、セッションは削除され、理由と時刻が記録されます。",
            "運営者は、本規約やコミュニティルールへの違反があったとき、誰かを守る必要があるとき、通報を調査しているときに、アカウントを停止できます。",
            "判断の見直しは、モデレーション方針の異議申し立ての経路で求められます。",
            "運営者はサイトを終了できます。生徒が運営しており、運営する人に依存するため、その人たちが卒業や退任をすれば続きません。",
          ],
        },
        {
          heading: "10. 提供状況と仕様の変更",
          bullets: [
            "本サイトは生徒が運営しています。試験期間、サーバーの移転、休暇、保守担当の交代のあいだは利用できないことがあります。",
            "稼働率、データの保全、将来の提供を約束するものではありません。データを失う可能性があり、投稿が来年も残っていることを保証できません。",
            "機能は追加、変更、終了することがあります。本規約上の権利に関わる変更は第 12 節に従います。",
          ],
        },
        {
          heading: "11. データとプライバシー",
          paragraphs: [
            "何を保存し、なぜ保存し、誰が読めて、いつまで残すかはプライバシー通知に書いています。その通知も本規約の一部です。",
            "アクセス解析、広告、外部の追跡はありません。投稿内容が販売されることも、誰かのためにあなたの傾向を分析する材料にされることもありません。",
          ],
        },
        {
          heading: "12. 本規約の変更",
          bullets: [
            "本規約を変更したときは、上部の日付も変わります。登録時に保存した版が、そのアカウントが同意した版です。",
            "投稿できる内容、または投稿内容の使われ方に関わる変更は、安全上知らせることができない場合を除いて、効力が生じる前に「サイトへの意見」ボードで知らせます。",
            "変更のあとも使い続ける場合は、新しい版に同意したものとみなします。同意できない場合は利用をやめ、保守担当に投稿内容の削除を依頼してください。",
          ],
        },
        {
          heading: "13. 保証の否認と責任の制限",
          bullets: [
            "本サイトは現状のまま提供され、法律が認める範囲でいかなる保証も伴いません。",
            "運営者は、間接的または結果的な損害、投稿内容の消失、サービスの中断について責任を負いません。",
            "本規約は、日本法の下で放棄できない権利を制限するものではありません。消費者として持つ権利が適用される場合も同様です。",
            "本サイトは緊急連絡の手段ではなく、24 時間の監視もなく、学校の公式な連絡手段でもありません。",
          ],
        },
        {
          heading: "14. 準拠法・可分性・連絡先",
          bullets: [
            "本規約は日本法に従います。",
            "本規約の一部が効力を持たないと判断された場合でも、残りの部分は適用されます。",
            "本規約と、本規約が一部と定める三つの文書が、本サイトの利用に関する合意のすべてです。",
            "連絡先は「サイトへの意見」ボード、またはプロジェクトのリポジトリページに記載のアドレスです。それでも解決しない場合は担当教員に相談してください。",
          ],
        },
      ],
    },
  },
};

export function policyFor(locale: Locale, key: PolicyKey): PolicyDocument {
  return POLICIES[locale][key];
}
