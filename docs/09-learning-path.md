# Learning Path

> 日本語版: [日本語](ja/09-learning-path.md)

This project is meant to be buildable by a student who has written some JavaScript but has never
deployed a web application. The path below turns the codebase into a sequence of small,
verifiable exercises. Each week has a deliverable you can commit and a test you can perform.

## 1. The mental model

Before touching the code, hold this picture:

```text
Browser ──HTTP request──► Next.js server ──query──► SQLite
   ▲                                                   │
   └──────────── HTML response ◄──────── render ◄──────┘
```

- **HTTP** is the language the browser and server speak: a method (`GET`, `POST`), a path, headers,
  and a body.
- **GET** asks for something. It must not change data.
- **POST** submits something. In this project it always ends with a redirect.
- The server is a Node.js process running the Next.js application. It is the only thing that can
  read or write the database.
- **SQLite** is a database stored as a single file. There is no separate database server.
- **Prisma** is the library that turns TypeScript calls into SQL and returns typed objects.

If a page looks wrong, decide first which of the four boxes failed. Reading the server terminal
and the browser network tab answers that question faster than guessing.

## 2. Six-week plan

Assumes 6–8 hours per week. Do the weeks in order; do not start deployment before the database
week.

### Week 1 — Run it, change one thing

Goals: terminal confidence, HTTP basics, HTML/CSS.

1. Install Node.js 22 and pnpm.
2. Follow the README quick start until the home page loads.
3. In `prisma/seed.ts`, change one board description. Run `pnpm db:seed` again and observe that
   the board is updated, not duplicated.
4. In `src/app/page.tsx`, change the hero heading. Run `pnpm dev` and refresh.

**Deliverable:** one commit changing copy in the hero and a board description.
**Check:** you can explain why `pnpm db:seed` upserts boards but skips threads when threads exist.

### Week 2 — Components and styling

Goals: React components, props, Tailwind utilities.

1. Read the JSX in `src/app/page.tsx` and `src/components/site-header.tsx`.
2. Extract the "recent thread row" into `src/components/thread-row.tsx` and pass the thread as a
   prop.
3. Change the color of the pinned badge in both places; confirm one edit changes both.

**Deliverable:** the extracted component, used by the home page.
**Check:** no duplicated post-row markup remains.

### Week 3 — Routing and server rendering

Goals: App Router, dynamic segments, server components, `params`.

1. `/rules` already exists, so do not build it again. Open the page and note that it is a server
   component that reads the locale cookie. Then open `src/app/bookmarks/page.tsx`: it is not a
   page at all but a redirect to `/?filter=saved`. Add the same kind of redirect from `/help` to
   `/rules`.
2. Open `/b/general` and `/t/<any-id>`. Find where `params` is awaited in
   `src/app/b/[slug]/page.tsx`.
3. Add the board's thread count to the thread page breadcrumb using the existing query.
4. The site opens in Japanese. Switch the header toggle to EN, then confirm that `<html lang>`
   and the dates change, and switch back. Add one new string to both dictionaries in
   `src/lib/locales.ts` and see the parity test fail until both exist.

**Deliverable:** the `/help` redirect and the updated breadcrumb.
**Check:** a guest who opens `/help` ends on `/rules`, and the address bar shows `/rules`.

### Week 4 — Database and migrations

Goals: SQL basics, Prisma schema, migrations, transactions.

1. Open `prisma/schema.prisma` and draw the tables on paper. Compare with `docs/03-data-model.md`.
2. Exercise: add `viewCount Int @default(0)` to `Thread`, run
   `pnpm exec prisma migrate dev --name add_thread_view_count`, and increment it when a thread is
   opened. Display the count on the thread page.
3. Inspect the generated SQL under `prisma/migrations/`.

**Deliverable:** the migration, the increment, and the displayed count.
**Check:** opening the same thread twice increases the count by two, and no other field changes.

> Write path note: incrementing on every view makes every read a write. For a real feature,
> debounce or batch it. The exercise is about migrations, not about shipping a view counter.

### Week 5 — Authentication, sessions, and security

Goals: password hashing, cookies, sessions, authorization, CSRF, validation.

1. Trace one login: form → `/api/auth/login` → `verifyPassword` → `createSession` → `Set-Cookie`.
2. Inspect the cookie in the browser: confirm `HttpOnly` is set and JavaScript cannot read it.
3. Try to reach `/moderation` as the `student` account. Then try `curl -X POST` against
   `/api/posts/<id>/delete` with the student cookie — confirm the server rejects it, not just
   the hidden button.
4. Send a POST with `Origin: https://evil.example` and observe the 403.
5. Add a unit test for `validateTitle` and `safeNextPath` using Node's built-in test runner or
   Vitest. Cover `//evil.example` and an empty title.

**Deliverable:** tests for validation plus notes on the login trace.
**Check:** you can explain why storing `SHA-256(token)` instead of the token protects sessions,
and why `scrypt` is not encryption.

### Week 6 — Deploy and operate

Goals: production build, HTTPS, backups, monitoring.

1. Follow `docs/07-operations.md` on a VPS or a local virtual machine.
2. Get the site behind HTTPS.
3. Install the backup script, run it manually, and perform a restore drill.
4. Break something on purpose (stop the service) and use the runbook to recover.

**Deliverable:** a working HTTPS URL and one successful restore.
**Check:** you can answer "where is the database file, and where is last night's backup?"

## 3. Glossary

Definitions are written to be testable: each says what counts and what does not.

**BBS (bulletin board system).** A website where users publish messages organized into boards
and threads, and where messages persist and remain addressable by URL. A group chat is not a
BBS: messages are not organized by topic and are not reliably findable later.

**Board.** A named category that contains threads and has a stable URL slug (for example
`/b/study`). A board is not a thread; it has no posts of its own.

**Thread.** One titled discussion inside a board, consisting of an opening post followed by
replies in chronological order. A thread is identified by a stable id (`/t/<id>`).

**Post.** One block of plain text written by one account at one time, belonging to exactly one
thread. The opening post is a post like any other.

**HTTP request.** A message from a client containing a method, a target path, headers, and an
optional body. **Response:** a status code, headers, and an optional body.

**Cookie.** A small name/value pair the server asks the browser to store and send back on later
requests to the same site. Cookies are not encrypted by the browser; treat their contents as
readable unless the server encrypts them.

**Session.** Server-side state associated with a cookie. In this project a session is a database
row whose primary key is the hash of a random token. Deleting the row logs the user out
everywhere that token is used.

**Hash.** A one-way function: the same input always produces the same fixed-length output, and
the output cannot be reversed to the input. Passwords and session tokens are hashed, never
encrypted. **Encryption** is reversible with a key; hashing is not.

**ORM (object-relational mapper).** A library that maps database rows to objects and generates
SQL from method calls. Prisma is the ORM here.

**Migration.** A versioned, committed SQL change to the database schema. `migrate dev` creates
one during development; `migrate deploy` applies pending migrations in production.

**Server component.** A React component that runs only on the server and can read the database
directly. It cannot use browser APIs or event handlers. Most components in this project are
server components.

**Client component.** A component marked `"use client"` that runs in the browser (and is
prerendered on the server). None are required for the MVP.

**Route handler.** A function exported from `route.ts` that receives a `Request` and returns a
`Response`. All writes in this project go through route handlers.

**CSRF (cross-site request forgery).** An attack where another site makes the user's browser send
an authenticated request. Defenses here: `SameSite=Lax` cookies and an `Origin` check.

**XSS (cross-site scripting).** Injecting executable script into a page. This project renders
plain text through React, which escapes it, and never uses `dangerouslySetInnerHTML`.

**Soft delete.** Marking a row as removed (`isDeleted = true`) while keeping it in the database,
so moderation is reversible and auditable. The opposite is a hard delete.

**Seed.** A script that inserts development data. Seeds must be idempotent where possible and
must never be run against production with demo accounts.

**Deployment.** Making the application reachable at a stable address with a production build,
persistent storage, TLS, and a process manager. Running `pnpm dev` on your laptop is not a
deployment.

**Like.** A lightweight signal that a reader found a post useful. A like is one row per user
and post; the displayed count is a denormalized total.

**Bookmark.** A private save of a thread for later reading. Bookmarks are visible only to their
owner and fill the `Saved` filter of the feed (`/bookmarks` redirects there).

**Hashtag.** A `#word` inside a title or reply. Hashtags are normalized and attached to the whole
thread; they are not a separate field.

**Rate limit.** A per-key counter that allows a fixed number of actions per time window. This
project keeps the counters in memory, so a restart clears them.

**Audit log.** An append-only record of moderation actions: actor, action, target, and time.
It answers "who removed this, and when" without relying on memory.

**Sensitive-word flag.** A queue entry created when a post matches the word lists. It is advisory;
a human moderator still decides.

**Hot score.** The transparent popularity formula `likes × 3 + bookmarks × 2 + replies +
recency`. It ranks search and board results without tracking views.

**Locale.** The language used for interface text and formatting, stored in the `locale` cookie
as `en` or `ja`. A locale changes UI strings, dates, and number formatting; it never translates
user-written content.

**PII.** See `docs/06-safety-and-moderation.md`, section 2. The test is reasonable
identifiability, not the presence of a name.

## 4. Debugging playbook

| Symptom | First check | Likely cause |
| --- | --- | --- |
| 500 on every page | Server terminal, `journalctl -u toyooka-bbs` | Database missing, `DATABASE_URL` wrong, unhandled query |
| "Table does not exist" | `pnpm db:push` or `migrate deploy` | Schema not applied |
| Styles missing | Browser network tab for a `.css` 404 | Build not rerun, or Tailwind class typo |
| Login succeeds but header still shows "Log in" | Cookie domain/`Secure`/`SameSite` | Serving over HTTP while `COOKIE_SECURE=true` |
| Redirect loop on `/login` | `getCurrentUser` and cookie state | Stale cookie pointing to a missing session |
| `database is locked` | Long-running `prisma studio`, backup, or stuck request | Concurrent write; see runbook |
| Form submits, nothing changes | Network tab: status and `Location` | Validation redirect with an error code |

## 5. Resources

- MDN Web Docs — HTTP, cookies, forms, the DOM.
- The Next.js documentation shipped with the installed version:
  `node_modules/next/dist/docs/`. Read the App Router, route handlers, and cookies pages before
  upgrading.
- Prisma documentation — schema, migrations, transactions.
- SQLBolt — interactive SQL basics.
- OWASP Cheat Sheet Series — session management, CSRF, XSS, password storage.
- web.dev — accessibility and performance basics.

## 6. Working with AI assistants

Use an assistant to explain, not to decide.

- Ask for a trace of an existing flow before asking for new code.
- Require the assistant to cite the file and line it is changing.
- After any change, run `pnpm lint` and `pnpm build` yourself.
- Never paste production secrets, student data, or database dumps into a chat.
- For security-sensitive changes, ask for the attack scenario, not just the fix.

The habit that matters: every generated change must be explainable by you in one sentence, or it
does not get committed.
