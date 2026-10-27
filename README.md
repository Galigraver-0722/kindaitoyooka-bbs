# Toyooka BBS

[![CI](https://github.com/Galigraver-0722/kindaitoyooka-bbs/actions/workflows/ci.yml/badge.svg)](https://github.com/Galigraver-0722/kindaitoyooka-bbs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A school-run bulletin board for **Kindai University Toyooka Junior & Senior High School**.

The project is a persistent, topic-organized alternative to class group chats: a place where a
question can be found and answered a month later, where clubs can post one canonical event
thread, and where students can report problems without confronting anyone. See
[the product brief](docs/00-product-brief.md) for the reasoning.

> **Status: Phase 1 hardening.** The forum, Phase 2 features, board pagination, published
> policies, backup scripts, and a local restore drill are done. The project is **not ready for
> real students** until it is deployed behind HTTPS with server-side backups and the school
> approval work in [the roadmap](docs/05-roadmap.md) is complete. Do not launch it as an official
> school service without a teacher advisor and the administration's approval.

## What works today

- Username-and-password registration, login, logout with server-side sessions. Registration
  requires ticking each of the four policy documents, and stores the timestamp plus the version of
  each one.
- One cross-board feed with newest, popular, and rising sorts over all, saved, and own posts.
  The five official boards are created by `pnpm bootstrap`.
- Create a thread, reply, and see replies in chronological order.
- Like a post, bookmark a thread, copy a permalink, and report a post from one action bar.
- Saved threads are the `Saved` filter of the feed; `/bookmarks` still redirects there, so old
  links keep working.
- Search titles, replies, and tags from the feed. A query scans every match (up to 500
  candidates) instead of the newest 30, ranks with published weights, and paginates at 20;
  newest, popularity, and rising stay available as sorts.
- Report a post with a reason; moderators review the queue at `/admin`.
- Moderator console at `/admin` with tabs for reports, accounts, posts, and the audit log; removing
  posts, locking threads, and suspending a student account all happen there, and every action is
  attributed to the moderator in the audit log.
- Soft deletion: removed content leaves a visible placeholder instead of vanishing.
- Japanese-first interface with a header switch to English; user content is never machine-translated.
- Tags come from a dedicated field when composing, not parsed out of the body, and search
  accepts `#tag` as a filter.
- Board pages paginate at 20 threads, with working newest and popular sorts.
- Announcements and a changelog in the header panel, editable from the console, in both
  languages, with drafts that stay hidden until published.
- Public terms of use, community rules, privacy notice, and moderation policy at `/terms`,
  `/rules`, `/privacy`, and `/moderation-policy`, in both languages. The terms state that your
  posts stay yours and grant only the permission needed to run the site.
- Profile pages at `/u/<username>` with an identity banner, thread/post/like/join-date counts,
  and separate recent-thread and recent-reply tabs; no email or real name.
- Thread editing for 15 minutes after posting, with a visible "edited" marker.
- Plain-text export of a whole thread at `/t/<id>/export`.
- Fixed-window rate limits on login, registration, posting, reporting, and reactions, tunable
  through environment variables.
- Account suspension: signs the account out everywhere, blocks sign-in, keeps every post; reversible with one click. Only students can be suspended by a moderator, only administrators can change roles.
- Manual password recovery with `pnpm reset-password <username>`; no email provider required.
- `GET /health` reports application and database readiness.
- Two-layer word checks on every write (thread titles, bodies, tags, replies, board names,
  descriptions, bios): a short list of unambiguous abuse is refused before it is stored, and
  everything ambiguous — insults, drug words, the CC BY 4.0 `naughty-words` sexual vocabulary, and
  self-harm phrases — is queued for a human. Refusals leave a record that moderators see under
  Blocked in `/admin`; self-harm phrases are never auto-refused.
- Students can open their own community board from `/boards/new` (three per account, five per
  hour), badged so it is never mistaken for an official board. A board with no thread activity
  for 90 days is archived by the daily `pnpm archive-boards` run and can be restored from
  the console.
- "New" badges on the feed and board lists for signed-in readers, driven by the read markers
  written when a thread is opened.
- An announcements panel in the header with official notices and the changelog, newest first; opening
  it clears a dot for signed-in readers. The entries live in `src/lib/announcements.ts` (ADR-0030).
- Feed cards and board rows show the opening of the body in a dimmer two-line excerpt, so a thread's
  subject is visible without opening it. The excerpt is plain text; the title stays the only link.
- A notification inbox in the header, left of the search box: replies, comments, likes, and saves
  on your posts, with an unread count that clears when the panel opens. The events are derived
  from existing rows (ADR-0025).
- Reports are deduplicated per reader and post, and the moderation queue paginates at 10 rows.
- Rate-limit counters live in SQLite, so a restart does not refund an attacker; the client
  address is only trusted behind a proxy (`TRUST_PROXY=1`).
- Moderators handle posts and threads; only administrators close or reopen a board.
- Responsive UI, plain-text content only, no uploads and no trackers.

Not implemented yet: a full-text index (search is `LIKE` plus in-app ranking, see ADR-0022),
quote reposts, email verification or self-service password reset, account bans, image uploads,
and an owner screen where a club edits its own board.
The full list is in [MVP scope](docs/01-mvp-scope.md).

## Quick start

Requirements: **Node.js 22+** and **pnpm 12+**.

```bash
pnpm install
cp .env.example .env
pnpm db:deploy     # create the SQLite database from prisma/migrations
pnpm db:seed       # boards, demo users, sample threads
pnpm dev           # http://localhost:3000
```

Demo accounts created by the seed (development only):

| Username | Role | Password |
| --- | --- | --- |
| `admin` | Admin | `toyooka-demo-123` |
| `moderator` | Moderator | `toyooka-demo-123` |
| `student` | Student | `toyooka-demo-123` |

The seeded boards, threads, and replies are in Japanese. Never run the seed on a public
deployment, and never keep these passwords anywhere real.

### Useful commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Production build and type check |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests for validation, i18n, tags, pagination, policies, rate limits, editing, and passwords |
| `pnpm db:deploy` | Create or update the SQLite database from `prisma/migrations` |
| `pnpm db:push` | Push the schema without a migration (quick experiments only) |
| `pnpm bootstrap` | First-run setup for a real deployment: the five official boards plus one administrator (no demo accounts) |
| `pnpm db:seed` | Insert development data (refused when `NODE_ENV=production`) |
| `pnpm db:studio` | Browse the database in Prisma Studio |
| `pnpm reset-password <username>` | Generate a new password, print it once, and sign the account out everywhere |
| `pnpm backup [dir]` | Write a consistent SQLite backup while the app is running |
| `pnpm verify-backup <file>` | Check integrity and row counts of a backup |
| `pnpm restore <file> <target> --force` | Restore a backup; stop the app first |
| `curl -fsS localhost:3000/health` | Check that the app and database respond |
| `pnpm db:migrate --name <change>` | Create a migration after editing `prisma/schema.prisma` |

## Documentation

Start with the brief, then read the scope and the safety policy before writing code.

**日本語版:** [docs/ja/README.md](docs/ja/README.md) — 日本語の文書一式です。英語版が正本です。

| Document | What it answers |
| --- | --- |
| [00 · Product brief](docs/00-product-brief.md) | Why this exists, for whom, and how success is measured |
| [01 · MVP scope](docs/01-mvp-scope.md) | What is in, what is out, and the acceptance tests |
| [02 · Architecture](docs/02-architecture.md) | Stack, request flows, auth, security posture, deployment options |
| [03 · Data model](docs/03-data-model.md) | Tables, invariants, indexes, retention |
| [04 · Routes and endpoints](docs/04-routes-and-api.md) | Every page and form endpoint, with error codes |
| [05 · Roadmap](docs/05-roadmap.md) | Phases from beta to launch, with exit criteria |
| [06 · Safety and moderation](docs/06-safety-and-moderation.md) | Content policy, PII rules, escalation, Japanese legal context |
| [07 · Operations](docs/07-operations.md) | Deploy, backup, restore, incidents, costs |
| [08 · Decision log](docs/08-decision-log.md) | Every architectural decision, with the alternatives that were rejected |
| [09 · Learning path](docs/09-learning-path.md) | A six-week path from "no idea" to deployed, with a glossary |
| [10 · Open questions](docs/10-open-questions.md) | Decisions the owner and the school must make |

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript 5, strict mode |
| UI | React 19, Tailwind CSS 4 |
| Data | Prisma 6 + SQLite |
| Auth | `scrypt` password hashes, hashed session tokens, HttpOnly cookies |
| Runtime | Node.js 22 |

## Repository layout

```text
prisma/            schema, migrations, seed data
scripts/           bootstrap, password reset, backup, restore, board archive
deploy/            Caddy, systemd, and cron templates
src/app/           pages and form endpoints
src/components/    the themed shell for both designs, home layout, shared pieces
src/lib/           domain logic: auth, search, policies, rate limits, validation
docs/              product, architecture, safety, operations; docs/ja/ mirrors it
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Contributions must be in English, must keep
student safety as the priority, and must not include personal data or secrets.

## Third-party notices

Sensitive-word detection uses the CC BY 4.0 `naughty-words` lists. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Security

Report vulnerabilities privately through the repository's **Security → Report a vulnerability**
tab. Do not open a public issue. See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 Kindai Toyooka BBS contributors.

The MIT License covers the code. It does not grant the name: a deployment that is shown to
students must not present itself as Toyooka BBS, and the school's name and emblem belong to the
school. [TRADEMARK.md](TRADEMARK.md) lists the strings a fork has to change and the attribution it
has to keep.

## Disclaimer

This is a community project. It is not an official communication channel of Kindai University
Toyooka Junior & Senior High School, and nothing posted here is a formal school announcement.
The school's name is used only to describe the intended audience.
