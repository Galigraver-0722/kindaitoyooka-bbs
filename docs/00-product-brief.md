# Product Brief

## 1. The problem

A school already has places to talk: a class group chat, a club chat, the staff room, the
notice board by the entrance. None of them is good at being **found later**.

- Chat messages disappear into scrollback. A useful answer about the chemistry assignment is
  impossible to find three weeks later.
- Official channels are for official notices. Students hesitate to ask a messy question there.
- There is no neutral place where a first-year can ask a third-year about a club, or where a
  club can leave a sign-up sheet that does not expire overnight.

The result: knowledge is recreated every year, and the students who most need help are the
least likely to ask in a fast-moving group chat.

**Toyooka BBS** is a small, topic-organized, persistent bulletin board for the school
community. It is deliberately slower and more public than chat. That is the point.

## 2. Who it is for

| User | What they need | What success looks like |
| --- | --- | --- |
| Students (12–18) | Ask questions, find study help, join clubs | A question gets an answer without exposing personal details |
| Club officers and student council | Post announcements that stay readable and linkable | One canonical thread per event instead of five reposts |
| Moderators (senior students) | Remove harmful posts quickly, keep the tone civil | Reports handled within the published SLA |
| Teacher advisor | Oversight without reading everything | Can review moderation actions and step in on serious incidents |
| Maintainer (you) | A system one person can run | Deploys, backs up, and recovers without drama |

## 3. Jobs to be done

1. **When I am stuck on homework**, I want to ask a question with enough context that someone
   can answer it, without giving away who I am.
2. **When my club has an event**, I want one place to post the date, place, and sign-up
   instructions that people can find a month later.
3. **When I am new**, I want to see what the school is like and who is active before I post.
4. **When something is wrong**, I want to report it without confronting the person.
5. **When I run the site**, I want to remove content and lock threads in seconds, with a record
   of what I did.

## 4. Value proposition

> A searchable, topic-based, student-run notice board where asking a question does not require
> revealing who you are.

The BBS is not trying to replace chat. Chat is for coordination now; the BBS is for knowledge
that should survive the term.

## 5. Principles

1. **Public by default, minimal personal data.** No real names, no photos, no birthdays, no
   location beyond "school". A username and a password are enough.
2. **Slow is a feature.** Threads, not pings. No read receipts, no presence, no infinite feed.
3. **Moderation is visible and accountable.** Removed posts leave a visible placeholder, and
   actions are attributed to a moderator account in the database.
4. **Boring technology.** A small team must be able to read the whole codebase and recover the
   data with a file copy.
5. **English-first, localizable later.** The interface, code, comments, and documents are in
   English by project decision. Japanese localization is a planned phase, not a rewrite.

## 6. Success metrics

Measure after the first full term. Numbers are targets, not promises.

| Metric | Target | Why it matters |
| --- | --- | --- |
| Registered students | ≥ 30% of the student body | Enough density for answers |
| Weekly active / registered | ≥ 20% | The forum is part of routine, not a launch stunt |
| Threads answered within 48 h | ≥ 60% | Empty forums die; first replies are the product |
| Median report response (school days) | < 24 h | Safety promise to students and staff |
| Confirmed personal-information incidents | 0 | The main reason a school would shut this down |
| Restore drill from backup | < 30 min, quarterly | Data loss is the one unrecoverable failure |

## 7. Constraints

- **Minors.** Most users are under 18. Privacy, safety, and adult oversight are non-negotiable.
- **School approval.** The site cannot launch as an official school service without a teacher
  sponsor and the administration's agreement. See `docs/06-safety-and-moderation.md`.
- **Budget.** Domain plus a small VPS, ideally under ¥15,000 per year. No paid SaaS dependency
  in the MVP.
- **People.** One maintainer, a handful of volunteer moderators, one teacher advisor.
- **Calendar.** Japanese school year: launch before the first-term lull, avoid exam weeks and
  the culture festival crunch for migrations or policy changes.

## 8. Non-goals for the first version

- Official school announcements or grade information.
- Direct messages, group chats, or real-time presence.
- Image, video, or file uploads.
- Anonymous posting without an account (accounts are the accountability layer).
- Mobile apps. The web app must work on a phone browser instead.
- Federation, public internet access, or search-engine indexing.

Each of these is a deliberate omission, not an oversight. See `docs/01-mvp-scope.md` for the
reasoning and `docs/05-roadmap.md` for when they may change.

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Empty forum at launch | High | High | Seed with 5 boards and 10 real questions; invite 20 beta users before opening |
| Bullying or defamation | Medium | High | Report button, fast removal, visible policy, teacher escalation path |
| Personal data leak | Medium | Very high | Data minimization, no uploads, no real-name fields, moderation policy |
| Moderator burnout | High | Medium | Small queue, clear SLA, rotate duties, lock threads instead of arguing |
| One-person bus factor | High | High | Documented runbook, backups, plain stack, no exotic services |
| School says no | Medium | High | Involve a teacher sponsor before writing launch communications |

## 10. Open decisions

Product name, domain, hosting owner, account model, and moderation staffing are not settled.
They are tracked in `docs/10-open-questions.md`.
