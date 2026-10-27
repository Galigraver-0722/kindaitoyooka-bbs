# MVP Scope

> 日本語版: [日本語](ja/01-mvp-scope.md)

## Definition

The MVP is a **walking skeleton**: every layer of the system is present and connected, even if
each layer is thin. A student can register, read, start a thread, reply, and report a post. A
moderator can remove a post, lock a thread, and clear the report queue.

If any of those actions is missing, this is not an MVP; it is a prototype.

## What is already implemented (v0.1)

- Email-optional registration, login, logout with server-side sessions.
- Five seeded boards and sample discussions.
- Board index, recent activity, thread list, thread view.
- Create thread, reply to thread.
- Like posts, bookmark threads, share permalinks, and report posts from one action bar.
- Saved-threads page and per-user reaction state.
- Search titles and replies, with newest and popularity sorting.
- Tags entered in a separate field on the compose and reply forms, with tag-filtered search.
- Fixed-window rate limits on authentication, posting, reporting, and reactions, tunable by
  environment variable.
- Board pagination at 20 threads per page, preserving the newest/popular sort.
- Public terms of use, community rules, privacy notice, and moderation policy pages, in English and
  Japanese. The terms are the agreement; the other three are declared part of it.
- An audit log for every moderation action, visible in the console at `/admin`.
- Author profile pages at `/u/<username>` with an identity banner, thread/post/like/join-date
  counts, and recent-thread and recent-reply tabs.
- Thread editing within 15 minutes of posting, with a visible "edited" marker.
- Plain-text thread export at `/t/<id>/export`.
- Thread read markers written on view. The "new replies" badge is not rendered yet, so the
  markers are stored but unread; the badge is on the roadmap.
- Per-board tag hints on the compose and reply forms.
- Manual password recovery with a maintenance command, and `GET /health`.
- Automatic sensitive-word flags from the CC BY 4.0 `naughty-words` lists, reviewed by a human.
- Report a post with a required reason.
- Moderator queue: remove reported post or dismiss report.
- Moderator actions: remove post, lock/unlock thread, remove thread.
- Soft deletion with a visible placeholder instead of a silent disappearance.
- Localized role labels (English `student` / `moderator` / `admin`; Japanese 生徒 / モデレーター / 管理者)
  and server-side permission checks.
- Japanese-first interface with an English switch stored in a cookie; dates and counts
  follow the locale.
- Responsive layout, plain-text content only.

## MoSCoW

### Must (v0.1 launch)

| Capability | Acceptance criteria |
| --- | --- |
| Register | Username 3–20 chars `[a-z0-9_]`, password ≥ 10 chars, duplicate username rejected with a readable message |
| Log in / out | Session persists across refresh; logout invalidates the server-side session |
| Browse | Guest can read boards, thread lists, and threads without an account |
| Start a thread | Signed-in user picks a board, title 3–120 chars, body ≤ 10,000 chars |
| Reply | Signed-in user can reply in an unlocked, non-deleted thread |
| Report | Signed-in user can report any visible post with a 3–500 char reason |
| Moderate | Moderator can remove a post, lock a thread, remove a thread, and resolve reports |
| Permissions | Students cannot reach `/admin` or call moderation endpoints; suspending an account signs it out everywhere and blocks sign-in |
| Safety placeholder | Removed post remains in the thread as a localized placeholder ("Removed by a moderator" / 「モデレーターが削除しました」) |
| Language switch | Every page opens in Japanese by default and can be switched to English; the choice survives navigation |
| React | Signed-in users can like a post and bookmark a thread; counts update and toggling reverses the action |
| Search and tags | Search matches titles and replies, filters by tag, and sorts by newest or popularity |
| Abuse controls | Login, registration, posting, reporting, and reactions are rate-limited; moderation actions are audited |

### Should (before opening to the whole school)

| Capability | Why | Note |
| --- | --- | --- |
| Pagination or "load more" | A board with 500 threads is unusable | Shipped: numbered pages, 20 per page |
| Full-text indexing | `contains` is fine for a few thousand posts; ranking and Japanese tokenization need FTS5 or Postgres FTS | Add when search latency or precision becomes a complaint |
| Password reset | Otherwise locked-out users need manual help | Manual reset command shipped; self-service email reset still needs a provider |
| Ban / mute | Removing single posts is not enough for repeat offenders | Time-boxed, with reason |
| Terms, privacy notice, and rules | Required before school approval | Shipped at `/terms`, `/rules`, `/privacy`, `/moderation-policy`; the advisor still has to approve the wording |

### Could (nice, after the forum is alive)

- Notifications by email digest; in-app unread markers shipped.
- Reactions instead of "+1" replies.
- Per-board tag presets; hints shipped, enforced prefixes are still open.
- Profile customization (avatars, bios); read-only profiles shipped.
- Draft autosave.
- Full-text search across deleted content for moderators only.

### Won't (this school year)

- Real-time chat or direct messages.
- Image, video, or file uploads.
- Anonymous posting.
- Public federation or open registration outside the school.
- Native mobile apps.
- AI content moderation. It may assist later, but a human must remain accountable.

## User stories and acceptance tests

### US-1 Register and log in

As a student, I want an account with only a username and password so that I can post without
revealing my real identity.

- Given a fresh install, the first registered account becomes `ADMIN`.
- Given an existing username, registration returns `username-taken` and keeps the form data
  except the password.
- Given correct credentials, login sets an HttpOnly session cookie and redirects to the page
  the user came from.
- Given wrong credentials, the same generic error appears whether the username or the password
  was wrong (no account enumeration through the message).

### US-2 Read without an account

As a prospective student, I want to read the forum before registering.

- Guests see boards, thread lists, and posts.
- Guests see "Log in to reply" instead of the reply form.
- Guests never see the moderation link.

### US-3 Start a thread

As a club officer, I want to post an event thread that people can find later.

- The board select is pre-filled when arriving from `/new?board=<slug>`.
- An archived board is rejected server-side.
- Invalid title or body returns to the form with an error and without losing the board choice.
- The author is redirected to the new thread after creation.

### US-4 Reply

As a student, I want to answer a question.

- The reply appears at the end of the thread and the thread moves to the top of its board.
- A locked thread rejects replies with `thread-locked`.
- A removed thread rejects replies.

### US-5 Report

As a student, I want to flag a post without confronting its author.

- The report form is available on every visible post to signed-in users.
- A reason of 3–500 characters is required.
- The reporter sees a confirmation notice; the post is not hidden automatically.
- Reports appear in `/admin?tab=reports` in oldest-first order.

### US-6 Moderate

As a moderator, I want to clear reports quickly.

- Removing a reported post soft-deletes it and resolves the report as `removed`.
- Dismissing a report resolves it as `dismissed` and leaves the post intact.
- Locking a thread prevents replies but keeps it readable.
- Removing a thread hides it from lists and returns the moderator to the board.
- Every action requires a `MODERATOR` or `ADMIN` session; hidden buttons are not the control.

## Definition of done for v0.1

- [x] `pnpm build` succeeds with zero type errors.
- [x] `pnpm lint` succeeds.
- [x] Full flow works against a production build: register → thread → reply → report →
      moderate → lock → logout.
- [ ] Deployed to an HTTPS URL owned by the school or a teacher-approved account.
- [ ] Seed/demo accounts removed or rotated.
- [ ] Backup job runs daily and a restore has been tested.
- [ ] Moderators trained and the report SLA published.
- [ ] Teacher advisor and administration have signed off (see `docs/06`).

## Explicit cut lines

If time is short, cut in this order and stop:

1. Notifications and reactions (never in MVP).
2. Search.
3. Email verification and self-service password reset (manual reset already ships).
4. Thread pinning (seeded pinned threads can remain).
5. The report queue (fall back to a shared moderation mailbox **only** if a teacher agrees;
   this weakens accountability and is a temporary measure).

Do **not** cut: permission checks, soft deletion, the report path, backups, or the teacher
escalation route. Those are the difference between a forum and a liability.
