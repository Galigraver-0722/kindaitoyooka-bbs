# Decision Log

> 日本語版: [日本語](ja/08-decision-log.md)

Architecture decisions are recorded here so that future maintainers know what was chosen, why,
and when to revisit it. Each entry states the context, the decision, the consequences, and the
alternatives considered.

## Index

| ID | Decision | Status | Date |
| --- | --- | --- | --- |
| ADR-0001 | Next.js full-stack application | Accepted | 2026-10-24 |
| ADR-0002 | MIT license | Accepted | 2026-10-24 |
| ADR-0003 | SQLite with Prisma | Accepted | 2026-10-24 |
| ADR-0004 | Custom cookie sessions instead of an auth provider | Accepted | 2026-10-24 |
| ADR-0005 | Plain HTML forms and route handlers, not server actions or an SPA | Accepted | 2026-10-24 |
| ADR-0006 | Japanese-first bilingual interface with English as the source of truth | Accepted | 2026-10-24 |
| ADR-0007 | Soft deletion for all user content | Accepted | 2026-10-24 |
| ADR-0008 | Transparent weighted score for "hot" sorting | Accepted | 2026-10-24 |
| ADR-0009 | Tags come from a dedicated field, not body text | Accepted | 2026-10-24 |
| ADR-0010 | In-process fixed-window rate limits | Accepted | 2026-10-24 |
| ADR-0011 | Advisory automatic flags from an open word list | Accepted | 2026-10-24 |
| ADR-0012 | Append-only audit log for moderation | Accepted | 2026-10-24 |
| ADR-0013 | Fifteen-minute author edit window with a visible marker | Accepted | 2026-10-24 |
| ADR-0014 | Manual password recovery instead of email reset | Accepted | 2026-10-24 |
| ADR-0015 | Per-thread read markers written on view | Accepted | 2026-10-24 |
| ADR-0016 | Numbered board pagination, 20 threads per page | Accepted | 2026-10-24 |
| ADR-0017 | Policies as bilingual, versioned code | Accepted | 2026-10-24 |
| ADR-0018 | Editorial/Swiss visual system with one accent | Accepted | 2026-10-24 |
| ADR-0019 | Progressive enhancement for reactions | Accepted | 2026-10-24 |

---

## ADR-0001 — Next.js full-stack application

**Context.** One student maintainer, a school-sized audience, and a requirement to ship
something understandable and deployable within weeks. The team has basic JavaScript knowledge
and limited time.

**Decision.** Use Next.js 16 (App Router) with React Server Components, TypeScript, and
Tailwind CSS for one deployable application.

**Consequences.**

- One codebase, one deployment, one language.
- Server rendering works on old phones and without JavaScript.
- The framework changes frequently; the project must read the local Next.js documentation in
  `node_modules/next/dist/docs/` when the version changes.
- The team must understand the difference between server and client components.

**Alternatives considered.**

- *Django or Rails*: excellent for forums, batteries included, but a second language and a
  separate frontend pipeline for interactive touches.
- *Laravel*: same trade-off, plus PHP hosting may be unfamiliar.
- *Separate React SPA + Express API*: more moving parts, more decisions, slower to a working
  forum.

**Revisit if.** The app needs a native mobile client, background jobs, or real-time features
that do not fit the framework. Even then, keep the database and move the API.

---

## ADR-0002 — MIT license

**Context.** The repository must be public and the user asked the project to choose the
license. The audience is students and the school; there is no commercial plan.

**Decision.** Release the code under the MIT License (Copyright 2026 Kindai Toyooka BBS
contributors).

**Consequences.**

- Anyone can use, modify, and redistribute the code, including in closed-source form, as long
  as the copyright notice is kept.
- It is the easiest license for students and the school to understand and reuse.
- It does not require the school, or a vendor the school hires, to publish modifications.

**Alternatives considered.**

- *AGPL-3.0*: keeps modifications open even when the software is offered over a network, which
  matches a public forum. Rejected for v0.1 because it adds compliance questions for a school
  and scares away some contributors. If the school later wants a guarantee that a vendor's
  improvements stay open, a fork can adopt the AGPL; the license of existing code cannot be
  revoked, but future versions can change.
- *Apache-2.0*: adds a patent grant and notice requirements. Slightly more legal text than a
  student project needs.
- *No license*: all rights reserved; nobody may legally reuse the code. Unacceptable for a
  public repository.

**Revisit if.** A commercial entity starts hosting a modified version as a paid service, or the
school's legal contact requests a different license.

---

## ADR-0003 — SQLite with Prisma

**Context.** Expected load is hundreds of daily reads and dozens of writes from one school. The
maintainer has no database operations experience.

**Decision.** Store data in a single SQLite file, accessed through Prisma.

**Consequences.**

- Backup is a file copy; local development needs no database server.
- Prisma's schema documents the model and provides typed queries.
- Writes serialize; long transactions block readers in some modes.
- Horizontal scaling is not possible; one application instance owns the file.
- Moving to PostgreSQL later requires changing the datasource and running migrations, not
  rewriting queries.

**Alternatives considered.**

- *PostgreSQL from day one*: better concurrency and managed backups, but adds a service to run,
  secure, and pay for before there is any traffic.
- *MySQL*: same operational cost with no benefit for this project.
- *`node:sqlite` directly*: fewer dependencies, but hand-written SQL and no schema tooling; less
  educational support material than Prisma.

**Revisit if.** Persistent `database is locked` errors, more than one app instance is needed, or
backups become slow (see `docs/02`, section 9).

---

## ADR-0004 — Custom cookie sessions instead of an auth provider

**Context.** Auth must work without a school Google Workspace integration, without a paid
identity provider, and without a long approval process.

**Decision.** Implement username/password authentication with `scrypt` hashing, random session
tokens, and an `HttpOnly` cookie. Store only token hashes server-side.

**Consequences.**

- No external dependency, no vendor approval, fully understandable code.
- The team owns password reset, email verification, rate limiting, and account enumeration
  defenses. Some are still missing (see `docs/01`).
- No SSO: students create another password, which is a usability and support cost.

**Alternatives considered.**

- *Auth.js with a school Google account*: best UX if the school allows OAuth and every student
  has an account; requires administrator consent and a client secret.
- *Clerk/Auth0*: fast to integrate, but a recurring cost and a vendor holding minor students'
  identity data. A school will ask hard questions about that.
- *Magic links*: requires reliable email delivery to students, which the school may not allow.

**Revisit if.** The school adopts Google Workspace for all students and approves OAuth. The
migration path is to keep the `User` table and add an external identity column rather than
rewriting content.

---

## ADR-0005 — Plain HTML forms and route handlers

**Context.** The author needs to be able to test and reason about every write without a
JavaScript framework in the way, and the site must work on old devices.

**Decision.** Mutations are HTML `<form>` posts to route handlers under `/api`, which validate,
write, and answer with `303` redirects. No client-side state library, no `fetch` calls in the
MVP.

**Consequences.**

- The full write path can be tested with `curl`.
- Works without JavaScript and degrades gracefully.
- More verbose than server actions; flash messages travel in the query string.
- Rich interactions (live preview, optimistic updates) will need client components later.

**Alternatives considered.** Next.js Server Actions (less boilerplate, harder to test from the
command line), GraphQL or tRPC (unnecessary indirection at this size), a separate REST API
(useful only when a second client exists).

---

## ADR-0006 — Japanese-first bilingual interface with English as the source of truth

**Context.** The project owner requires code, comments, and documentation in English. The school
is in Japan, most students read Japanese more comfortably, and the owner asked for both a
Japanese documentation edition and an in-app language switch. The primary audience is Japanese
speaking, so the site should open in Japanese without asking. The interface must stay simple,
work without client JavaScript, and add no paid service.

**Decision.** English stays the source of truth for code, comments, the interface's source
strings, commit messages, issues, and pull requests. The interface opens in Japanese when no
`locale` cookie is present and can be switched to English from the header. Every user-facing
string lives in a typed dictionary (`src/lib/locales.ts`), the chosen language is stored in a
one-year `locale` cookie, and a `POST /api/locale` form flips it and redirects back. `docs/`
remains the canonical documentation and `docs/ja/` holds a full Japanese translation. When the
editions disagree, English wins, and both are updated in the same pull request. Commands,
identifiers, URLs, and error codes stay in English inside the Japanese edition.

**Consequences.**

- The site is usable on the first visit without a language decision; English readers can switch
  with one click.
- No i18n dependency, no locale-prefixed routes, and no client-side translation flash: the
  server renders the right language on the first byte.
- A unit test compares the shape of both dictionaries, so a missing Japanese string fails CI.
- User-written content (thread titles, posts, board names) is never translated automatically;
  the switch changes interface text, dates, and number formatting only.
- Every new UI string must be added twice, and documentation changes must be made twice.
  Translation drift is a real maintenance cost.
- The error-code map remains the seam for translating server-side messages.

**Alternatives considered.**

- *English default with a Japanese switch*: the original arrangement; rejected because the
  primary audience reads Japanese and should not have to find a toggle first.
- *Browser-language detection*: convenient for mixed audiences, but adds a second source of
  truth and surprises users on shared school devices; a visible switch is clearer.
- *next-intl or next-i18next*: mature, but adds a dependency and routing conventions for an app
  with two languages and no localized URLs.
- *Locale-prefixed routes (`/ja/...`)*: better for search-engine indexing, which this school
  forum deliberately does not optimize for; it also complicates every redirect and cookie path.
- *Client-side translation*: simpler to add, but causes a flash of the wrong language and breaks
  the no-JavaScript promise.

**Revisit if.** The school wants a third language, a different default for a sister school, or
search engines must index localized pages. The migration path is another dictionary object and,
only if needed, locale-prefixed routes.

---

## ADR-0007 — Soft deletion for all user content

**Context.** Moderation needs to be reversible and auditable, and removing a post must not
destroy the surrounding conversation.

**Decision.** Set `isDeleted = true` and render a placeholder. Do not hard-delete posts or
threads from the application.

**Consequences.**

- Moderators can review what was removed and why.
- The database retains harmful text; a retention purge is required before launch
  (see `docs/03`, section 8).
- A determined user with database access can still read removed content; this is acceptable
  because database access is limited to the maintainer and audited.

**Alternatives considered.** Hard delete (loses context and audit), hiding only in the UI
(insufficient if the row is served elsewhere), a separate archive table (more complexity than
this scale needs).

---

## ADR-0008 — Transparent weighted score for "hot" sorting

**Context.** Readers need a way to find threads that are getting attention, but the site stores
no view counts and no analytics, and it must stay explainable to students and teachers.

**Decision.** Compute popularity in the application as
`likes × 3 + bookmarks × 2 + replies + recency`, where recency adds up to 3 points for activity
within the last 72 hours. Sort at most 100 candidate rows in memory. Do not store a score.

**Consequences.**

- The formula is public and easy to change; nobody has to guess what "hot" means.
- Liking and bookmarking become meaningful signals without tracking readers.
- The cost is bounded by the 100-row cap; results older than the current query window are not
  ranked.
- Pinned threads stay at the top regardless of score.

**Alternatives considered.** View counts (privacy cost, easy to game), a Hacker News-style
time-decay formula (harder to explain), a stored `hotScore` column (more write paths and drift).

**Revisit if.** The candidate window grows beyond a few hundred threads, or ranking needs
personalization. Then move to SQL-side scoring or a materialized score.

---

## ADR-0009 — Tags come from a dedicated field, not body text

**Context.** Users want topics without filling in another form, and the existing editor is plain
text.

**Decision.** Tags come from a dedicated `tags` field on the compose and reply forms. The field
is split on spaces, commas, and Japanese commas; a leading `#` is optional. Normalize with NFKC,
lowercase, allow Unicode letters, numbers, and underscores, and keep at most five tags per write.
Connect or create shared `Tag` rows and attach them to the thread. Tag links open
`/search?tag=...`. Body text is never scanned for hashtags.

**Consequences.**

- Tags are explicit: a `#` in the body stays body text and never creates a tag.
- Typos create new tags, and there is no rename or merge screen yet. Moderators can merge them
  in the database if it becomes a problem.
- A tag belongs to the whole thread, not to the individual post that mentioned it.
- Tags are user content: report the post that introduced an abusive tag.

**Alternatives considered.** Parsing hashtags from the body (the first implementation; rejected
because the reader cannot tell whether a `#` is content or metadata), a tag picker with
autocomplete (cleaner data, more UI and client JavaScript), per-post tags (more precise, but
threads are the unit of discovery here).

**Revisit if.** Tag spam appears, or users need controlled vocabularies such as subjects and
clubs.

---

## ADR-0010 — In-process fixed-window rate limits

**Context.** The first real abuse risk is not a distributed botnet but a student holding down
Enter, a shared password being guessed, or a report flood. The deployment is one Node process
behind Caddy, with no Redis.

**Decision.** Keep a `Map` of fixed-window counters in `src/lib/rate-limit.ts`. Apply limits to
login (IP + username), registration (IP), thread creation, replies, reports, likes, and
bookmarks. Reject with a redirect carrying `error=rate-limited`.

**Consequences.**

- No dependency, no extra service, and the limits are easy to read and tune.
- Counters reset on restart and are not shared across instances.
- A determined attacker can rotate IPs; this stops accidents and casual abuse, not a botnet.

**Alternatives considered.** Redis token buckets (operational cost before there is traffic), a
database counter (write contention on every request), proxy-only limits (cannot see accounts).

**Revisit if.** More than one app instance runs, or a beta shows coordinated abuse.

---

## ADR-0011 — Advisory automatic flags from an open word list

**Context.** Moderators cannot read every post, and the school wants an early warning for
harassment, sexual content, and threats. Training a model is out of scope, and sending student
text to a third-party API is not acceptable.

**Decision.** Use the CC BY 4.0 `naughty-words` lists (LDNOOBW) for Japanese and English. Remove
ordinary school words with a project ignore list, add a few Japanese threats, and match Japanese
terms by substring and English terms by word boundary. A match creates a `Report` with
`source = AUTO`; it never hides or blocks the post.

**Consequences.**

- No external service, no training data, and the list is replaceable.
- False positives are expected, especially for health and biology vocabulary; moderators dismiss
  them. The queue shows the matched terms.
- The filter is a safety net for humans, not a decision maker.

**Alternatives considered.** A hosted moderation API (privacy, cost, minors' data), a trained
classifier (data and maintenance burden), blocking on match (false positives would silence
legitimate questions).

**Revisit if.** The false-positive rate is too high, or the school requires category-specific
policies. Then add per-category lists and weights.

---

## ADR-0012 — Append-only audit log for moderation

**Context.** Moderators remove posts and lock threads. Students and the teacher advisor need a
record of who did what, and the maintainer needs it for incident review.

**Decision.** Add an `AuditLog` table and write one row in the same transaction as every
moderation change. Record actor, action, target, and a small JSON detail payload. Show the latest
thirty entries on `/moderation`.

**Consequences.**

- Every change is accountable, and a failed audit write rolls back the change.
- The log is append-only; there is no UI to edit or delete it.
- The audit table contains no post body and no IP address; it records actions, not surveillance.

**Alternatives considered.** Application logs only (not queryable, easy to lose), a full event
sourcing design (far more than this scale needs).

**Revisit if.** The school needs to export the audit log for an investigation; add a read-only
export rather than editing rows.

---

## ADR-0013 — Fifteen-minute author edit window with a visible marker

**Context.** Students notice typos, missing dates, or a wrong room number minutes after posting.
Without editing they either leave the error or add a correction reply, and the first version stays
at the top of the thread. Unlimited editing would let someone rewrite a thread after others have
replied, which makes moderation and quoted replies unreliable.

**Decision.** Only the author may edit a thread, and only within 15 minutes of `Thread.createdAt`.
The window covers the title, the opening post, and the tag set. A successful edit sets
`Thread.editedAt`, and the thread page shows an "edited" marker with the timestamp. Locked or
removed threads cannot be edited; moderators use the separate remove and lock tools instead.

**Consequences.**

- Small mistakes are fixed where they happened, without a correction reply.
- Readers see that the text changed, even when they do not see the old version.
- Every reply after the opening post remains uneditable in this phase; the window is about
  correcting the thread's framing, not rewriting a conversation.
- The rule is enforced in one pure function (`canEditThread`) and tested at the boundary, so the
  page, the route, and the tests agree.

**Alternatives considered.** No editing (support burden and stale errors), unlimited editing
(allows silent rewriting after replies), a revision table with diffs (good audit, too much UI and
storage for this phase), wiki-style editing by anyone (moderation risk).

**Revisit if.** Students ask to edit their replies, or a moderator needs to correct a title after
the window. Both are separate decisions; do not simply widen the window.

---

## ADR-0014 — Manual password recovery instead of email reset

**Context.** Accounts are username + optional email. The school cannot guarantee that students
have a mailbox the site can reach, and adding an email provider means a vendor, consent for
minors' addresses, and deliverability work. Still, a forgotten password must not lock a student
out permanently.

**Decision.** Ship a maintainer command, `pnpm reset-password <username>`, that generates a
16-character password, stores only its `scrypt` hash, deletes every session for the account, and
prints the password once. Document an in-person identity check and forbid reset requests through
public threads.

**Consequences.**

- No email provider, no verification tokens, and no new personal data.
- Recovery depends on a maintainer being available; the runbook must name a backup person.
- The generated password travels through a terminal and a conversation. The procedure tells the
  student to treat it as temporary and to request another reset if it leaks.
- The same command is the break-glass path after a credential leak.

**Alternatives considered.** Email reset links (best self-service, blocked by delivery and
privacy), security questions (weak and collect more personal data), letting moderators set
passwords in the UI (widens the trust boundary and leaves no terminal audit).

**Revisit if.** The school provides a domain for every student and approves email delivery. Then
add a `PasswordReset` token table and keep the command as the fallback.

---

## ADR-0015 — Per-thread read markers written on view

**Context.** Students want to know which threads are new without reading every board. Analytics
and view counters would answer a different question and collect more data than needed.

**Decision.** Store one `ThreadRead` row per user and thread with `lastReadAt`. Opening a thread
upserts the row. Lists mark a thread "New" when the row is missing or `lastPostAt` is newer than
`lastReadAt`. Guests have no read state and see no badges.

**Consequences.**

- The badge reflects replies, not mere views, and costs one small table.
- A thread page performs a write on GET. The write is idempotent and stores only a timestamp, but
  it does mean thread views are not read-only at the database level.
- Read state is per account; shared devices show the badge of the signed-in account only.
- There is no "mark all as read" or per-board counter yet.

**Alternatives considered.** A `lastVisitedAt` cookie (no per-thread state, breaks across
devices), counting views (privacy cost, easy to inflate), a weekly digest email (needs a mail
provider; still open as a Phase 2 item).

**Revisit if.** The write volume becomes a problem, or students ask for "mark all read". Then
batch the upsert or move to a last-visit timestamp per user and board.

---

## ADR-0016 — Numbered board pagination, 20 threads per page

**Context.** A board eventually holds more threads than anyone wants to scroll. The site must keep
working without client JavaScript, and the popular sort is computed in application code rather
than in SQL.

**Decision.** Board pages use numbered pages with `?page=N` and 20 threads per page. The page
number is clamped to the last page, and page 1 is the canonical URL without a `page` parameter.
The newest sort uses database `skip`/`take`; the popular sort ranks the top 100 candidates and
then slices that list. Pinned threads stay first.

**Consequences.**

- Links are shareable and work without JavaScript; the back button behaves normally.
- Offset pagination can repeat or skip an item when new threads arrive between page views. At
  this scale that is a cosmetic problem, not a correctness problem.
- The popular sort only covers 100 candidates; older threads are reachable through the newest
  sort and search.
- Every page still loads the unread state for the 20 visible threads only.

**Alternatives considered.** Cursor pagination by `lastPostAt` (better for infinite streams, but
awkward to combine with pinned threads and a computed hot score), a "load more" button (needs
client JavaScript), rendering all threads and hiding extras in CSS (wasteful and bad for old
phones).

**Revisit if.** A board regularly exceeds a few thousand threads, offset queries become slow, or
students ask for an infinite feed. Then move the newest sort to a cursor and keep numbered pages
for the popular view.

---

## ADR-0017 — Policies as bilingual, versioned code

**Context.** School approval needs a privacy notice, community rules, and a moderation policy.
The text must match what the code actually does, and it must exist in both interface languages.
A policy that promises deletion the code cannot perform is worse than no policy.

**Decision.** Store the three documents in a typed module (`src/lib/policies.ts`) and render them
through one component at `/rules`, `/privacy`, and `/moderation-policy`. The English and Japanese
editions sit next to each other, share one update date, and are checked by tests for structure and
unfinished placeholders. Where a capability is missing (account suspension, automatic purge),
the text says so instead of implying it exists.

**Consequences.**

- A behavior change and its policy text change land in the same commit.
- Both languages are always present; there is no silent English-only policy.
- Editing policy text requires a developer and a deploy; the teacher advisor cannot edit it
  directly. The advisor still has to approve the wording before launch.
- Tests catch missing sections and placeholder text, not legal adequacy.

**Alternatives considered.** Markdown files (easy to edit, easy to let the two languages drift),
a CMS or database-backed pages (new dependency, permissions, and versioning questions), leaving
the policies in the onboarding post only (not durable and hard to link from the footer).

**Revisit if.** A non-developer needs to update the text regularly, or the school requires a
signed, versioned document. Then move to versioned Markdown with a review step and keep the same
URLs.

---

## ADR-0018 — Editorial/Swiss visual system with one accent

**Context.** The first interface grew by addition: rounded cards, shadows, pills, and several
competing hues (indigo, rose, amber, emerald). Each screen worked, but the pages had no shared
rhythm, metadata competed with content, and the result looked like a generic dashboard rather
than a school publication.

**Decision.** Adopt one small visual system in `src/app/globals.css`: a warm neutral background
(`#FAF9F6`), white only for inputs and necessary surfaces, dark ink text, a single muted green
accent, and hairline rules instead of cards. Interface and body text use one system sans stack;
numbers, dates, labels, and code use a system monospace stack. Layouts follow a 12-column grid
with generous vertical spacing, numbered lists, and left-aligned type. Hover states change color
and a barely visible row tint; content rows do not lift, scale, or cast a shadow. The one raised
element is the floating compose button, which needs separation from the page. Route changes use a
220ms fade-and-rise transition, disabled under `prefers-reduced-motion`. Muted text is one step
darker than the reference palette so 12–13px metadata reaches WCAG AA.

**Consequences.**

- Content leads: titles, body text, and dates have a clear order; accent color is scarce.
- No external font request, so the first paint stays fast and the site works offline.
- Every new screen has to reuse the same primitives; adding a second accent or a card requires a
  deliberate decision rather than a new utility class.
- The look is intentionally quiet. It will not impress through decoration, and that is the point.
- Interaction is icon-led where an icon is unambiguous (bookmark, search, reply counts); labels
  remain for actions that need explanation.

**Alternatives considered.** A component library (fast, but produces the same dashboard look),
pure black-and-white Swiss styling (colder and harder to signal actions), more accent colors
(noise), a dark theme (a separate accessibility and contrast review; later if asked).

**Revisit if.** The school adopts a visual identity that requires different colors, or a dark
theme is requested. The tokens live in one place, so a theme can be added without touching page
markup.

---

## ADR-0019 — Progressive enhancement for reactions

**Context.** Liking a post and saving a thread should feel immediate, but the site promises to
work without client JavaScript and every existing mutation is an HTML form.

**Decision.** Keep the form as the source of truth and enhance it with one client component.
When JavaScript is available, the button toggles its icon and count before the request, sends
`Accept: application/json`, and reconciles with `{active, count}` from the route handler. On a
failed request it rolls the state back and shows a short inline error. Without JavaScript, the
same form posts normally and the page reloads.

**Consequences.**

- The interaction is instant on a good connection and still honest on a bad one.
- The route handlers now have two response modes; both are documented in `docs/04`.
- The page remains usable on old phones and with scripts blocked.
- A rapid double click is blocked while the request is in flight; no queue is implemented.

**Alternatives considered.** Client-only state with no form fallback (breaks the no-JavaScript
promise), a full SPA (too much for two buttons), server actions (harder to test from curl).

**Revisit if.** More interactions need optimistic updates. Then extract a shared request helper
instead of copying the pattern into every button.

---

## Template for new decisions

```markdown
## ADR-000N — Title

**Context.** What situation forces a choice?

**Decision.** What did we choose?

**Consequences.** What becomes easier, harder, or impossible?

**Alternatives considered.** What else was plausible, and why was it rejected?

**Revisit if.** Observable conditions that should reopen this decision.
```
