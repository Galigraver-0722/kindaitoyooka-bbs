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
| ADR-0020 | One feed and one board page as the whole information architecture | Accepted | 2026-10-25 |
| ADR-0021 | Students open their own boards without an approval step | Accepted | 2026-10-25 |
| ADR-0022 | Search stays `LIKE` plus a published ranking, without a full-text index | Accepted | 2026-10-25 |
| ADR-0023 | Rate-limit counters in SQLite, and only trust a proxy we control | Accepted | 2026-10-25 |
| ADR-0024 | Administrators own board lifecycles; quiet boards archive themselves | Accepted | 2026-10-25 |
| ADR-0025 | The notification inbox is derived from existing rows | Accepted | 2026-10-25 |
| ADR-0026 | Authors may remove their own posts, and a removal always lands somewhere visible | Accepted | 2026-10-25 |
| ADR-0027 | Live refresh is polling plus client reconciliation, not websockets | Accepted | 2026-10-26 |
| ADR-0028 | Terms of use and a name policy, because the license covers neither | Accepted | 2026-10-26 |
| ADR-0029 | One console, and suspension as the account-level sanction | Accepted | 2026-10-27 |
| ADR-0030 | Announcements ship with the code, and previews are read-only | Accepted | 2026-10-27 |
| ADR-0031 | The feed shows the opening lines; the composer preview is parked | Accepted | 2026-10-27 |

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

## ADR-0020 — One feed and one board page as the whole information architecture

**Context.** The first build had four competing lists: a home page with the newest threads, a
`/threads` hub, a `/search` results page, and `/bookmarks`. A board had its own list on top of
that, so the same thread could be reached from three places with three different sort states.
Students who tested it asked where "everything" lived, and the "rising" view had no home.
Reddit and Tieba both solve this with one ranked feed per scope.

**Decision.** `/` is the only cross-board list. It carries the three sorts (`latest`, `hot`,
`rising`) and the three filters (`all`, `saved`, `mine`), plus the search box. `/b/[slug]` is
the only per-board list and mirrors the same sort control. `/threads`, `/search`, `/bookmarks`,
and `/boards` remain as redirects that keep their query parameters, so old links and old
bookmarks still land on the right view. Creating a thread has exactly one entry point: the
floating ＋ button, which pre-selects the board when opened from a board page. The board list
lives in the sidebar and the mobile drawer; it does not get a page of its own.

**Consequences.**

- Every list question — "what is new", "what is popular", "what did I save" — is a change of
  query parameters on one page, so the sort and filter state is always visible and shareable.
- The feed is capped at 30 threads; it is a reading surface, not an archive. Board pages keep
  numbered pagination for depth.
- Redirects keep four URLs alive forever. They are three lines each and documented in
  `docs/04`.
- A board page and the feed now share the sort labels, the thread card, and the browser
  behaviour, which removes a class of "this looks different here" bugs.

**Alternatives considered.** Keeping `/threads` as a second, richer list: two places to fix and
two states to explain. A single list with a board filter chip instead of board pages: board
identity (banner, description, member count, suggested tags) has nowhere to go, and the site is
organised by board. A separate "discover" page for rising threads: the third sort tab does the
same job without a new route.

**Revisit if.** The feed grows past a few hundred active threads and needs real pagination, or
students ask for a cross-board view of one tag. Both are query parameters plus a page control,
not a new page.

---

## ADR-0021 — Students open their own boards without an approval step

**Context.** Clubs and class groups kept asking for a board. The original plan made board
creation staff-only, with an approval queue, which would have stalled every new club for days
and left the moderation work with one teacher. The schema already separates official and
community boards.

**Decision.** Any signed-in student can create a `COMMUNITY` board from `/boards/new`, with a
name, a slug, a description, and optional suggested tags. Limits hold the shape of the site:
three owned boards per account, five creations per hour, unique slugs that cannot collide with
reserved routes. Official boards keep `kind = OFFICIAL` and no owner. The board page shows a
「コミュニティ」 badge so a student-run board is never mistaken for an official one.

**Consequences.**

- A club can have its own space the same afternoon it asks, without waiting for staff.
- Nothing is approved before it exists, so the moderation team sees new boards after the fact.
  The audit log and the report queue are the safety net.
- Abuse is bounded by the two limits and by the fact that a board cannot delete other people's
  posts; that power stays with the global moderator role.
- There is no owner dashboard yet: renaming, archiving, and deleting an owned board are not
  implemented for either students or staff. The schema already has `isArchived`, so the screen
  is the next piece of work on this path.

**Alternatives considered.** An approval queue with an `approvalStatus` column: safer, but it
adds a state machine, a staff screen, and a waiting period for a club that wants to post a
notice today. Staff-only creation: no ownership, but one teacher becomes the bottleneck for
every club. No community boards at all: students would keep using group chats, which is exactly
what this site exists to replace.

**Revisit if.** A created board is used for harassment or spam, or if the number of boards
outgrows the sidebar. The first response is a staff-side archive action; the schema already
supports it without a migration.

---

## ADR-0022 — Search stays `LIKE` plus a published ranking, without a full-text index

**Context.** The feed's search was `contains` over titles, tags, and bodies, ordered by
`lastPostAt` and capped at 30 rows. A question from last term could fall outside those 30 matches
even when its wording was exact, which breaks the product's central promise: what you write stays
findable. The obvious fix is SQLite FTS5, but neither bundled tokenizer fits Japanese:
`unicode61` treats a run of CJK as a single token (so 数学 does not match 中間テストの数学), and
`trigram` needs three characters, so the common two-character words return nothing.

**Decision.** Keep `LIKE` for recall and move ranking and paging into the application:

- With a query, the candidate set is every visible match, capped at 500 rows for ranking, not the
  newest 30.
- `src/lib/search.ts` scores title hits (5 each, max 3), exact title (12), tag hits (3 each), and
  body hits (1 each, max 5), plus a small engagement tiebreak; ties fall back to `lastPostAt`.
- Results paginate at 20 rows with a visible match count. The plain feed keeps its 30-row reading
  surface.

**Consequences.**

- Two-character Japanese terms work, and ranking can be explained to a reader ("the title says
  数学"), which a `bm25` score cannot.
- The work is proportional to matches: `LIKE` scans the thread table and the candidate bodies are
  fetched once per request. Fine for a few thousand threads, not for hundreds of thousands.
- The weights are code, so a change to ranking is reviewable in a diff and covered by unit tests.
- The 500-row candidate cap is a deliberate ceiling: if a term matches more, the newest 500 are
  ranked. It is the first knob to raise, or to replace with FTS, before the corpus grows.

**Alternatives considered.** FTS5 with `trigram` (breaks 2-character searches), FTS5 with
`unicode61` plus a dictionary (needs a Japanese segmenter as a dependency), an external search
service (a second moving part for a school server), and no change (the promise stays broken).

**Revisit if.** The thread count passes roughly 5,000, p95 search latency passes ~300 ms, or a
search-quality complaint cannot be answered by the weight table.

---

## ADR-0023 — Rate-limit counters in SQLite, and only trust a proxy we control

**Context.** The limiter used an in-process `Map`. A restart cleared every counter, and a second
app process would keep its own. It also read the first `X-Forwarded-For` entry unconditionally,
so a client that could reach the app directly could set that header per request and never hit a
limit.

**Decision.** Counters live in a `RateLimit` table and are updated by one upsert per call:

```sql
INSERT ... ON CONFLICT(key) DO UPDATE SET count = CASE WHEN resetAt <= now THEN 1 ELSE count + 1 END
```

Expired rows are pruned on each login attempt. The client address is read from
`X-Forwarded-For` only when `TRUST_PROXY=1`. Without it, all requests share one address, so
IP-keyed limits become deliberately conservative while per-account limits (login by username,
replies, reactions) keep working.

**Consequences.**

- A restart no longer refunds an attacker's attempts, and two processes share windows.
- Every limiter call is a database write. At school traffic this is invisible; it is not a
  pattern for thousands of requests per second.
- On a directly exposed app, IP-based limits collapse into one global bucket. That is the safe
  direction, and the deployment template sets `TRUST_PROXY=1` behind Caddy, which overwrites the
  header.
- No Redis, no new service: the school keeps one SQLite file to back up.

**Alternatives considered.** Keep the in-memory map (cheap, but the two audit findings stand),
add Redis (a second service to install, secure, and back up), trust the header always (the
current vulnerability), or drop IP-keyed limits entirely (registration and login enumeration
become unbounded).

**Revisit if.** A second instance is added on a different host, or the app is exposed without a
proxy. The first needs a shared store; the second needs the proxy fixed, not the code.

---

## ADR-0024 — Administrators own board lifecycles; quiet boards archive themselves

**Context.** Moderators and administrators held identical powers (`isModerator`), so the two
roles were a label rather than a boundary. Separately, the promise that a community board is
archived after 90 days of inactivity had no implementation: `Board.isArchived` was only ever
read, never written.

**Decision.** Split the roles by scope:

- `MODERATOR` keeps day-to-day work: remove posts, lock threads, clear reports.
- `ADMIN` additionally owns the shape of the forum: archiving and restoring a board
  (`POST /api/boards/[id]/archive`).
- A daily `pnpm archive-boards` run archives every community board whose newest visible thread
  is older than `BOARD_ARCHIVE_DAYS` (default 90) and writes an audit row. `--dry-run` prints the
  changes. The moderation page shows the board list with archive/restore buttons to admins.

**Consequences.**

- A moderator cannot quietly close a club's board; the audit log records who did.
- Archiving is reversible from the UI, and every thread stays readable, so the decision is not
  destructive.
- The scheduler is cron, not an in-app timer: nothing runs if the host is down, and the run is
  visible in a log file. That matches the existing backup script.
- A board that never received a thread is never auto-archived (there is no activity timestamp to
  compare), so a new club keeps its space until it is used or an admin acts.

**Alternatives considered.** Let moderators archive too (no boundary left), archive inside the
request path (an unlucky request pays the cost), a systemd timer instead of cron (one more unit;
cron is already documented for backups), or hard-delete quiet boards (destroys history the
project exists to keep).

**Revisit if.** Clubs complain that 90 days is too short, or an administrator needs a bulk
archive for a graduating cohort. Both are configuration and a script flag away.

---

## ADR-0025 — The notification inbox is derived from existing rows

**Context.** Readers asked for an inbox in the header covering replies, comments, likes, and
saves. The obvious design is a `Notification` table written whenever one of those events happens,
which means touching five write paths, backfilling nothing existing, and accepting that the log
can drift from the rows it summarizes.

**Decision.** Derive the feed at read time. Five small queries (replies to my posts, top-level
posts in my threads, likes on my posts, likes on my threads, bookmarks of my threads) return the
newest rows each; the results are merged, sorted, and cut to 12. The only stored state is
`User.notificationsSeenAt`, set by `POST /api/notifications/seen` when the panel opens.

**Consequences.**

- No write paths changed, no backfill, and no way for the inbox to disagree with the forum:
  deleting a post removes its notifications because nothing was copied.
- Cost is five indexed queries per page render for signed-in readers. At school traffic this is
  invisible; it is the first thing to cache if a profile shows up.
- Only the newest events exist; there is no history page, no per-event read flag, and no email.
  The panel is a glance, not an archive.
- "Seen" is coarse: opening the panel clears the badge for everything up to now, including a
  notification that arrived while the panel was open (it will show on the next open).

**Alternatives considered.** A `Notification` table with per-row read flags (more precise, five
write paths, drift risk), notifications in the RSC payload only (no unread count across pages),
a third-party service (a dependency for a feature that is a few joins), and polling for new items
(no background job infrastructure yet).

**Revisit if.** Readers want per-item read state, email digests, or a "all notifications" page, or
if the derived queries become the slowest part of a page.

---

## ADR-0026 — Authors may remove their own posts, and a removal always lands somewhere visible

**Context.** Only moderators could set `isDeleted`. A student who posted a wrong answer, a typo,
or a personal detail had no self-service way out: they had to report themselves and wait. The
removal flow was also only half honest — a deleted post rendered as a placeholder, but its body
still travelled to the browser inside the RSC payload, and the redirect after deleting dropped
the reader at the top of the thread with no sign of what had changed.

**Decision.**

1. `POST /api/posts/[id]/delete` and `POST /api/threads/[id]/delete` accept the author as well as
   `MODERATOR` / `ADMIN`. The rule is one line: `isModerator(user) || authorId === user.id`.
2. A removed post renders as a localized placeholder, and its body is replaced with an empty
   string **before** the data is serialized to the client. Replies keep hanging under the
   placeholder; the body, like, reply, report, and delete controls disappear.
3. The redirect after removing a post goes to `/t/<threadId>#p-<postId>`, so the reader lands on
   the placeholder that replaced their post and the anchor flash marks it.
4. The confirmation dialog is portalled to `<body>` with the scoped theme class, the same way the
   notification panel is. Inside the comment tree it was at the mercy of an ancestor's clipping or
   containing block; from `<body>` it always covers the viewport.

**Consequences.**

- Self-service removal is instant and does not depend on a moderator being awake. The audit row
  records the actor, so moderators can still see who removed what (`post.remove`, `thread.remove`).
- Content is still soft-deleted: the row and its body remain in the database for accountability.
  The body simply never leaves the server for deleted rows.
- Removing the opening post of a thread leaves the title and replies intact, with the root rendered
  as a placeholder. Removing the whole thread is a separate action.
- A removal is not undoable from the UI; restoring takes a moderator and a database write. That is
  intentional, so "delete" means the same thing for a fourteen-year-old and for a teacher.

**Alternatives considered.** Hard delete (destroys moderation evidence), moderator-only removal
(defensible, but it teaches students to report themselves and wait), hiding deleted bodies with
CSS only (the text still reaches the browser — the version shipped first, and fixed here).

**Revisit if.** The school wants a short undo window (say 10 minutes after posting), or if
moderators find that author removal is used to erase evidence before a report is filed.

---

## ADR-0027 — Live refresh is polling plus client reconciliation, not websockets

**Context.** Two readers in one thread should see each other without reloading. The first version
polled a version probe and called `router.refresh()`, and it looked right in code — the page did
re-render — but a reply from another reader never appeared on a reader's screen, and the "new"
flash fired for nothing. Three separate mistakes produced one symptom.

1. `CommentSection` keeps its tree in `useState(initial)`. React ignores later values of that
   initial argument, so every refresh handed the component a fresh tree and it kept rendering its
   first one. Server components updated; the comments did not.
2. The probe compared creation times only, so an edit or a soft deletion (an `UPDATE`, nothing
   created) never moved it.
3. The flash waited a fixed 900 ms and then diffed ids, which missed any render slower than that.

**Decision.**

- Keep polling. `/api/pulse` returns the maximum of `Post.updatedAt`, `Thread.updatedAt`, and the
  newest like/bookmark/report row; both `Post` and `Thread` gained an `@updatedAt` column for it.
- Refresh inside `useTransition`, and apply the flash when the transition settles (with a timeout
  as a safety net for a refresh that never pends). No fixed delays in the decision path.
- Give every list item a stable id (`t-<threadId>` on cards and rows, `p-<postId>` on posts) so
  "what is new" is a set difference, not a re-render of the whole document.
- Reconcile explicitly wherever state shadows a server prop: comments adopt the refreshed tree
  while keeping comments that exist only locally, and like/save buttons adopt the server's count
  unless their own request is in flight. The reconciliation lives in `src/lib/comment-merge.ts`
  and is unit-tested, because this is the exact place that regressed.

**Consequences.**

- No new infrastructure: no websocket server, no SSE endpoint, no background worker. The cost is
  one tiny request per open tab per 12 s, and a full route refresh when something changed.
- A page sits up to 12 s behind. That is the deliberate trade for a school forum; a real-time
  requirement would need SSE and a fan-out that this deployment does not have.
- The whole route is refetched, not just the changed row. Fine at this data size; the first thing
  to revisit if a board page becomes expensive.
- Hidden tabs do not poll, and a focused text field suppresses the refresh so a draft is never
  pulled out from under the reader.

**Alternatives considered.** Websockets or SSE (real-time, but a persistent server and fan-out),
polling with a fixed delay before flashing (what we shipped first; misses slow renders), re-mounting
the comment section with `key={signature}` on every change (simpler, but drops a comment the
refresh does not happen to include yet, and loses fold state).

**Revisit if.** A page needs sub-second delivery, the refresh cost per board page grows past a few
milliseconds, or a reader complains that the 12 s lag makes a conversation feel broken.

---

## ADR-0028 — Terms of use and a name policy, because the license covers neither

**Context.** The MIT License governs the code and nothing else. It does not say what a deployment
is allowed to call itself, and it says nothing about the writing students publish. Open question
Q13 (who owns a post, and what permission the site has to show it) had been unresolved since
Phase 0, while the three published documents covered conduct, stored data, and moderation. A
reader therefore had no text granting the site permission to display what they wrote, and a fork
had no statement that the name did not travel with the code.

**Decision.** Publish `/terms` as a fourth bilingual policy document in `src/lib/policies.ts`.
It states that the author keeps copyright and grants only a non-exclusive, royalty-free permission
to store, display, back up, export, and moderate a post for the purpose of running the site, and
that the permission to display ends when the post is removed. It also declares the community
rules, the privacy notice, and the moderation policy to be part of the agreement, with the more
specific document governing its own subject. Separately, add `TRADEMARK.md` at the repository
root: the name applies to forks rather than to readers, so it belongs beside the license rather
than in the site's policy pages.

**Consequences.**

- Q13 is answered in published text that a reader can open, not only in this log.
- The terms inherit the project's rule that policy text must stay true to the code. Checking them
  exposed one such gap: the privacy notice still claimed that no IP address reached the database,
  after the rate-limit counters had moved into SQLite. That sentence was corrected in the same
  change, together with the notification timestamp and the rate-limit rows themselves.
- Each page now carries its own date (`POLICY_UPDATES`), because correcting one document must not
  move the date on the other three.
- `TRADEMARK.md` gives a fork a concrete list of strings to rename, which makes the name policy
  checkable by reading rather than by argument.
- Registration links to the terms. There is no consent checkbox yet, so acceptance is stated by
  use; a checkbox is recorded as the next step if the school's legal contact asks for one.

**Alternatives considered.** Leaving the code license as the only legal text (rejected: MIT grants
nothing about user content, so the site displayed writing it had no stated permission to display);
placing the content licence inside the privacy notice (rejected: that notice describes data
handling, and a permission grant belongs in the contract the reader accepts); publishing the terms
only in `docs/` (rejected: readers of the site never open the repository); writing a bespoke
license instead of terms plus a name policy (rejected: a custom license is neither OSI-approved nor
readable by a student, and it would not govern the school's name either).

**Revisit if.** The school's legal contact asks for explicit consent or a different governing law,
the site begins collecting something the terms do not describe, or a fork is deployed under this
name and the policy needs a remedy stronger than a request.

---

## ADR-0029 — One console, and suspension as the account-level sanction

**Context.** Moderation lived on `/moderation`: a report queue, an audit list, and (for
administrators) board archive controls. There was no account-level sanction at all — when a student
kept posting after their posts were removed, a moderator could only keep deleting. The obvious fix
is a second page for accounts and one for content, but that gives three places to remember, and the
project has repeatedly paid for duplicate entry points.

**Decision.**

- One console at `/admin`, with tabs: reports, accounts, posts, audit, and boards (administrators
  only). `/moderation` redirects there so old links and bookmarks still work.
- `User` gains `isSuspended`, `suspendedAt`, and `suspendedReason`. Suspending deletes every session
  of that account and blocks sign-in; nothing is deleted, and restore clears the three fields.
- The ladder is explicit and enforced in one place, `src/lib/admin.ts`: a moderator may suspend
  students, an administrator may suspend moderators, nobody may suspend an administrator, and
  nobody may act on their own account. Role changes are administrator-only, cannot target yourself,
  and the last administrator cannot be demoted.
- Every action writes an audit row (`user.suspend`, `user.restore`, `user.role`, plus the existing
  content actions), so the console leaves the same trail as the old queue.
- The page is deliberately plain: server-rendered tables and plain forms, no client state. It is an
  internal tool used by a handful of people; a drag-and-drop interface would be a liability.

**Consequences.**

- A single place answers "what can I do about this account, this post, this board". Moderators see
  no board controls and no role selectors, because the buttons are not rendered for them; the API
  refuses them as well, and the refusal is covered by unit tests.
- Suspension is reversible, so a mistake costs one restore instead of a lost account. There is no
  permanent deletion of an account; the closest is a suspension nobody lifts.
- A suspended person keeps their posts, which is deliberate: removing them would quietly rewrite a
  thread that other students already replied to.
- The console has no pagination-free overview of a single person's history; getting it means
  filtering the posts tab by their name. Acceptable for a school, and the audit log covers actions.

**Alternatives considered.** Separate `/admin/users` and `/admin/posts` pages (three entry points),
a ban flag with a permanent delete (destroys the record and is easy to misuse), reusing the existing
delete endpoints from the console (they redirect to the thread, which loses the operator's place).

**Revisit if.** The school wants temporary mutes with an automatic expiry, needs a per-account
history page, or a moderator ends up sharing an account with someone else.

---

## ADR-0030 — Announcements ship with the code, and previews are read-only

**Context.** Two small features, with one shared question: where does the source of truth live?
A changelog or notice fits naturally in a database table with an editor, which means a second
editor surface to build, permission to reason about, and a way for the notice to disagree with the
release it describes. The preview of a post body has the mirror-image question: does it need a
server round trip to be accurate?

**Decision.**

- Announcements and the changelog are a typed array in `src/lib/announcements.ts`, in both
  languages, with a stable `id` and an ISO date. Editing that file is part of shipping a change.
- The panel is a client component portalled to `<body>`, opened from the header beside the
  notification inbox. It is public: guests can read announcements.
- Unread state is one timestamp per account, `User.announcementsSeenAt`, written by
  `POST /api/announcements/seen` when a signed-in reader opens the panel. Guests get no dot.
- The preview is client-side only. It reads the textarea by id, renders the text exactly as the
  post will be displayed (`white-space: pre-wrap`), shows a live character count, and is
  available in the compose form, the edit form, and every reply form.

**Consequences.**

- No announcement editor, no `Announcement` table, no migration for content, and no possibility of
  a notice claiming a feature that this build does not have.
- A non-developer cannot post a notice. That is deliberate for now: the audience is the same
  handful of people who deploy the site. If the teacher advisor ever needs to post an
  announcement without a deploy, that is a new decision, not a small addition.
- The preview cannot drift from the real rendering, because both use the same whitespace rule.
  It cannot show the final thread layout (numbering, nesting), only the body.
- The edit page moved to the shared themed shell as part of this work, so the preview sits in the
  same form markup as the other two places.
- The preview itself is currently switched off (`FEATURES.postPreview`); the request moved to a feed
  excerpt, recorded in ADR-0031. The code path and its labels remain in place.

**Alternatives considered.** An `Announcement` table plus an admin tab (an editor to build, test,
and permission), a panel fed from the markdown in `docs/` (no dates on the rendered page, and the
docs are canonical in English only), a server-rendered preview endpoint (a round trip for
something the browser already has, and a second formatting implementation to keep in sync).

**Revisit if.** Someone other than a developer has to publish notices, or announcements need to
target a board or a year group instead of everyone.

---

## ADR-0031 — The feed shows the opening lines; the composer preview is parked

**Context.** A reader deciding whether to open a thread had only the title, the board, the tags, and
a reply count. The obvious addition is the first line or two of the opening post, dimmer than the
title and visible without hovering or clicking. A composer preview (showing how a drafted post will
look) was built in the same batch by mistake; it answers a different question and is not wanted
yet.

**Decision.**

- The feed cards (`/`) and rows (`/b/[slug]`, the profile's thread list) carry `excerpt` in
  `HomeThread`. It is filled by `postExcerpt` in `src/lib/excerpt.ts`: collapse every run of
  whitespace, including the ideographic space, into one space, trim, cut at 120 code points, and
  append an ellipsis. The cut is on code points, so an emoji is never split.
- A soft-deleted opening post yields an empty excerpt. Its body stays in the database so moderators
  can still read it, but printing it in the feed would put removed content back on the front page.
  The thread title and placeholder remain, per ADR-0007.
- The excerpt is rendered in the muted colour, clamped to two lines, and is plain text — not a link,
  so the title stays the only navigation target.
- The composer preview stays in the codebase but is switched off by `FEATURES.postPreview` in
  `src/lib/features.ts`. Flipping that one value restores it in all three forms.

**Consequences.**

- Reading the feed now costs one extra column per row (`posts take 1`), not a second query per
  thread. Thirty rows on the home page, twenty on a board page.
- A post whose body starts with a blank line shows the next line, because whitespace is collapsed
  before the cut. A body that is only whitespace has no excerpt and the element is not rendered.
- The preview is not dead code: it is tested by hand-verified paths and stays type-checked and
  linted, so reviving it is a one-line change rather than an archaeology exercise.
- The excerpt is text, not a summary. It can end mid-sentence, which is the honest behaviour for a
  preview of exactly what is in the post.

**Alternatives considered.** A generated summary (an extra dependency and a lie about what the body
says), a per-thread query for the opening post (N+1), showing the excerpt only on hover (the request
was explicitly without interaction), deleting the composer preview (it works and may be wanted).

**Revisit if.** The opening line is consistently a greeting that says nothing ("はじめまして"), in
which case the excerpt should start after the first paragraph break, or if the feed becomes expensive
enough that the extra column matters.

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
