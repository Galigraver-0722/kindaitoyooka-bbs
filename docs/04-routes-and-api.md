# Routes and Form Endpoints

> 日本語版: [日本語](ja/04-routes-and-api.md)

These endpoints exist to serve the HTML forms in this application. They are **not** a versioned
public API. A future mobile client would need a JSON API with explicit versioning.

## 1. Pages

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero, eight newest threads, board list, posting rules |
| `/b/[slug]` | Public | All visible threads in a board, pinned first, then by activity |
| `/t/[id]` | Public | Thread with all posts, reply form, report controls |
| `/new` | Signed-in | Create a thread; guests are redirected to `/login?next=/new` |
| `/login` | Public | Login form; redirects signed-in users away |
| `/register` | Public | Registration form; first account becomes `ADMIN` |
| `/moderation` | Moderator / Admin | Open reports; others are redirected |
| any unknown path | Public | Custom 404 |

All pages are server-rendered per request. There is no client-side data fetching.

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
- There is no lockout or rate limit yet. Add one before public launch.

### `POST /api/auth/logout`

- Deletes the session row if a valid cookie exists, clears the cookie, redirects to
  `/?notice=signed-out`.

### `POST /api/locale`

| Field | Required | Values |
| --- | --- | --- |
| `locale` | yes | `en` or `ja` |

- Sets the one-year `locale` cookie and redirects back to the referring page on the same host,
  or to `/` when there is no usable `Referer`.
- Unknown values are ignored; the current page is still reloaded.

### `POST /api/threads`

| Field | Required | Rules |
| --- | --- | --- |
| `boardId` | yes | Existing, non-archived board |
| `title` | yes | 3–120 chars |
| `body` | yes | 1–10,000 chars |

- Auth: signed-in user.
- Success: creates `Thread` + opening `Post` atomically, redirects to `/t/<id>`.
- Failure: `/new?board=<slug>&error=<code>`.
- Codes: `board-not-found`, `invalid-input`, `login-required`.

### `POST /api/threads/[id]/posts`

| Field | Required | Rules |
| --- | --- | --- |
| `body` | yes | 1–10,000 chars |

- Auth: signed-in user.
- Preconditions: thread exists, not deleted, not locked.
- Success: inserts `Post` and updates `Thread.lastPostAt` in one transaction, redirects to
  `/t/<id>#p-<postId>`.
- Failure codes: `thread-locked`, `invalid-input`, `thread-not-found`.

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

## 3. Error handling

There is no JSON error format. User-facing failures redirect back to the relevant page with a
short code in the query string; `src/lib/messages.ts` maps codes to English sentences. Unknown
codes fall back to a generic "check the form" message, so a hand-crafted URL cannot inject text
into the page.

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

A second cookie, `locale`, stores the interface language (`en` or `ja`) for one year. It is
`HttpOnly` and `SameSite=Lax` as well. It carries no identity and is safe to clear.

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
