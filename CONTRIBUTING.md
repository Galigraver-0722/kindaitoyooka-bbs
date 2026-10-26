# Contributing

Thank you for considering a contribution. This is a school community project used by minors, so
the bar for safety and clarity is higher than for a typical side project.

## Ground rules

1. **English for code and English as the documentation source of truth.** Code, comments, commit
   messages, issues, pull requests, user-facing strings, and `docs/` are in English. A Japanese
   translation lives in `docs/ja/`; when you change a document, update both editions in the same
   pull request. This is a project decision (ADR-0006).
2. **No personal data, ever.** Do not add real student names, photos, emails, or school records
   to fixtures, issues, or screenshots. Use the seeded demo data or invented examples.
3. **No secrets.** Never commit `.env`, tokens, passwords, or database dumps.
4. **Safety before features.** A new feature that makes moderation harder needs a stronger
   reason than "it would be cool".
5. **Explain the change.** One or two sentences in the pull request on what changed and why.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

Read `docs/09-learning-path.md` if any of that is unfamiliar.

## Workflow

1. Open an issue describing the problem, or pick an existing one.
2. Create a branch: `feat/search`, `fix/locked-thread-redirect`, `docs/moderation-sla`.
3. Keep commits focused. Conventional Commit prefixes are appreciated:
   `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
4. Before pushing:
   ```bash
   pnpm lint
   pnpm build
   ```
5. Open a pull request using the checklist below.

## Pull request checklist

- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] The change is in English, including comments and UI text.
- [ ] Server-side validation and authorization were considered, not just the UI.
- [ ] No secrets, real personal data, or production database content.
- [ ] Documentation updated when behavior, routes, or the data model changed.
- [ ] For UI changes, a screenshot or a short description of the before/after.
- [ ] For moderation or safety changes, the relevant section of
      `docs/06-safety-and-moderation.md` was reviewed.

## Code conventions

- TypeScript strict mode. Avoid `any`; if it is unavoidable, explain why in a comment.
- Prefer server components. Add `"use client"` only when browser APIs or state are required.
- Mutations go through a route handler under `src/app/api/`, validate input, then redirect with
  `303`.
- User-facing errors use short codes mapped in `src/lib/messages.ts`; never echo raw input.
- Keep queries in the page or handler that needs them. Do not build a generic repository layer
  for four tables.
- Comments explain *why*, not *what*. The code already says what.

## Licensing of contributions

- The project is MIT licensed. By opening a pull request you agree that your contribution is
  released under the same license, and that the maintainer may relicense the project later
  without asking each contributor again. If you cannot accept that, open an issue with a
  proposal instead of a patch.
- Do not add a file, font, image, or word list whose license forbids redistribution. Record a new
  third-party asset in `THIRD_PARTY_NOTICES.md` in the same pull request.
- The name policy in `TRADEMARK.md` applies to contributed material: do not add a school emblem,
  a logo, or a name that the project has no permission to use.

## Review

One maintainer reviews by default. Security-sensitive changes, moderation policy changes, and
anything that touches personal data need the teacher advisor's review before merge.

## Reporting a problem

- Security issue: follow `SECURITY.md`, not a public issue.
- Harassment or a harmful post: use the site's Report button; do not reproduce the content in a
  GitHub issue.
- Everything else: open an issue with steps to reproduce.
