# Toyooka BBS

[![CI](https://github.com/Galigraver-0722/kindaitoyooka-bbs/actions/workflows/ci.yml/badge.svg)](https://github.com/Galigraver-0722/kindaitoyooka-bbs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A school-run bulletin board for **Kindai University Toyooka Junior & Senior High School**.

The project is a persistent, topic-organized alternative to class group chats: a place where a
question can be found and answered a month later, where clubs can post one canonical event
thread, and where students can report problems without confronting anyone. See
[the product brief](docs/00-product-brief.md) for the reasoning.

> **Status: Phase 0, walking skeleton.** The core forum works end to end, but the project is
> **not ready for real students** until the safety, deployment, and rate-limiting work in
> [the roadmap](docs/05-roadmap.md) is done. Do not launch it as an official school service
> without a teacher advisor and the administration's approval.

## What works today

- Username-and-password registration, login, logout with server-side sessions.
- Five boards, recent activity, and thread lists.
- Create a thread, reply, and see replies in chronological order.
- Like a post, bookmark a thread, copy a permalink, and report a post from one action bar.
- Saved-threads page at `/bookmarks`.
- Search titles and replies, sorted by newest or a transparent popularity score.
- Hashtags in titles and replies, with tag-filtered search.
- Report a post with a reason; moderators review the queue at `/moderation`.
- Moderator tools: remove post, lock/unlock thread, remove thread, dismiss reports.
- Soft deletion: removed content leaves a visible placeholder instead of vanishing.
- Japanese-first interface with a header switch to English; user content is never machine-translated.
- Tags are a separate field when composing, not parsed out of the body.
- Fixed-window rate limits on login, registration, posting, reporting, and reactions.
- Audit log for every moderation action, shown on `/moderation`.
- Automatic sensitive-word flags from the CC BY 4.0 `naughty-words` lists, with a project-specific ignore list; matches are reviewed by a human, never auto-hidden.
- Responsive UI, plain-text content only, no uploads and no trackers.

Not implemented yet: pagination, full-text indexing, quote reposts, user-created boards,
email verification or password reset, notifications, account bans, profile pages, and image
uploads.
The full list is in [MVP scope](docs/01-mvp-scope.md).

## Quick start

Requirements: **Node.js 22+** and **pnpm 12+**.

```bash
pnpm install
cp .env.example .env
pnpm db:push       # create the SQLite database
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
| `pnpm test` | Validation unit tests |
| `pnpm db:push` | Apply the Prisma schema to SQLite (development) |
| `pnpm db:seed` | Insert development data |
| `pnpm db:studio` | Browse the database in Prisma Studio |
| `pnpm exec prisma migrate dev --name <change>` | Create a migration (use before production) |

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
| [08 · Decision log](docs/08-decision-log.md) | Why Next.js, SQLite, MIT, and custom sessions |
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
prisma/            schema, seed data
src/app/           pages and form endpoints
src/components/    header, footer, role chip
src/lib/           auth, database client, validation, formatting
docs/              product, architecture, safety, operations
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

## Disclaimer

This is a community project. It is not an official communication channel of Kindai University
Toyooka Junior & Senior High School, and nothing posted here is a formal school announcement.
The school's name is used only to describe the intended audience.
