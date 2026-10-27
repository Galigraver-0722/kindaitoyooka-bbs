# Routes and Form Endpoints

> 日本語版: [日本語](ja/04-routes-and-api.md)

These endpoints exist to serve the HTML forms in this application. They are **not** a versioned
public API. A future mobile client would need a JSON API with explicit versioning.

## 1. Pages

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | The one cross-board feed. `sort=latest\|hot\|rising`, `filter=all\|saved\|mine`, `q` search over titles, bodies, and tags; 30 threads without a query, 20 rows per page with one |
| `/b/[slug]` | Public | Board home: identity banner with thread, member, post, and last-activity counts, then the board's threads 20 per page; pinned first, then by activity, popularity, or rising |
| `/boards` | Public | Redirects to `/`; the board list lives in the sidebar and the mobile drawer |
| `/boards/new` | Signed-in | Create a community board. Three owned boards per account, five per hour, slug taken from the form |
| `/t/[id]` | Public | Thread with all posts in a numbered tree, reply form, reaction controls |
| `/t/[id]/edit` | Author | Edit the title, opening post, and tags within 15 minutes of posting |
| `/t/[id]/export` | Public | Download the thread as a plain-text file |
| `/u/[username]` | Public | Profile: identity banner, four counts (threads, posts, likes received, join date), recent threads and recent replies as two tabs |
| `/new` | Signed-in | Create a thread; guests are redirected to `/login?next=/new` |
| `/login` | Public | Login form; redirects signed-in users away |
| `/register` | Public | Registration form; first account becomes `ADMIN` |
| `/threads` | Public | Redirects to `/`, keeping `q`, `filter`, and `sort` |
| `/search` | Public | Redirects to `/` with `q`; `tag` becomes a `#tag` query |
| `/bookmarks` | Signed-in | Redirects to `/?filter=saved` |
| any signed-in page | Signed-in | The header shows a notification inbox (replies, comments, likes, saves) with an unread count; every item links to a specific post (`#p-<id>`), including thread-level likes and saves, which point at the opening post |
| `/admin` | Moderator / Admin | The console: open reports (10 per page), accounts (search, suspend/restore, role changes for administrators), posts and threads (search, lock, remove), the audit log, and — for administrators — student-board archive controls. `tab=reports\|users\|content\|audit\|boards` |
| `/moderation` | Moderator / Admin | Redirects to `/admin?tab=reports`; the queue used to live here |
| `/terms` | Public | Terms of use: who may use the site, the permission a post grants, what the operators may do, and what is not promised. Declares the other three documents part of the agreement |
| `/rules` | Public | Community rules, in the current interface language |
| `/privacy` | Public | Privacy notice: stored data, cookies, retention, access |
| `/moderation-policy` | Public | How reports, automatic flags, appeals, and escalation work |
| `/health` | Public | JSON readiness check: `{"status":"ok","database":"ok"}`, or 503 |
| any unknown path | Public | Custom 404 |

All pages are server-rendered per request. There is no client-side data fetching.

### Rate limits

All limits are fixed windows kept in SQLite, so a restart does not refund an attacker and two
processes share one window. A window is keyed by account, and by client address only when the
deployment runs behind a proxy that sets `TRUST_PROXY=1`; a direct client can send any address it
likes. The defaults are deliberately generous because a class can share one school IP:

| Action | Default limit |
| --- | --- |
| Login | 10 attempts / 10 min per IP + username |
| Registration | 60 / hour per IP |
| New thread | 10 / hour per account |
| Reply | 60 / hour per account |
| Report | 30 / day per account |
| Like / bookmark | 300 / hour per account |
| New board | 5 / hour per account, three owned boards |

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

The feed (`/`) is the only list: it takes `q` (≤ 100 chars), `filter=all|saved|mine`, and
`sort=latest|hot|rising`. `q` matches a thread title, any visible post body, or a tag with a
`contains` comparison; a query that starts with `#` matches tags first. `saved` and `mine`
require a signed-in user; guests see a login prompt instead of an empty list.

Without a query the feed is a reading surface: `latest` shows the 30 most recent threads, and
`hot`/`rising` rank the 100 newest and cut to 30.

With a query the feed is a search engine:

- Candidate set: every visible thread matching the term, capped at 500 rows pulled for ranking.
  The 30-row reading limit does not apply, so a thread from last term stays findable.
- Ranking happens in the application (`src/lib/search.ts`) with published weights: title hit 5
  each (max 3), exact title 12 bonus, tag hit 3 each, body hit 1 each (max 5), plus a small
  engagement tiebreak; ties fall back to `lastPostAt`.
- `sort=latest` keeps the relevance order; `hot` and `rising` reorder the same candidate set.
- Results paginate at 20 rows (`page`, 1-based, clamped), and the heading shows the match count.
  Page 1 is canonical without `?page=1`.
- The term is marked (`<mark class="hl">`) in result titles and tag chips, and every result link
  carries `?q=` on to the thread, where the opening post and replies mark the same term. A link
  with `#p-<id>` flashes that post for ~2 s so the reader can see where they landed.

Board pages accept the same `sort` values plus `page` (1-based). The page size is 20. `page` is
clamped to the last page; page 1 is the canonical URL without `?page=1`. With `sort=hot` or
`sort=rising`, the ranking is computed over the top 100 candidates and then split into pages.

The deliberate trade-off: this is `LIKE` plus in-app ranking, not SQLite FTS. It keeps Japanese
two-character terms working (a trigram index would not) and stays within budget at this scale.
The candidate cap and the weight table are the two knobs to revisit first; ADR-0022 records the
reasoning.

`/threads`, `/search`, and `/bookmarks` are redirects that keep their old query parameters, so a
link shared before the feed was consolidated still lands on the right filter.

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
- A suspended account is rejected after the password check with `error=suspended`; somebody
  guessing without the password still sees `invalid-credentials`.
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

### `POST /api/boards`

| Field | Required | Rules |
| --- | --- | --- |
| `name` | yes | 2–30 chars, shown as-is |
| `slug` | yes | 3–30 chars, `^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$`, lowercased, not reserved, unique |
| `description` | yes | 2–200 chars |
| `tags` | no | Space- or comma-separated, max 8; suggested tags for new threads |

- Auth: signed-in user. Guests are redirected to `/login?next=/boards/new`.
- Success: creates a `COMMUNITY` board owned by the caller and redirects to `/b/<slug>`.
- Limits: three owned boards per account, five creations per hour per account.
- Failure: `/boards/new?error=<code>`; codes `invalid-slug`, `slug-taken`, `invalid-input`,
  `rate-limited`, `board-limit`.

### `POST /api/profile`

| Field | Required | Rules |
| --- | --- | --- |
| `bio` | no | ≤ 200 chars, trimmed; empty clears it |
| `avatarColor` | no | `#rrggbb`; anything else resets to the default palette |
| `avatarRing` | no | `#rrggbb`; same fallback |

- Auth: signed-in user; saves only the caller's own profile.
- Success: redirects to `/u/<username>?notice=profile-saved`.
- Avatar text colour is derived from the background by luminance, so no colour field is stored
  for it.

### `POST /api/notifications/seen`

- Auth: signed-in user. No body.
- Sets `User.notificationsSeenAt` to now, which clears the unread badge. The events themselves
  are derived, so nothing is created or deleted.
- Opening an item always moves the reader: a link to another page navigates, and a link to the
  page already open sets the hash, scrolls the post into view, and flashes it (Next's router treats
  a push to the current path as a no-op, so the panel does this by hand).
- `Accept: application/json` answers `{ok:true}` (401 for a guest); otherwise redirects to `/`.

### `GET /api/pulse`

- Auth: none. Returns one number: `{at}`.
- `at` is the newest moment anything a reader could be looking at changed — `Post.updatedAt`,
  `Thread.updatedAt`, the newest thread like, post like, bookmark, and report.
- Edits and soft deletions have to move this number too, so the probe watches `updatedAt` rather
  than creation time. Watching only "newest row" left a thread page stale after a moderator
  removed a post, because nothing was created.
- `AutoRefresh` polls it every 12 s while the tab is visible and no text field has focus, then
  refreshes the route in a transition and flashes the elements whose ids were not on screen before.

### `POST /api/boards/[id]/archive`

| Field | Required | Values |
| --- | --- | --- |
| `action` | yes | `archive` or `restore` |

- Auth: `ADMIN` only. Moderators get `/moderation?error=forbidden`, because closing a club's
  board is a site-level decision rather than day-to-day moderation.
- Success: flips `Board.isArchived`, writes an audit row (`board.archive` / `board.restore`),
  and redirects to `/moderation?notice=board-archived` (or `board-restored`).
- The daily `pnpm archive-boards` run performs the same change automatically for community
  boards quiet for `BOARD_ARCHIVE_DAYS` days.

### `POST /api/threads/[id]/posts`

| Field | Required | Rules |
| --- | --- | --- |
| `body` | yes | 1–10,000 chars |
| `tags` | no | Space- or comma-separated, leading `#` optional, max 5 |

- Auth: signed-in user.
- Preconditions: thread exists, not deleted, not locked.
- Success: inserts `Post` and updates `Thread.lastPostAt` in one transaction, redirects to
  `/t/<id>#p-<postId>`.
- With `Accept: application/json`, answers `{comment}` — the new post in the shape the comment
  tree renders, including its localized timestamp — instead of redirecting, and `401` for a
  guest. The reply form uses it to insert the post without a full page load.
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

- Auth: the thread author, or `MODERATOR` / `ADMIN`. No body.
- Sets `isDeleted = true` and redirects to the board.
- Failure codes: `forbidden`, `thread-not-found`.

### `POST /api/posts/[id]/delete`

- Auth: the post author, or `MODERATOR` / `ADMIN`. No body.
- Sets `isDeleted = true` and redirects to `/t/<threadId>#p-<postId>`. The anchor matters: the
  reader lands on the placeholder that replaced the post instead of being sent back to the top of
  the thread, so the click always produces a visible result.
- The post stays visible as a localized placeholder, but its body is removed both from the
  rendered page and from the RSC payload sent to the browser — "deleted" is not just hidden by
  CSS. Replies keep hanging under the placeholder and stay readable.
- Failure codes: `forbidden`, `not-found`.

### `POST /api/posts/[id]/like`

- Auth: signed-in user. No body.
- Toggles one like per user and post, updating `Post.likeCount` only. `Thread.likeCount` counts
  likes on the opening post, so liking a reply never changes the thread total.
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
- One open report per reader and post: a second submission redirects with
  `?notice=already-reported` and creates no row. The partial unique index
  `Report_one_open_per_reporter_post` is the race-condition backstop.
- Failure code: `report-invalid`.

### `POST /api/reports/[id]/resolve`

| Field | Required | Values |
| --- | --- | --- |
| `action` | yes | `remove` or `dismiss` |

- Auth: `MODERATOR` or `ADMIN`.
- `remove`: soft-deletes the reported post and marks the report `removed`.
- `dismiss`: leaves the post and marks the report `dismissed`.
- Redirects to `/moderation` in both cases.

### Console endpoints

All six require a signed-in moderator (`MODERATOR` or `ADMIN`), check the origin like every other
mutation, and redirect back to `/admin` with a `notice` or `error` code. The rules behind them live
in `src/lib/admin.ts` and are unit-tested.

| Endpoint | Body | Who | Effect |
| --- | --- | --- | --- |
| `POST /api/admin/users/[id]/suspend` | `reason` (optional, ≤ 200) | Moderator for students; admin for moderators | Sets `isSuspended`, stamps the reason, deletes every session of that user, writes `user.suspend` |
| `POST /api/admin/users/[id]/restore` | — | Same ladder as suspend | Clears the three suspension fields, writes `user.restore` |
| `POST /api/admin/users/[id]/role` | `role=STUDENT\|MODERATOR\|ADMIN` | Admin only | Changes the role, writes `user.role` with `{from, to}`. Not on yourself; the last administrator cannot be demoted |
| `POST /api/admin/posts/[id]/remove` | — | Moderator / Admin | Soft-deletes the post, writes `post.remove` |
| `POST /api/admin/threads/[id]/remove` | — | Moderator / Admin | Soft-deletes the thread, writes `thread.remove` |
| `POST /api/admin/threads/[id]/lock` | — | Moderator / Admin | Toggles `isLocked`, writes `thread.lock` / `thread.unlock` |

Nobody can suspend an administrator, and nobody can suspend or restore their own account.

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
