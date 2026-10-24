# Routes and Form Endpoints

> 日本語版: [日本語](ja/04-routes-and-api.md)

These endpoints exist to serve the HTML forms in this application. They are **not** a versioned
public API. A future mobile client would need a JSON API with explicit versioning.

## 1. Pages

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero, eight newest threads, board list, posting rules |
| `/b/[slug]` | Public | Visible threads in a board, 20 per page; pinned first, then by activity or popularity |
| `/t/[id]` | Public | Thread with all posts, reply form, report controls |
| `/t/[id]/edit` | Author | Edit the title, opening post, and tags within 15 minutes of posting |
| `/t/[id]/export` | Public | Download the thread as a plain-text file |
| `/u/[username]` | Public | Profile: join date, visible thread/post counts, recent threads and posts |
| `/new` | Signed-in | Create a thread; guests are redirected to `/login?next=/new` |
| `/login` | Public | Login form; redirects signed-in users away |
| `/register` | Public | Registration form; first account becomes `ADMIN` |
| `/bookmarks` | Signed-in | Threads the signed-in user saved |
| `/search` | Public | Search title/body, filter by tag, sort newest or popular |
| `/moderation` | Moderator / Admin | Open reports, automatic flags, and the recent audit log |
| `/rules` | Public | Community rules, in the current interface language |
| `/privacy` | Public | Privacy notice: stored data, cookies, retention, access |
| `/moderation-policy` | Public | How reports, automatic flags, appeals, and escalation work |
| `/health` | Public | JSON readiness check: `{"status":"ok","database":"ok"}`, or 503 |
| any unknown path | Public | Custom 404 |

All pages are server-rendered per request. There is no client-side data fetching.

### Rate limits

All limits are in-process fixed windows, keyed by IP or account. The defaults are deliberately
generous because a class can share one school IP:

| Action | Default limit |
| --- | --- |
| Login | 10 attempts / 10 min per IP + username |
| Registration | 60 / hour per IP |
| New thread | 10 / hour per account |
| Reply | 60 / hour per account |
| Report | 30 / day per account |
| Like / bookmark | 300 / hour per account |

A successful login clears that IP + username bucket, so a mistyped password followed by the
correct one does not count toward a lockout. A blocked form submission redirects with
`error=rate-limited`; `Retry-After` is not exposed because the responses are redirects, not API
responses. A restart clears the counters.

Each pair is overridable without a code change: `RATE_LIMIT_<NAME>_LIMIT` and
`RATE_LIMIT_<NAME>_WINDOW_MIN`, where `<NAME>` is `LOGIN`, `REGISTER`, `THREAD`, `REPLY`,
`REPORT`, `LIKE`, or `BOOKMARK`. For example, `RATE_LIMIT_LOGIN_LIMIT=5` and
`RATE_LIMIT_LOGIN_WINDOW_MIN=10` restore the old login limit. See
`docs/07-operations.md`, section 2.

### Search and sorting

`/search` accepts `q` (≤ 100 chars), `tag` (normalized lowercase), and `sort=latest|hot`.
`q` matches a thread title or any visible reply body with a `contains` comparison; results are
capped at 100. `hot` sorts by `likes × 3 + bookmarks × 2 + replies + recency`, where recency adds
up to 3 points for activity in the last 72 hours. Board pages accept the same `sort` parameter and `page` (1-based). The page size is 20. `page`
is clamped to the last page; page 1 is the canonical URL without `?page=1`. With `sort=hot`, the
ranking is computed over the top 100 candidates and then split into pages.

The policy pages are static bilingual content from `src/lib/policies.ts`; their wording is code,
so both languages change in the same commit. The advisor still has to approve that wording before
launch.

## 2. Mutation endpoints

All endpoints accept `application/x-www-form-urlencoded` or `multipart/form-data` (standard
HTML form encoding), reject cross-origin `Origin` headers, and respond with `303 See Other` on
success so the browser performs a `GET`.

### `POST /api/auth/register`

| Field | Required | Rules |
| --- | --- | --- |
| `username` | yes | 3–20 chars, `[A-Za-z0-9_]`, lowercased |
| `email` | no | Valid address, ≤ 254 chars, unique |
| `password` | yes | 10–200 chars, not trimmed |
| `next` | no | Same-site path only |

- Success: sets the session cookie, redirects to `next` or `/`.
- Failure: redirects to `/register?error=<code>`; password is never echoed.
- Codes: `invalid-input`, `username-taken`, `email-taken`.

### `POST /api/auth/login`

| Field | Required |
| --- | --- |
| `username` | yes |
| `password` | yes |
| `next` | no |

- Success: session cookie, redirect to `next` or `/`.
- Failure: `/login?error=invalid-credentials` (same message for unknown user and wrong password).
- Rate limited after 10 attempts per IP + username in 10 minutes (`error=rate-limited`); a
  successful login clears the counter.

### `POST /api/auth/logout`

- Deletes the session row if a valid cookie exists, clears the cookie, redirects to
  `/?notice=signed-out`.

### `POST /api/locale`

| Field | Required | Values |
| --- | --- | --- |
| `locale` | yes | `en` or `ja` |

- The interface is Japanese until a reader chooses otherwise. Sets the one-year `locale`
  cookie and redirects back to the referring page on the same host, or to `/` when there is no
  usable `Referer`.
- Unknown values are ignored; the current page is still reloaded.

### `POST /api/threads`

| Field | Required | Rules |
| --- | --- | --- |
| `boardId` | yes | Existing, non-archived board |
| `title` | yes | 3–120 chars |
| `body` | yes | 1–10,000 chars |
| `tags` | no | Space- or comma-separated, leading `#` optional, max 5 |

- Auth: signed-in user.
- Success: creates `Thread` + opening `Post` atomically, redirects to `/t/<id>`.
- Failure: `/new?board=<slug>&error=<code>`.
- Codes: `board-not-found`, `invalid-input`, `login-required`.

### `POST /api/threads/[id]/posts`

| Field | Required | Rules |
| --- | --- | --- |
| `body` | yes | 1–10,000 chars |
| `tags` | no | Space- or comma-separated, leading `#` optional, max 5 |

- Auth: signed-in user.
- Preconditions: thread exists, not deleted, not locked.
- Success: inserts `Post` and updates `Thread.lastPostAt` in one transaction, redirects to
  `/t/<id>#p-<postId>`.
- Failure codes: `thread-locked`, `invalid-input`, `thread-not-found`.

### `POST /api/threads/[id]/edit`

| Field | Required | Rules |
| --- | --- | --- |
| `title` | yes | 3–120 chars |
| `body` | yes | 1–10,000 chars; replaces the opening post |
| `tags` | no | Same rules as thread creation; replaces the current tag set |

- Auth: the thread author only, within 15 minutes of `Thread.createdAt`.
- Preconditions: thread exists, not deleted, not locked.
- Success: updates the title and opening post, sets `Thread.editedAt`, replaces tags, and
  redirects to `/t/<id>?notice=thread-edited`.
- Sensitive-word matches on the edited text create one open `AUTO` report if none exists.
- Failure codes: `edit-not-allowed`, `invalid-input`, `not-found`.

### `POST /api/threads/[id]/lock`

- Auth: `MODERATOR` or `ADMIN`. No body.
- Toggles `isLocked` and redirects back to the thread.
- Failure codes: `forbidden`, `thread-not-found`.

### `POST /api/threads/[id]/delete`

- Auth: `MODERATOR` or `ADMIN`. No body.
- Sets `isDeleted = true` and redirects to the board.
- Failure codes: `forbidden`, `thread-not-found`.

### `POST /api/posts/[id]/delete`

- Auth: `MODERATOR` or `ADMIN`. No body.
- Sets `isDeleted = true` and redirects to the thread. The post stays visible as a placeholder.
- Failure codes: `forbidden`, `not-found`.

### `POST /api/posts/[id]/like`

- Auth: signed-in user. No body.
- Toggles one like per user and post, updating `Post.likeCount` and the thread's total
  `Thread.likeCount` in one transaction.
- Redirects back to `/t/<threadId>#p-<postId>`.
- When the request sends `Accept: application/json`, answers `{active, count}` instead of
  redirecting (429 when rate-limited). The HTML form remains the no-JavaScript fallback.

### `POST /api/threads/[id]/bookmark`

- Auth: signed-in user. No body.
- Toggles one bookmark per user and thread, updating `Thread.bookmarkCount`.
- Redirects to the referring page on the same host, or the thread page.
- With `Accept: application/json`, answers `{active, count}` instead (429 when rate-limited).

### `POST /api/reports`

| Field | Required | Rules |
| --- | --- | --- |
| `postId` | yes | Existing post |
| `reason` | yes | 3–500 chars |

- Auth: signed-in user.
- Success: creates a `Report`, redirects to the thread with `?notice=reported`.
- Failure code: `report-invalid`.

### `POST /api/reports/[id]/resolve`

| Field | Required | Values |
| --- | --- | --- |
| `action` | yes | `remove` or `dismiss` |

- Auth: `MODERATOR` or `ADMIN`.
- `remove`: soft-deletes the reported post and marks the report `removed`.
- `dismiss`: leaves the post and marks the report `dismissed`.
- Redirects to `/moderation` in both cases.

### Unread markers

`/`, `/b/[slug]`, and `/t/[id]` read `ThreadRead` for the signed-in user. A thread is shown as
"New" when it has no read row or when `Thread.lastPostAt` is newer than `lastReadAt`. Rendering a
thread page upserts the row with the current time. Guests have no read state, so no badge is
shown; the write is idempotent and stores only a timestamp.

## 3. Error handling

There is no JSON error format. User-facing failures redirect back to the relevant page with a
short code in the query string; `src/lib/messages.ts` maps codes to English sentences. Unknown
codes fall back to a generic "check the form" message, so a hand-crafted URL cannot inject text
into the page.

Automatic flags appear in `/moderation` with the `AUTO` source and the matched terms. They do not
hide or block the post; a moderator decides.

Unexpected failures (database down, unhandled exception) return a 500 from Next.js. Add error
monitoring before launch; see `docs/07-operations.md`.

## 4. Cookies

| Attribute | Value | Reason |
| --- | --- | --- |
| Name | `toyooka_session` | |
| Value | 64 hex chars (32 random bytes) | 256 bits of entropy |
| `HttpOnly` | true | JavaScript cannot read it |
| `SameSite` | `Lax` | Blocks most cross-site form posts |
| `Secure` | true in production | Requires HTTPS |
| `Path` | `/` | |
| `Expires` | 30 days | |

A second cookie, `locale`, stores the interface language (`en` or `ja`) for one year. When it
is absent, the interface is Japanese. It is `HttpOnly` and `SameSite=Lax` as well. It carries no
identity and is safe to clear.

`COOKIE_SECURE=false` exists only for a plain-HTTP school LAN. Do not use it on the public
internet.

## 5. CSRF and origin checks

`SameSite=Lax` already blocks cross-site POSTs from setting cookies. As defence in depth, every
POST handler calls `isSameOrigin()` and rejects when the `Origin` header names a different host.
Requests without an `Origin` header (curl, some privacy tools) are allowed; an attacker cannot
make a browser omit it for a cross-site form post.

## 6. Caching

No endpoint is cached. Pages are dynamic. Responses must not be cached by a CDN in front of the
app, because they include the signed-in user's name in the header.
