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
| ADR-0006 | English source of truth with a Japanese documentation edition | Accepted | 2026-10-24 |
| ADR-0007 | Soft deletion for all user content | Accepted | 2026-10-24 |

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

## ADR-0006 — English source of truth with a Japanese documentation edition

**Context.** The project owner requires code, comments, and documentation to be in English. The
school is in Japan, most students read Japanese more comfortably, and the owner asked for a
Japanese edition of the documentation. The interface itself is still English in v0.1.

**Decision.** English remains the source of truth for code, comments, the interface, commit
messages, issues, and pull requests. `docs/` is the canonical documentation in English, and
`docs/ja/` contains a full Japanese translation with the same file names and structure. When the
two disagree, the English version wins. Both editions are updated in the same pull request.

**Consequences.**

- Japanese teachers, students, and the school administration can read the policy and the plan
  without relying on a translator.
- Every documentation change must be made twice; translation drift is a real maintenance cost.
- Commands, code identifiers, URLs, and error codes stay in English inside the Japanese
  edition, because translating them would break copy-paste and searches.
- The error-code map (`src/lib/messages.ts`) remains the natural seam for translating the
  interface itself later.

**Revisit if.** The school requires a Japanese interface for approval, or usage data shows
English is a barrier for students. Plan: introduce a locale cookie and a message catalog; do not
fork the app.

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

## Template for new decisions

```markdown
## ADR-000N — Title

**Context.** What situation forces a choice?

**Decision.** What did we choose?

**Consequences.** What becomes easier, harder, or impossible?

**Alternatives considered.** What else was plausible, and why was it rejected?

**Revisit if.** Observable conditions that should reopen this decision.
```
