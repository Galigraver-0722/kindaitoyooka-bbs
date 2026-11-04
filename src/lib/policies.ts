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
  rules: "2026-11-04",
  privacy: "2026-11-04",
  moderation: "2026-11-04",
  terms: "2026-11-04",
};

/** The newest revision in the set; equal to the latest value in POLICY_UPDATES. */
export const POLICY_UPDATED = "2026-11-04";

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
            "This site has no private messaging. Do not bring a private exchange from outside the site (another service, email) into the site as a screenshot or forward without the other person's consent. Do not share someone's account details.",
            "Your own username is public. Your email address is optional and is never shown to other users.",
          ],
        },
        {
          heading: "4. No sexual content, and nothing sexual about minors",
          paragraphs: [
            "Sexual or titillating content, and any sexualisation of a minor, may not be posted anywhere on this site. Questions about biology or health classes, medical questions about sexual health, and academic discussion of literature or social phenomena may be posted for educational purposes only. Even for an educational purpose, sexualised depictions of minors, sexual images or descriptions, and obscene expression are prohibited. If you are unsure, ask a teacher or the maintainer before posting.",
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
            "You may discuss assignments, explain them to each other, teach each other, and review drafts together. Having someone else complete your assignment for you, and submitting someone else's work as your own, are prohibited.",
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
            "A good-faith report that turns out to be mistaken is never sanctioned. Thin or frequent reports may be noted and discussed with you, but are not normally sanctioned. Repeatedly reporting something you know to be false in order to harm someone is a breach of these rules.",
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
            "The site is run by three roles. One person may hold more than one of them.",
            "Project maintainer: software maintenance, server operation, direct database access, and backups. Does not decide removals or suspensions.",
            "Administrator: handles reports, removes posts, suspends accounts, and changes roles. Has no direct database access and takes no backups.",
            "Faculty contact (the teacher advisor): the channel for safety concerns, serious disputes, and coordination with the school. Does not handle the daily queue, holds no console permissions, and may request individual records. That role is the site's safety contact, not an unlimited background administrator.",
            "There is no data protection officer, and no company operates the site. For any request in this notice, contact the maintainer through the Site Feedback board or the address on the project's repository page.",
          ],
        },
        {
          heading: "3. What is stored",
          bullets: [
            "Your account: username (public), an optional email address (never shown to other users), a password hash made with scrypt, and the colours and bio you choose for your profile.",
            "The invite code you registered with: the first four characters and when you registered with it. Only a SHA-256 hash of the code is stored; the code itself is not.",
            "When you registered, the moment you accepted the four documents and the version of each one: terms, rules, privacy notice, moderation policy. This is the record that you consented.",
            "Your content: threads, replies, titles, tags, likes, bookmarks, and the boards you open. Public unless a moderator removes them.",
            "Read markers: a timestamp per thread, used for the New badge. They store a time and a thread id, nothing else.",
            "Two inbox timestamps: when you last opened the notification panel and when you last opened the announcements panel. The lists themselves are computed from other rows; only the moment is stored.",
            "Reports you file: the reason, the post, and whether the report came from a person or from the automatic word check. Moderators see the report; the reported person does not see who filed it.",
            "Moderation records: the audit log stores the account, the action, the target, the time, and an optional detail for every removal, lock, report decision, suspension, role change, and board archive.",
            "Refused writes: when the word check stops a post, the site stores your account, the page you were writing on, which field matched, the matched word, the first 40 characters of the text, and the time. The post itself is not created. The excerpt is deleted within 7 days. Moderators see this list; other readers do not.",
            "Sessions: a SHA-256 hash of the session token, its expiry, and when it was created. The token itself is never stored.",
            "Rate-limit rows: one row per time window, holding a key, a count, and a reset time. When the deployment runs behind a reverse proxy, the key includes the client IP address; without a proxy, every request shares a single key. Expired rows are deleted, and the longest window is 24 hours.",
          ],
        },
        {
          heading: "4. What is not stored",
          bullets: [
            "No real name, grade, class, birthday, photograph, student number, or address is required or requested.",
            "The application stores an IP address only inside a rate-limit key, and only when the deployment runs behind a reverse proxy. Those rows expire within 24 hours. No IP address is stored with posts, accounts, reports, or audit entries. The server keeps no access log, and the application writes no IP address to its own output. A backup can contain the rate-limit rows for the 30-day backup window. Network logs kept by the hosting provider follow that provider's terms.",
            "The site loads no external fonts, CDN assets, analytics, advertising, images, or JavaScript: everything needed to render a page comes from the site's own server. Hosting-provider traffic at the network layer follows that provider's terms.",
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
            "There are no other cookies. Clearing cookies signs you out and resets both choices.",
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
            "Retention is set per data type. Sessions expire after 30 days; signing out, a reset by the maintainer, and a suspension all delete the account's sessions.",
            "Rate-limit rows are deleted when their window expires; the longest window is 24 hours.",
            "Refused-write excerpts are deleted within 7 days.",
            "Reports are kept for 1 year, and audit rows for 3 years, as the period needed to review a decision.",
            "The body of a deleted post stays in the database so that a decision can be reviewed, and is erased 90 days after deletion; the page keeps only the placeholder.",
            "Active threads and replies stay until you ask for removal or the site is retired.",
            "Deleting an account does not delete its posts: they stay public and the author is shown as a deleted user. You may ask for individual posts to be removed.",
            "Backups are files taken by the operator and rotated after 30 days. A copy of your content inside a backup remains until that backup is deleted. Hosting-provider copies follow the provider's terms.",
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
            "The list has two layers. A short blocklist refuses the post outright: terms whose only ordinary use is abusive, such as a direct death threat, sexual violence, sexual content involving minors, or a slur. The author is told the wording cannot be posted, and no post is created. The first 40 characters are kept for the moderator record and are deleted within 7 days, as the privacy notice describes.",
            "A longer list is advisory. It accepts the post and files an automatic entry in the same queue, labelled Auto-detected with the matched terms. Ambiguous words belong here, along with vocabulary from the CC BY 4.0 `naughty-words` lists that a school may legitimately discuss.",
            "Distress is not a violation. Phrases about wanting to disappear or to hurt oneself are queued, never refused, so that a person reads them and can reach out instead of the software hiding them.",
            "A refused write leaves no post, but the attempt is recorded: the account, the surface it came from, which field matched, the matched word, and the first 40 characters of the text, deleted within 7 days. Moderators see this under Blocked in the console. The record is a signal, not a penalty; a student who keeps hitting it needs a conversation, not a removal.",
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
            "The site is for students and staff of the school. Guests may read public threads without an account.",
            "If you are under 18, use the site with the knowledge of a teacher or your guardian.",
            "Registration requires the current invite code, issued by a teacher or the maintainer. One code is active at a time and the same code can be used by any number of accounts; each account records which code it used. The site cannot check school membership, so eligibility rests on what each person states; a false statement is a breach of these terms.",
            "One account per person. Opening another account to get around a removal, a limit, or a suspension is a breach of these terms.",
          ],
        },
        {
          heading: "4. Your account",
          bullets: [
            "You choose a username, which is public, and optionally an email address, which is never shown to other users.",
            "You are responsible for your password. Every action taken while your account is signed in is attributed to it, including moderation actions if you hold a role.",
            "There is no email reset. If you lose the password, ask a teacher or the maintainer; a reset prints a new password once and signs out every session on the account.",
            "You may ask the maintainer to delete your account. Deletion is done by hand today; there is no self-service button. Your posts stay public under the next clause, and the author is shown as a deleted user.",
            "An administrator may change your role. A moderator or administrator may suspend the account under the moderation policy; a suspended account cannot sign in and its sessions are deleted.",
          ],
        },
        {
          heading: "5. Your content stays yours",
          bullets: [
            "You keep the copyright in what you post. These terms do not transfer it to the school, to the operators, or to anyone else.",
            "You grant the operators a non-exclusive, royalty-free permission to store, display, back up, export, and moderate your content. The permission exists to operate this site and covers nothing else: it does not allow selling your writing, licensing it to a third party, or publishing it outside this site.",
            "The permission to show your content to other students continues until that content is deleted. If you delete your account, your posts stay public and the author is shown as a deleted user. You may ask for individual posts to be removed. A removed item keeps its body in the database, and a moderator handling a report can still read it. Copies inside a backup, an audit record, or a downloaded thread keep the permission until that copy is deleted under the retention rules in the privacy notice.",
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
            "Sexual or titillating content, and any sexualisation of a minor in any form. Questions about biology or health classes, medical questions about sexual health, and academic discussion of literature or social phenomena are allowed for educational purposes only; sexualised depictions of minors, sexual images or descriptions, and obscene expression remain prohibited.",
            "Encouraging suicide, self-harm, or disordered eating, or describing how to do it.",
            "Illegal activity, weapons, drugs, or instructions for harming a person.",
            "Impersonating a teacher, a student, a club officer, a moderator, or the site.",
            "Exam questions or answers while an exam is running, or having someone else complete your assignment and submitting it, or submitting someone else's work as your own.",
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
        "本ルールは、本サイトに何を投稿し、いかなる態度で利用するかを定めるものです。利用規約の一部を構成し、違反があった場合はモデレーション方針に従って対応します。登録時に一度お読みいただければ十分であり、その後サイト上で繰り返し表示することはありません。",
      updated: `最終更新: ${POLICY_UPDATES.rules}`,
      sections: [
        {
          heading: "1. このルールの読み方",
          paragraphs: [
            "以下の各条は、スレッド、返信、タイトル、タグ、ボード名、ボードの説明、ユーザー名のすべてに適用されます。本サイトは画像もファイル添付も扱わないため、対象は文章です。",
            "各条は、禁止する行為の類型を示したものです。名称が挙がっていない場合でも、同一の類型に明らかに属する行為は同様に扱います。投稿の可否に迷った場合は、投稿する前に「サイトへの意見」ボードでお尋ねください。",
          ],
        },
        {
          heading: "2. 人を人として扱う",
          bullets: [
            "反論の対象は意見であり、人ではありません。悪口、個人を狙ったからかい、相手を辱める目的の皮肉は、嫌がらせとみなします。",
            "脅し、威圧、つきまといは禁止です。スレッド内で行うものと、相手を追って別のスレッドで続けるもののいずれも同様です。",
            "大勢で一人を取り囲む行為も禁止です。個々の書き込みが穏やかであっても、複数のアカウントで同一の相手を攻撃する行為は嫌がらせに当たります。",
            "相手から中止を求められた場合は、その相手への返信を控えてください。やり取りの継続を希望する場合は、返信ではなく通報をご利用ください。",
          ],
        },
        {
          heading: "3. 個人情報を守る",
          bullets: [
            "本人の許可なく、実名、住所、電話番号、メールアドレス、時間割、出席番号、写真、家族に関する情報、健康に関する情報、所属部活動を投稿してはなりません。",
            "偽名で投稿する者の身元を推測し、またはその推測を公開してはなりません。偽名は、安心して質問を行うための仕組みです。",
            "本サイトには私的なメッセージ機能がありません。他のサービスやメールなど、本サイト外で交わされた私的なやり取りを、相手の同意なくスクリーンショットや転送によって本サイトへ持ち込んではなりません。他人のアカウント情報の共有も同様に禁止します。",
            "自身のユーザー名は公開されます。メールアドレスは任意であり、他の利用者に表示されることはありません。",
          ],
        },
        {
          heading: "4. 性的な内容、とくに未成年に関するものは禁止",
          paragraphs: [
            "性的・扇情的な内容、および未成年者を性的に扱う内容は、本サイトのいずれの場所にも投稿できません。他方、生物や保健の授業に関する質問、医学的な性の健康に関する相談、文学や社会現象についての学術的な議論は、教育・学習の目的に限り投稿できます。教育目的であっても、未成年者を性的に扱う内容、性的な画像や描写、わいせつな表現は禁止します。判断に迷う場合は、投稿する前に教員または保守担当にご相談ください。",
            "発見した場合は直ちに通報してください。通常の通報とは区別し、緊急性の高い案件として扱います。",
          ],
        },
        {
          heading: "5. 暴力・脅し・自傷の助長は禁止",
          bullets: [
            "武器の製造方法や人を傷つける方法を記載してはなりません。暴力を肯定する内容も禁止します。",
            "自殺、自傷、摂食障害を勧める行為、およびその方法の記載は禁止します。",
            "知人の安否に懸念がある場合は、その旨を明記したうえで教員に伝えてください。本サイトは 24 時間の監視を行っておらず、危険を察知する場にはなり得ません。",
          ],
        },
        {
          heading: "6. 学習の公正さを守る",
          bullets: [
            "試験の実施中に、問題や解答を共有してはなりません。",
            "教員、生徒、部活動の役員、モデレーター、または本サイトになりすましてはなりません。",
            "課題について相談し、互いに説明し、教え合い、下書きを添削し合うことは認められます。他者に自分の課題を完成させて提出すること、および他者の成果を自分のものとして提出することは禁止します。",
            "他者の説明や資料を利用する場合は、出典を明記してください。",
          ],
        },
        {
          heading: "7. 宣伝・スパム・目的外利用の禁止",
          bullets: [
            "宣伝、紹介リンク、アフィリエイト、学校外の団体への勧誘は禁止します。",
            "行事や連絡のスレッドは 1 件で足ります。同一内容を繰り返すために 2 件目を作成してはなりません。",
            "上位表示のみを目的として繰り返し返信してはなりません。返信は回答や補足のために用いるものとし、可視性のみを目的とする返信は行わないでください。",
            "ボード名、説明、タグにも、投稿と同一のルールを適用します。",
          ],
        },
        {
          heading: "8. 違法・危険な行為の禁止",
          bullets: [
            "薬物、アルコール、たばこ、武器、年齢制限のある商品の販売および勧誘は禁止します。",
            "不法侵入、窃盗、詐欺、その他の違法行為の方法を記載してはなりません。",
            "海賊版へのリンク、およびこれを配布するサイトへのリンクは禁止します。",
          ],
        },
        {
          heading: "9. サイトの使い方",
          bullets: [
            "内容に適合するボードへ投稿し、話題を示すタグを付けてください。投稿画面にはボードごとのタグ候補が表示されます。",
            "タイトルのみでスレッドの内容が分かるように記載してください。「教えて」のみでは、後から検索できません。",
            "日本語・英語のいずれも使用できます。次の読者が理解できる表現で記載してください。",
            "引用は、返信対象の部分に限定してください。長い引用を重ねると、スレッドが読みにくくなります。",
          ],
        },
        {
          heading: "10. ソフトウェアに対する禁止事項",
          bullets: [
            "自動で投稿、編集、リアクションを行うボットやスクリプトを動作させてはなりません。",
            "スレッドを一括で複製し、他の場所で使用してはなりません。",
            "本サイト、他のアカウント、モデレーター用の画面を調査し、負荷をかけ、または破壊しようとしてはなりません。",
            "削除、回数制限、利用停止を回避するためにアカウントを作り直してはなりません。",
            "自動の語句チェックを回避しようとしてはなりません。",
          ],
        },
        {
          heading: "11. 通報は武器ではない",
          paragraphs: [
            "通報ボタンから送信された内容は、モデレーターに届きます。通報された者に、通報者が誰であるかは伝わりません。",
            "善意で行った通報が判断と異なっていても、処分の対象にはなりません。根拠が薄い通報や回数の多い通報は、記録のうえで声をかけることがありますが、原則として処分しません。内容が虚偽であると知りながら、相手を傷つける目的で通報を繰り返す行為は、ルール違反として扱います。",
            "通報者に対する報復、および判断を行ったモデレーターに対する報復は禁止します。",
          ],
        },
        {
          heading: "12. ルールが破られたとき",
          bullets: [
            "モデレーターは、投稿またはスレッドの削除、スレッドのロック、通報の却下を行うことができます。削除された箇所にはプレースホルダーが残り、操作は監査ログに記録されます。",
            "繰り返しまたは重大な違反は、利用停止につながる場合があります。停止されたアカウントはログインできず、保持していたセッションはすべて削除されます。投稿は記録として残ります。",
            "脅し、つきまとい、個人情報の流出、差し迫った危険に関わる事案は、担当教員へ、必要に応じて学校へ報告します。",
            "対応の順序、目標とする応答時間、異議申し立ての経路は、モデレーション方針に定めています。",
          ],
        },
      ],
    },
    privacy: {
      title: "プライバシー通知",
      intro:
        "要点は次の三つです。本サイトは、掲示板の運営に必要な情報のみを保存し、公開するのはユーザー名に限り、アクセス解析、広告、外部の追跡は行いません。以下では、項目ごとに実際の取扱いと照合できる形で記載します。",
      updated: `最終更新: ${POLICY_UPDATES.privacy}`,
      sections: [
        {
          heading: "1. この通知が扱う範囲",
          paragraphs: [
            "本通知は、本サイトが取り扱う個人情報について、保存する情報、保存の目的、閲覧可能な者、保存期間、および利用者が求め得る事項を説明するものです。利用規約の一部を構成します。",
            "教員、学校のシステム、他のウェブサイトなど、本サイト外で伝達した情報の取扱いは対象外です。",
          ],
        },
        {
          heading: "2. 責任者",
          bullets: [
            "本サイトは次の三つの役割で運営しており、同一の人物が複数の役割を兼ねる場合があります。",
            "プロジェクト維持担当：ソフトウェアの保守、サーバーの運用、データベースへの直接アクセス、バックアップの取得を行います。投稿内容の削除や利用停止の判断は行いません。",
            "管理者：通報の処理、投稿の削除、利用停止、役割の変更を行います。データベースへの直接アクセスとバックアップの取得は行いません。",
            "担当教員（安全上の連絡窓口）：安全上の懸念、重大な紛争、学校との調整の窓口です。日常の通報処理は行わず、管理画面の権限も持ちません。個別の記録の開示を求めることができます。",
            "データ保護責任者および運営企業は存在しません。本通知に関する連絡は、「サイトへの意見」ボードまたはプロジェクトのリポジトリページに記載のアドレスまでお願いします。",
          ],
        },
        {
          heading: "3. 保存する情報",
          bullets: [
            "アカウント：ユーザー名（公開）、任意のメールアドレス（他の利用者には表示しません）、scrypt により生成したパスワードハッシュ、プロフィールに設定した色および自己紹介。",
            "登録に使用した招待コード：コードの先頭 4 文字と、そのコードで登録した日時。コード自体は SHA-256 ハッシュのみを保存し、平文は保存しません。",
            "登録時に 4 つの文書へ同意した日時、および文書ごとの版。同意の記録として保存します。",
            "投稿した内容：スレッド、返信、タイトル、タグ、いいね、保存、開いたボード。モデレーターが削除しない限り公開されます。",
            "既読の記録：スレッドごとの時刻。「新着」の表示に使用し、時刻とスレッド ID のみを保存します。",
            "受信箱の時刻：通知パネルおよびお知らせを最後に開いた時刻。一覧は他の記録から算出し、保存するのは時刻のみです。",
            "通報した内容：理由、対象の投稿、人による通報か自動の語句チェックによるものかの区分。モデレーターは閲覧できますが、通報された者に通報者は伝わりません。",
            "モデレーションの記録：削除、ロック、通報の判断、利用停止、解除、役割の変更、ボードのアーカイブの都度、実行したアカウント、操作、対象、時刻、任意の補足を監査ログに記録します。",
            "拒否された書き込み：語句チェックが投稿を拒否した場合、アカウント、投稿しようとした画面、一致した入力欄、一致した語、本文の先頭 40 文字、時刻を保存します。投稿自体は作成しません。本文の抜粋は 7 日以内に削除します。この一覧はモデレーターが確認でき、他の利用者には表示されません。",
            "セッション：トークンの SHA-256 ハッシュ、有効期限、作成時刻。トークン自体は保存しません。",
            "回数制限の記録：一定の時間枠ごとに 1 行、キー、回数、リセット時刻を保持します。リバースプロキシの背後で運用する場合、キーには接続元の IP アドレスが含まれ、プロキシがない場合はすべてのリクエストが単一のキーを共有します。期限切れの行は削除され、最長の時間枠は 24 時間です。",
          ],
        },
        {
          heading: "4. 保存しない情報",
          bullets: [
            "本名、学年、クラス、生年月日、写真、出席番号、住所は求めず、保存しません。",
            "アプリケーションがデータベースに保存する IP アドレスは、回数制限のキーに含まれるものに限られます。この保存はリバースプロキシの背後で運用する場合に限られ、保持期間は最長 24 時間です。投稿、アカウント、通報、監査ログに IP アドレスを保存することはありません。サーバーのアクセスログは取得しておらず、アプリケーションの出力にも IP アドレスは含まれません。バックアップには回数制限の記録が含まれるため、バックアップの保存期間（30 日）中は、その複製に IP アドレスが残る場合があります。ホスティング事業者が保持するネットワークログについては、同事業者の定めに従います。",
            "アクセス解析、広告識別子、外部の追跡スクリプト、SNS の埋め込みはありません。",
            "私的なメッセージ、ファイル添付、画像は取り扱いません。受け取るのは文章のみです。",
            "興味や行動の記録を作成、販売、または広告目的で共有することはありません。",
          ],
        },
        {
          heading: "5. 保存する理由",
          bullets: [
            "掲示板の運営：スレッドの表示、既読位置の記憶、ログイン状態の維持。",
            "安全の確保：通報の受付、人による確認のための印付け、モデレーターの操作の記録。",
            "濫用の防止：繰り返しの試行に対する回数制限、違反が繰り返された場合の証拠の保全。",
            "同意の証明：登録時に保存する日時および文書ごとの版。",
          ],
        },
        {
          heading: "6. Cookie",
          bullets: [
            "`toyooka_session` はログイン状態を維持します。HttpOnly、SameSite=Lax、本番環境では Secure を付与し、30 日で有効期限が切れます。ログアウトするとサーバー側のセッションは削除されます。",
            "`locale` は日本語と英語のいずれを選択したかを記憶します。有効期間は 1 年で、個人を識別する情報は含みません。",
            "`theme` は 2 つのデザインのいずれを選択したかを記憶します。有効期間は 1 年で、ページ側が設定し、個人を識別する情報は含みません。",
            "上記以外の Cookie はありません。本サイトは、外部のフォント、CDN、アクセス解析、広告、外部画像、外部 JavaScript を読み込みません。ページの表示に必要な資源は、すべて本サイトのサーバーから配信されます。Cookie を削除するとログアウトされ、2 つの選択も初期状態に戻ります。",
          ],
        },
        {
          heading: "7. 誰が読めるか",
          bullets: [
            "スレッドのアドレスを知る者は、アカウントがなくても閲覧できます。",
            "現在、検索エンジンにはサイトを登録しないよう求めています。ただしこれはクローラーに対する依頼であり、鍵ではありません。リンクを共有した場合、受け取った者は誰でも開くことができます。",
            "モデレーターおよび管理者は、通報の一覧、自動フラグ、監査ログ、アカウントの状態を閲覧できます。画面からメールアドレスを読むことはできません。",
            "保守担当は、運用および修理のためにデータベースを直接閲覧できます。",
            "担当教員は、安全上の懸念がある場合、保守担当を通じて個別の記録を求めることができます。",
          ],
        },
        {
          heading: "8. 保存する期間",
          bullets: [
            "保存期間はデータの種類ごとに定めています。セッションは 30 日で有効期限が切れ、ログアウト、保守担当によるパスワード再設定、利用停止のいずれの場合も、当該アカウントのセッションは削除されます。",
            "回数制限の記録は、期限が切れると削除されます。最長の時間枠は 24 時間です。",
            "拒否された書き込みの抜粋は、7 日以内に削除します。",
            "通報の記録は 1 年、監査ログは 3 年を目安に保存します。いずれも判断を後から確認するために必要な期間です。",
            "削除された投稿の本文は、判断を確認できるようデータベースに残し、削除から 90 日後に消去します。画面にはプレースホルダーのみが残ります。",
            "有効なスレッドおよび返信は、削除を依頼するか、サイトを終了するまで保存されます。",
            "アカウントを削除しても投稿内容は削除されず、公開されたまま残ります。作成者の表示は「削除済み利用者」に置き換わります。個別の投稿内容の削除を求めることはできます。",
            "バックアップは運営者が取得するファイルで、30 日で入れ替わります。バックアップ内の複製は、当該バックアップが削除されるまで残ります。ホスティング事業者が保持する複製については、同事業者の定めに従います。",
          ],
        },
        {
          heading: "9. 未成年の利用",
          paragraphs: [
            "利用者の多くは未成年者であり、本サイトはそれを前提に設計しています。ユーザー名は偽名を使用でき、メールアドレスは任意です。添付、私的なメッセージ、広告、外部スクリプトはありません。",
            "18 歳未満の方は、教員または保護者が利用を認識している状態でご利用ください。誰かが差し迫った危険にあると判断した場合は、教員、保護者、または緊急窓口に連絡してください。本サイトは 24 時間の監視を行っていません。",
          ],
        },
        {
          heading: "10. 本人の選択と権利",
          bullets: [
            "自身について保存されている情報の開示、内容の訂正、投稿の削除、アカウントの削除を求めることができます。",
            "同意を撤回する場合は、保守担当にアカウントの削除を依頼してください。撤回により以後の取扱いは停止しますが、すでに行われた操作は取り消されません。監査ログまたは安全の記録として必要な行は残る場合があります。",
            "削除は現在手作業で行っています。利用者自身が削除できるボタンはありません。保守担当は、当該アカウントからの本人確認を求める場合があります。",
            "一部の依頼には制限が生じます。監査ログはモデレーションの判断を後から確認するために存在し、バックアップは該当する複製が消えるまで保管を継続する必要があります。制限が生じる場合は、保守担当が対応可能な範囲を説明します。",
            "回答に納得できない場合は、担当教員にご相談ください。",
          ],
        },
        {
          heading: "11. 安全対策と事故のとき",
          bullets: [
            "パスワードは scrypt によりハッシュ化し、平文での保存および記録は行いません。セッショントークンは乱数であり、データベースに保存されるのは SHA-256 ハッシュのみです。",
            "変更を伴う画面は、すべてサーバー側でアカウントおよび役割を確認します。画面上の表示は制御ではありません。",
            "本番環境は HTTPS による運用を前提とし、Cookie には Secure を付与します。",
            "漏えいが確認された場合、保守担当は担当教員および影響を受けるアカウントに連絡し、変更可能なものは変更し、経緯を記録します。夜間に届いた報告への応答時間を約束できる 24 時間体制はありません。",
          ],
        },
        {
          heading: "12. 変更と連絡先",
          paragraphs: [
            "本通知を変更した場合は、上部の日付を更新します。収集する情報、閲覧可能な者、保存期間に関わる変更は、安全上の理由で急を要する場合を除き、効力発生前に「サイトへの意見」ボードでお知らせします。",
            "質問および依頼は、「サイトへの意見」ボード、またはプロジェクトのリポジトリページに記載のアドレスまでお願いします。解決しない場合は、担当教員にご相談ください。",
          ],
        },
      ],
    },
    moderation: {
      title: "モデレーション方針",
      intro:
        "通報はすべて人が確認します。自動の語句照合には二つの機能があります。遮断リストに一致した書き込みは投稿となる前に拒否し、それ以外で一致した語は、人が確認するための印としてキューに登録します。既存の投稿を自動的に非表示、改変、削除することはありません。本方針は、誰が何を行い得るか、何を行い得ないか、判断に対する異議の申し立て方法を定めます。",
      updated: `最終更新: ${POLICY_UPDATES.moderation}`,
      sections: [
        {
          heading: "1. 適用範囲",
          paragraphs: [
            "本方針は、通報、アカウント、投稿、ボードを取り扱うモデレーター用の画面、およびそこで行われた操作を記録する監査ログを対象とします。",
            "投稿、返信、スレッド、ボードの情報、ユーザー名に適用されます。画面外での対応（担当教員または学校への連絡）は第 11 節に定めています。",
          ],
        },
        {
          heading: "2. 役割",
          bullets: [
            "生徒は、投稿、返信、リアクション、通報、自身のボードの作成が認められています。管理画面にはアクセスできません。",
            "モデレーターは通報および投稿を取り扱い、生徒のアカウントを停止することができます。",
            "管理者はモデレーターの権限をすべて有し、加えてモデレーターの停止、役割の変更、ボードのアーカイブおよび復元を行うことができます。",
            "管理画面は `/admin` です。旧 `/moderation` はここへリダイレクトされるため、入口は一つです。",
          ],
        },
        {
          heading: "3. モデレーターができること",
          bullets: [
            "投稿を 1 件削除する。画面にはプレースホルダーが残り、本文は確認のためにデータベースに残ります。",
            "スレッドをロックし、閲覧可能なまま返信を停止する。またはスレッドごと削除する。",
            "通報を却下する。または投稿を削除したうえで解決済みとする。結末（削除・却下）および実行したアカウントを記録します。",
            "理由を記載したうえで生徒のアカウントを停止し、後日解除する。",
            "モデレーターに対する通報は管理者が取り扱います。モデレーターは他のモデレーターを停止できないためです。",
          ],
        },
        {
          heading: "4. モデレーターができないこと",
          bullets: [
            "管理者の停止、および自身の停止。他のモデレーターを停止できるのは管理者に限ります。",
            "最後の 1 名である管理者の降格。画面がこれを拒否します。アクセスを回復できる者がいなくなるためです。",
            "自身の役割の変更、および管理者でない場合における他者の役割の変更。",
            "画面からメールアドレスを閲覧すること、議論に勝つために管理画面を使用すること、自身が関与する通報を自ら処理すること。当該通報は他の担当者に引き継いでください。",
            "自動フラグを結論として扱うこと。フラグはスレッドを確認する契機にすぎません。",
          ],
        },
        {
          heading: "5. 通報の扱い",
          bullets: [
            "通報は 1 つのキューに登録され、古い順に 1 ページ 10 件で表示されます。ベータ期間中の目標は、48 時間以内の初回対応です。",
            "同一の者が同一の投稿について繰り返し通報した場合も、未処理の項目は 1 件のみ残ります。キューが重複で埋まることを防ぐためです。",
            "対応の前に、周囲のやり取りを確認してください。引用された一行のみを確認すると、元のやり取りより強く見える場合があります。",
            "判断は、削除、却下、スレッドでの経緯確認の三つです。判断後は記録します。",
            "通報された者に通報者は伝わりません。通報者にも、対応の結果は伝わりません。",
          ],
        },
        {
          heading: "6. 自動フラグ",
          bullets: [
            "すべての書き込みを検査します。スレッドのタイトル、本文、タグ、返信、ボード名、ボードの説明、プロフィールの自己紹介が対象です。全角と半角は同一の語として扱います。日本語は空白および記号を除去したうえで照合するため、「死 ね」のように区切っても回避できません。英語は語の区切りを保持するため、意図的に区切った表記は検出を免れます。",
            "一覧は 2 層です。悪用以外の用途がない短い語（直接の殺害予告、性暴力、児童に関する性的内容、差別的な呼称）は、投稿自体を拒否します。投稿者には「この言葉は投稿できない」と伝えます。投稿自体は作成しませんが、確認のために本文の先頭 40 文字のみを別途記録し、7 日以内に削除します（プライバシー通知に記載）。",
            "もう一方の一覧は助言用です。投稿は受理し、同一のキューに「自動検出」の表示と一致した語を付して記録します。曖昧な語、および CC BY 4.0 の `naughty-words` に含まれる語のうち、学校で正当に扱い得るものがここに該当します。",
            "苦痛は違反ではありません。消えたい、自分を傷つけたいといった表現は拒否せず、キューに登録します。ソフトウェアが隠すのではなく、人が読んで声をかけることを可能にするためです。",
            "拒否された書き込みは投稿になりませんが、試行は記録します。アカウント、投稿しようとした画面、一致した入力欄、一致した語、本文の先頭 40 文字で、7 日以内に削除します。モデレーターは管理画面の「遮断」で確認できます。記録は処分ではなく合図です。繰り返し該当する生徒には、削除ではなく対話が必要です。",
            "却下したフラグは投稿に痕跡を残さず、投稿者にも不利益を与えません。",
          ],
        },
        {
          heading: "7. 対応の段階",
          bullets: [
            "多くの場合は削除または却下で終了します。スレッド自体は閲覧可能なまま残し、経緯を保ちます。",
            "同一スレッド内での繰り返しは、ロックの対象となります。会話を削除せずに停止するためです。",
            "複数のスレッドにわたる繰り返し、または重大な違反は、利用停止の対象となります。理由は記録され、アカウントとともに残ります。",
            "脅し、つきまとい、個人情報の流出、未成年者に関する性的内容、差し迫った危険は、段階を経ずに担当教員または学校へ伝えます。",
            "警告ポイントのような点数制度はありません。一貫性は、監査ログと境界事例の協議によって保ちます。",
          ],
        },
        {
          heading: "8. 利用停止と解除",
          bullets: [
            "停止されたアカウントはログインできず、保持していたセッションはすべて削除されます。投稿および返信は残るため、スレッドは文脈を失いません。",
            "停止した時刻および理由をアカウントに記録し、操作は監査ログにも残します。",
            "解除は停止の取り消しであり、実施できる者も同一のルールに従います。解除すればログインできますが、以前のセッションは復元されません。",
            "管理者のアカウントを画面から停止することはできません。管理者のアクセスを外す場合は役割の変更となり、最後の管理者に関するルールに従います。",
          ],
        },
        {
          heading: "9. 異議申し立て",
          paragraphs: [
            "投稿の削除またはアカウントの停止について、判断に異議がある場合は、同一の内容を再投稿しないでください。2 つ目のアカウントも作成しないでください。「サイトへの意見」ボードでお尋ねいただくか、保守担当にご連絡いただき、スレッドのリンクまたはアカウント名を添えてください。",
            "可能な場合は、別のモデレーターが判断を確認します。利用停止に対する申し立ては、管理者が確認します。",
            "保守担当およびモデレーターで解決しない場合は、担当教員が次の窓口となります。",
          ],
        },
        {
          heading: "10. 監査と説明責任",
          bullets: [
            "削除、ロック、通報の判断、利用停止、解除、役割の変更、ボードのアーカイブについて、実行者、操作、対象、時刻を 1 行として記録します。",
            "記録は追記のみです。監査の記録を編集または削除する画面はなく、誤った操作は履歴を書き換えず、新たな操作によって訂正します。",
            "監査ログはモデレーターおよび管理者が閲覧できます。48 時間という目標が守られたかを後から確認できるのも、この記録によるものです。",
          ],
        },
        {
          heading: "11. 緊急時とエスカレーション",
          bullets: [
            "本サイトは緊急連絡の手段ではなく、24 時間の監視も行っていません。",
            "誰かが差し迫った危険にある場合は、まず教員、学校の事務室、保護者、または緊急窓口に連絡し、その後に投稿を通報してください。",
            "重大な安全案件は担当教員へ、必要に応じて学校へ報告します。当該対応は画面外で行われ、公開される操作としては記録されません。",
          ],
        },
        {
          heading: "12. この方針の変更",
          paragraphs: [
            "本方針を変更した場合は、上部の日付を更新します。",
            "モデレーターが行い得る事項、または判断への異議申し立ての方法に関わる変更は、安全上急を要する場合を除き、効力発生前に「サイトへの意見」ボードでお知らせします。",
            "本方針は利用規約の一部です。ルール違反は両文書に従って取り扱います。",
          ],
        },
      ],
    },
    terms: {
      title: "利用規約",
      intro:
        "本規約は、登録時に同意いただく契約条件です。アカウント、投稿できる内容、モデレーターが削除できる事項、利用者に留保される権利、運営者が約束する事項および約束しない事項を定めます。コミュニティルール、プライバシー通知、モデレーション方針は、本規約の一部を構成します。",
      updated: `最終更新: ${POLICY_UPDATES.terms}`,
      sections: [
        {
          heading: "1. 定義",
          bullets: [
            "**本サイト**：本ドメインならびにそのページ、フォーム、およびダウンロード可能なファイル。",
            "**運営者**：学生の保守担当、ならびに管理画面で操作するモデレーターおよび管理者。",
            "**利用者**：アカウントを保有する者、またはアカウントなしで閲覧する訪問者。",
            "**投稿内容**：スレッド、返信、タイトル、タグ、ユーザー名、ボード名、ボードの説明、プロフィールの項目。本サイトに添付機能はありません。",
            "**モデレーター**および**管理者**：他者の投稿内容に対して操作を行い得る二つの役割。管理者が上位であり、相違点はモデレーション方針に定めています。",
            "**本規約**：本文書、および本文書が一部と定める三つの文書。",
          ],
        },
        {
          heading: "2. 本規約への同意",
          bullets: [
            "登録画面のチェックボックスは、文書ごとに 1 つずつ用意しています。本規約、コミュニティルール、プライバシー通知、モデレーション方針の 4 つです。判定はサーバー側で 4 つすべてについて行うため、ブラウザの制御を回避したリクエストも拒否されます。",
            "同意は、日時および 4 つの文書それぞれの版として保存します。文書は個別に改訂されるため、後から「何に同意したか」を確認できるようにするためです。",
            "本要件の施行前に作成されたアカウントには、記録がありません。継続して利用する場合は、現在の版に同意したものとして扱います。",
            "同意できない場合は登録しないでください。すでにアカウントを保有し同意できない場合は、利用を中止し、保守担当に投稿内容の削除を依頼してください。",
          ],
        },
        {
          heading: "3. 利用できる人",
          bullets: [
            "本サイトを利用できるのは、本校の生徒および教職員です。公開されているスレッドは、アカウントがなくても閲覧できます。",
            "18 歳未満の方は、教員または保護者が利用を認識している状態でご利用ください。",
            "登録には、教員または保守担当が発行する招待コードが必要です。コードは何度でも使用でき、有効なコードは常に 1 つです。同じコードで登録したアカウントは記録します。本サイトは学校への所属を確認できないため、利用資格は利用者自身の申告に基づきます。虚偽の申告は本規約違反となります。",
            "アカウントは 1 人 1 つです。削除、回数制限、利用停止を回避するために別のアカウントを作成することは、本規約違反です。",
          ],
        },
        {
          heading: "4. アカウント",
          bullets: [
            "ユーザー名は自身で決定し、公開されます。メールアドレスは任意であり、他の利用者に表示されることはありません。",
            "パスワードは自身で管理してください。ログイン中のアカウントによる操作は、すべて当該アカウントのものとして扱います。役割を有する場合、モデレーション操作も含みます。",
            "メールによる再設定はありません。パスワードを忘れた場合は、教員または保守担当にご相談ください。再設定では、新しいパスワードを一度だけ表示し、当該アカウントのすべてのセッションをログアウトさせます。",
            "アカウントの削除は保守担当に依頼できます。現在は手作業で行っており、利用者自身が削除できるボタンはありません。削除後も投稿内容は公開されたまま残り、作成者の表示は「削除済み利用者」に置き換わります。",
            "役割の変更は管理者が行います。モデレーターまたは管理者は、モデレーション方針に従ってアカウントを停止できます。停止されたアカウントはログインできず、セッションは削除されます。",
          ],
        },
        {
          heading: "5. 投稿した内容の権利",
          bullets: [
            "投稿した内容の著作権は、利用者に留保されます。本規約は、その権利を学校、運営者、その他の者へ譲渡するものではありません。",
            "利用者は運営者に対し、投稿内容を保存、表示、バックアップ、書き出し、およびモデレーションする非独占的かつ無償の許諾を与えるものとします。目的は本サイトの運営に限られ、販売、第三者への利用許諾、サイト外での公開を含みません。",
            "他の生徒に対する表示の許諾は、当該投稿内容が削除されるまで継続します。アカウントを削除した場合、投稿内容は公開されたまま残り、作成者の表示は「削除済み利用者」に置き換わります。本人の希望により、個別の投稿内容の削除を求めることができます。削除された項目の本文はデータベースに残り、通報を取り扱うモデレーターは閲覧できます。バックアップ、監査記録、書き出したスレッド内の複製については、プライバシー通知に定める保存の定めに従って削除されるまで許諾が継続します。",
            "自身が作成したもの、または投稿する権利を有するもののみを投稿してください。他者から取得した文章は、出典を明記してください。",
            "モデレーターは投稿内容を削除し、その箇所にプレースホルダーを残す場合があります。登録は、事前の同意なくこれが生じ得ることを受諾することを意味します。",
          ],
        },
        {
          heading: "6. 禁止される内容",
          bullets: [
            "嫌がらせ、脅し、威圧、つきまとい、および集団で特定の個人を攻撃する行為。",
            "国籍、民族、宗教、性別、障害、外見、家族に関する差別的表現および中傷。",
            "本人の許可のない実名、住所、電話番号、時間割、写真、アカウント情報の投稿。偽名の投稿者の特定、およびその推測の公開。",
            "性的・扇情的な内容、および未成年者を性的に扱う内容。生物学や保健の授業に関する質問、医学的な性の健康に関する相談、文学や社会現象についての学術的な議論は、教育・学習の目的に限り認められます。教育目的であっても、未成年者を性的に扱う内容、性的な画像や描写、わいせつな表現は禁止します。",
            "自殺、自傷、摂食障害を勧める行為、またはその方法の記載。",
            "違法行為、武器、薬物、人を傷つける方法の説明。",
            "教員、生徒、部活動の役員、モデレーター、または本サイトになりすます行為。",
            "試験実施中の問題または解答の共有、他者に自分の課題を完成させて提出させる行為、他者の成果を自分のものとして提出する行為。",
            "宣伝、紹介リンク、詐欺、および話題と無関係な勧誘の繰り返し。",
            "マルウェア、フィッシング、本サイトまたは端末を破壊する目的の内容。",
          ],
        },
        {
          heading: "7. 禁止される行為",
          bullets: [
            "アカウントの共有、および他者になりすました投稿。",
            "削除、回数制限、利用停止を回避するためのアカウント作成。",
            "人の操作なしに投稿、編集、リアクションを行うボットまたはスクリプトの稼働。",
            "スレッドの一括複製、および他の場所での利用を目的とする取得。",
            "本サイト、他のアカウント、モデレーター用の画面の調査、負荷の付与、または破壊の試行。",
            "回数制限または自動の語句チェックの回避の試行。",
            "好まない意見を封じるための通報、および通報者に対する報復。",
          ],
        },
        {
          heading: "8. モデレーションと制裁",
          bullets: [
            "モデレーターは、投稿の削除、スレッドのロック、スレッドの削除、通報の判断を行えます。管理者はさらに、ボードのアーカイブおよび復元、役割の変更、モデレーターの停止を行えます。",
            "モデレーターは生徒を停止できます。モデレーターを停止できるのは管理者に限ります。管理者および自身は、いずれも停止できません。",
            "操作はすべて、実行したアカウントとともに監査ログに記録されます。削除された内容は消滅せず、プレースホルダーが残ります。",
            "対応の順序および目標とする応答時間は、モデレーション方針に定めています。安全上必要と判断した場合、本規約は運営者がより早く対応する裁量を認めます。",
            "運営者は、対応の前に理由を告げる義務を負いません。理由は監査ログに残り、これを問い直す経路はモデレーション方針の異議申し立てです。",
          ],
        },
        {
          heading: "9. 利用停止と利用の終了",
          bullets: [
            "利用停止は取消可能です。ログインができなくなり、セッションは削除され、理由および時刻が記録されます。",
            "運営者は、本規約またはコミュニティルールへの違反があった場合、誰かを保護する必要がある場合、通報を調査している場合に、アカウントを停止できます。",
            "判断の見直しは、モデレーション方針に定める異議申し立ての経路で求めることができます。",
            "運営者は本サイトを終了できます。学生が運営しており、運営する者に依存するため、その者が卒業し、または退任した場合には継続できません。",
          ],
        },
        {
          heading: "10. 提供状況と仕様の変更",
          bullets: [
            "本サイトは学生が運営しています。試験期間、サーバーの移転、休暇、保守担当の交代の間は、利用できない場合があります。",
            "稼働率、データの保全、将来の提供を約束するものではありません。データを失う可能性があり、投稿が翌年も残ることを保証できません。",
            "機能は追加、変更、終了する場合があります。本規約上の権利に関わる変更は、第 12 節に従います。",
          ],
        },
        {
          heading: "11. データとプライバシー",
          paragraphs: [
            "保存する情報、その目的、閲覧可能な者、保存期間は、プライバシー通知に定めています。同通知も本規約の一部です。",
            "アクセス解析、広告、外部の追跡はありません。投稿内容が販売されること、および他者のために利用者の傾向を分析する材料とされることもありません。",
          ],
        },
        {
          heading: "12. 本規約の変更",
          bullets: [
            "本規約を変更した場合は、上部の日付も更新します。登録時に保存した版が、当該アカウントが同意した版です。",
            "投稿できる内容、または投稿内容の利用方法に関わる変更は、安全上お知らせできない場合を除き、効力発生前に「サイトへの意見」ボードでお知らせします。",
            "変更後も利用を継続する場合は、新しい版に同意したものとみなします。同意できない場合は利用を中止し、保守担当に投稿内容の削除を依頼してください。",
          ],
        },
        {
          heading: "13. 保証の否認と責任の制限",
          bullets: [
            "本サイトは現状のまま提供され、法律が認める範囲において、いかなる保証も伴いません。",
            "運営者は、間接的または結果的な損害、投稿内容の消失、サービスの中断について責任を負いません。",
            "本規約は、日本法の下で放棄できない権利を制限するものではありません。消費者として有する権利が適用される場合も同様です。",
            "本サイトは緊急連絡の手段ではなく、24 時間の監視もなく、学校の公式な連絡手段でもありません。",
          ],
        },
        {
          heading: "14. 準拠法・可分性・連絡先",
          bullets: [
            "本規約は日本法に準拠します。",
            "本規約の一部が効力を持たないと判断された場合でも、残りの部分は適用されます。",
            "本規約、および本規約が一部と定める三つの文書が、本サイトの利用に関する合意のすべてです。",
            "連絡先は「サイトへの意見」ボード、またはプロジェクトのリポジトリページに記載のアドレスです。解決しない場合は担当教員にご相談ください。",
          ],
        },
      ],
    },
  }
};

export function policyFor(locale: Locale, key: PolicyKey): PolicyDocument {
  return POLICIES[locale][key];
}
