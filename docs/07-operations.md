# Operations Runbook

> 日本語版: [日本語](ja/07-operations.md)

This document assumes one small server and one maintainer. If the school provides hosting, adapt
the deployment section but keep the backup and restore rules unchanged.

## 1. Requirements

| Item | Version / note |
| --- | --- |
| Node.js | 22 LTS or newer |
| pnpm | 12.x (declared in `package.json`) |
| Database | SQLite file; no server process |
| Disk | 1 GB is plenty for text; leave room for backups |
| RAM | 2 GB, or 1 GB with 2 GB of swap. `next build` needs more than 1 GB, and the running server holds 300–650 MB; `deploy/toyooka-bbs.service` sets `MemoryMax=900M` |
| TLS | A domain plus automatic certificates. Caddy 2.7 or newer: `deploy/Caddyfile` uses `request_body`, which does not exist in 2.6 |

## 2. Environment variables

| Name | Required | Example | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | `file:./prod.db` | Relative to `prisma/` |
| `NODE_ENV` | in production | `production` | Set by `next start` too |
| `PORT` | no | `3000` | Pass with `pnpm start -p 3000` |
| `COOKIE_SECURE` | no | `true` | Defaults to secure in production; `false` only for plain HTTP on a LAN |
| `RATE_LIMIT_<NAME>_LIMIT` | no | `10` | Overrides one limit; `<NAME>` is `LOGIN`, `REGISTER`, `THREAD`, `REPLY`, `REPORT`, `LIKE`, or `BOOKMARK` |
| `RATE_LIMIT_<NAME>_WINDOW_MIN` | no | `10` | Window in minutes for the same limit |
| `TRUST_PROXY` | behind a proxy | `1` | Trust the client address in `X-Forwarded-For`. Off by default: a direct client can forge that header and buy itself a fresh bucket. |
| `BOARD_ARCHIVE_DAYS` | no | `90` | Quiet window used by `pnpm archive-boards` |

Rate-limit counters live in the `RateLimit` table, so a restart does not hand an attacker a fresh
allowance and two processes on one database share the same windows. Expired rows are pruned on
each login attempt. The counters are keyed by the address in `X-Forwarded-For`, which is only
read when `TRUST_PROXY=1`; without a trusted proxy every request shares one bucket, so the
IP-based limits become deliberately conservative while per-account limits keep working. The
shipped systemd/Caddy setup sets `TRUST_PROXY=1` because Caddy overwrites the header.

The defaults are intentionally loose because a class can share one school IP: 10 login attempts
per 10 minutes per IP + username, 60 registrations per hour per IP, 10 threads per hour, 60
replies per hour, 30 reports per day, and 300 reactions per hour. Tighten a single limit in
`.env` instead of editing code, and restart the service:

```bash
# Example: five login attempts per ten minutes on a public-facing deployment
RATE_LIMIT_LOGIN_LIMIT=5
RATE_LIMIT_LOGIN_WINDOW_MIN=10
```

Never commit `.env`. `.env.example` documents the fields; `deploy/toyooka-bbs.env.example` is the
server version.

Deployment templates live in `deploy/`:

| File | Purpose |
| --- | --- |
| `deploy/Caddyfile` | HTTPS reverse proxy with security headers |
| `deploy/toyooka-bbs.service` | systemd unit |
| `deploy/toyooka-bbs.env.example` | production environment file |
| `deploy/bbs-backup.sh` | daily cron wrapper with 30-day retention |

## 3. Local development

```bash
pnpm install
cp .env.example .env
pnpm db:deploy      # create prisma/dev.db from prisma/migrations
pnpm db:seed        # boards, demo users, sample threads
pnpm dev            # http://localhost:3000
```

Demo accounts from the seed (development only):

| Username | Role | Password |
| --- | --- | --- |
| `admin` | ADMIN | `toyooka-demo-123` |
| `moderator` | MODERATOR | `toyooka-demo-123` |
| `student` | STUDENT | `toyooka-demo-123` |

Useful commands:

```bash
pnpm lint
pnpm build
pnpm db:studio      # browse the database in a browser
pnpm reset-password <username>   # manual account recovery; prints a new password once
pnpm db:migrate --name <change>   # after editing prisma/schema.prisma
```

## 4. First production deployment (VPS + Caddy + systemd)

### 4.1 Prepare the server

```bash
sudo adduser --system --group --home /srv/bbs bbs
sudo mkdir -p /srv/bbs /srv/backups
sudo chown -R bbs:bbs /srv/bbs /srv/backups
```

Install Node.js 22 and pnpm using the official instructions for your distribution, then confirm:

```bash
node -v
pnpm -v
```

### 4.2 Deploy the application

As the `bbs` user:

```bash
git clone https://github.com/<owner>/kindaitoyooka-bbs.git /srv/bbs/app
cd /srv/bbs/app
pnpm install --frozen-lockfile
cp .env.example .env
# edit .env: DATABASE_URL="file:./prod.db"
pnpm db:deploy   # applies every migration in prisma/migrations
pnpm build
```

`prisma/migrations` holds the initial migration, so a fresh server builds the same schema a
local checkout has. `pnpm db:push` skips the history and is for throwaway experiments only.

A fresh database has no boards. The only board-creating route makes COMMUNITY boards, so run the
bootstrap script before opening the site. It creates the five official boards and, optionally, one
administrator. It never creates demo accounts, sample threads, or a known password, and re-running
it is safe (boards are upserted by slug). It also writes the four starter announcements into an
empty `Announcement` table, so the header panel is not blank on day one; once an administrator edits
them in the console, re-running the script leaves them alone:

```bash
BOOTSTRAP_ADMIN_USERNAME=teacher \
BOOTSTRAP_ADMIN_PASSWORD='<a long unique password>' \
pnpm bootstrap
```

Pass the password through the environment, not on the command line: argv ends up in shell history
and in `ps` output. `pnpm bootstrap --boards-only` skips the account, and
`pnpm bootstrap --promote <username>` raises an existing account to `ADMIN` without touching its
password.

Do not run `pnpm db:seed` here. It creates `admin`, `moderator`, and `student` with the public
password `toyooka-demo-123`; the script now refuses to run when `NODE_ENV=production` unless
`--force` is passed.

Registering on the site also works — the first account on an empty database becomes `ADMIN` — but
that turns into a race the moment the URL is reachable: whoever registers first owns the site. Run
the bootstrap first if the site is already exposed.

### 4.3 systemd unit

A copy of this unit is in `deploy/toyooka-bbs.service`; replace the pnpm path before installing.
`/etc/systemd/system/toyooka-bbs.service`:

```ini
[Unit]
Description=Toyooka BBS
After=network.target

[Service]
Type=simple
User=bbs
Group=bbs
WorkingDirectory=/srv/bbs/app
EnvironmentFile=/srv/bbs/app/.env
Environment=NODE_ENV=production
ExecStart=/usr/local/bin/pnpm start -p 3000
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
MemoryMax=900M

[Install]
WantedBy=multi-user.target
```

`MemoryMax=900M` stops one runaway request from pushing a 1 GB machine into the kernel OOM
killer: the service restarts instead of the whole host freezing. Replace `/usr/local/bin/pnpm`
with the output of `command -v pnpm`. Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now toyooka-bbs
sudo systemctl status toyooka-bbs
```

### 4.4 TLS with Caddy

The template in `deploy/Caddyfile` also sets HSTS and basic security headers. `/etc/caddy/Caddyfile`:

```caddyfile
bbs.example.com {
    encode gzip zstd
    request_body {
        max_size 256KB
    }
    reverse_proxy 127.0.0.1:3000
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

`request_body` refuses uploads over 256 KB at the proxy; the handlers separately refuse anything
over 64 KB from `Content-Length`, so the two limits overlap on purpose.

```bash
sudo systemctl reload caddy
```

Caddy obtains and renews certificates automatically. Point the domain's DNS at the server first.

### 4.5 Firewall

Allow 22 (if needed), 80, and 443 only. Do not expose port 3000 to the internet.

## 5. Backups

The database is one file. Protect it as if it were the whole site. Back up while the application
is running: `pnpm backup` uses SQLite `VACUUM INTO`, which writes a transactionally consistent
copy. Copying a live `.db` file with `cp` can capture a half-written page.

### Commands

| Command | What it does |
| --- | --- |
| `pnpm backup [dir]` | Write `bbs-<timestamp>.db`, check integrity, print SHA-256 and row counts |
| `pnpm verify-backup <file>` | Re-check integrity and show counts before trusting a file |
| `pnpm restore <file> <target> --force` | Copy a verified backup over a target database, then verify it |

The target database must not be in use. Stop the service before a real restore.

### Daily backup cron

The repository ships `deploy/bbs-backup.sh`. It runs the backup as the `bbs` user so the file is
readable by the service during a restore, prunes files older than 30 days, and writes to
`/srv/backups`.

```bash
sudo install -m 700 -o bbs -g bbs deploy/bbs-backup.sh /usr/local/bin/bbs-backup.sh
sudo -u bbs crontab -e
# 0 3 * * * /usr/local/bin/bbs-backup.sh /srv/backups >> /srv/bbs/backup.log 2>&1
```

Add an offsite copy after the local backup succeeds. Keep the exact command in the cron job so a
failed backup is visible in the log:

```bash
# Optional, after the line above:
# rclone copy /srv/backups/ remote:bbs-backups/ --include 'bbs-*.db'
```

### Restore drill (do this monthly)

```bash
sudo systemctl stop toyooka-bbs
sudo -u bbs bash -lc 'cd /srv/bbs/app && pnpm restore /srv/backups/bbs-2026-10-24.db prisma/prod.db --force'
sudo systemctl start toyooka-bbs
curl -fsS https://bbs.example.com/health
```

`/health` also reports `version` and `channel`, so after a deploy you can confirm which build is
answering without reading the checked-out commit:

```bash
curl -fsS https://bbs.example.com/health | jq -r '.version + " " + .channel'
```

Then open the site and check that a known thread and its replies are present, and that the newest
posts from the backup are there. A backup that has never been restored is a hope, not a backup.

### Drill performed locally (2026-10-24)

The same commands were exercised against the development database without touching production:

1. `pnpm backup /tmp/bbs-backups` wrote a backup while the app was running.
2. `pnpm verify-backup` reported `Integrity: ok` and the expected user/thread/post counts.
3. `pnpm restore <backup> /tmp/bbs-restore.db` created a second database; integrity was `ok`.
4. A second `next start` on port 3100 pointed at the restored file and served the same threads.

This proves the scripts, not the server. The production drill still has to run on the real host
after the first deployment.

## 5.1 Scheduled board archiving

A community board that no longer receives threads should not keep a permanent place in the
sidebar. `pnpm archive-boards` archives every community board whose newest visible thread is
older than `BOARD_ARCHIVE_DAYS` (default 90), writes an audit row, and leaves all threads
readable. Restore a board from `/moderation` (administrators only).

```bash
# dry run first — it prints what it would change
pnpm archive-boards --dry-run

# daily at 04:00, as the bbs user
sudo crontab -u bbs -e
0 4 * * * cd /srv/bbs/app && pnpm archive-boards >> /var/log/bbs-archive.log 2>&1
```

A board that never received a thread is left alone until it has one; the rule only looks at the
newest thread's `lastPostAt`, so a new club board starts with a full window.

## 6. Migrations

`prisma/migrations/20261025120000_init` is the baseline: it creates every table the schema
declares, and the development database is marked as already having it. To change the schema,
edit `prisma/schema.prisma` and create a new migration:

```bash
pnpm db:migrate --name <change>
git add prisma/migrations
```

On each deploy:

```bash
git pull
pnpm install --frozen-lockfile
pnpm db:deploy        # prisma migrate deploy
pnpm build
sudo systemctl restart toyooka-bbs
```

To check that the migrations and the schema still agree, apply them to a throwaway file and
compare:

```bash
rm -f /tmp/migtest.db
DATABASE_URL="file:/tmp/migtest.db" pnpm db:deploy
npx prisma migrate diff --from-migrations prisma/migrations \
  --to-schema-datamodel prisma/schema.prisma --shadow-database-url "file:/tmp/shadow.db"
# "No difference detected." means the committed SQL still matches the schema
```

Rules:

- Back up before any migration that drops or rewrites data.
- Never run `prisma db push` against production.
- Keep the previous build available so a rollback is a checkout plus rebuild, not a database
  restore.

## 7. Monitoring

Minimum viable monitoring:

| Signal | How | Alert |
| --- | --- | --- |
| Site up | Uptime checker against `GET /health` every minute | Email or chat after 2 failures; `/health` returns 503 when the database fails |
| Disk space | `df -h` daily or node_exporter | > 80% used |
| Application errors | `journalctl -u toyooka-bbs -f`; Sentry (phase 1) | Any 500 spike |
| Backup created | Cron output to a log file | Missing file for 2 days |
| Audit activity | `/moderation` recent actions | Unexpected bulk removals or role changes |
| Database integrity | `sqlite3 prod.db "PRAGMA integrity_check;"` monthly | Anything other than `ok` |

## 8. Incident runbooks

### Site returns 502/503

1. `systemctl status toyooka-bbs`
2. `journalctl -u toyooka-bbs -n 200 --no-pager`
3. `df -h` — a full disk breaks SQLite writes.
4. `systemctl restart toyooka-bbs`
5. If it still fails, check `DATABASE_URL` and file permissions.

### `database is locked`

1. Confirm no long-running `prisma studio` or backup process is holding the file.
2. Restart the service.
3. If it recurs under normal load, it is time to move to PostgreSQL (see `docs/02`).

### Data loss or corruption

1. Stop the service immediately; do not let it write more.
2. Copy the current file aside for forensics.
3. Restore the latest verified backup.
4. Verify integrity and content.
5. Notify the teacher advisor and document what was lost.

### Abuse wave / spam flood

1. Do not engage publicly.
2. Remove and resolve reports in batches.
3. If the rate is unmanageable, put the site behind a maintenance page or restrict access at the
   proxy level.
4. Escalate to the teacher advisor; if accounts are compromised, delete all sessions
   (`prisma.session.deleteMany()`), which logs everyone out.
5. Tighten `RATE_LIMIT_*` values in `.env` before reopening, and remove them again once the wave passes.

### Suspected credential leak

1. Delete all sessions (logs everyone out).
2. Reset the affected account's password with `pnpm reset-password <username>`; this also deletes
   every session for that account.
3. Rotate the GitHub deploy key, server access, and any API tokens.
4. Review the audit trail for unexpected moderation actions.
5. Tell the teacher advisor; follow the school's incident procedure.

### Accidental exposure of personal information

Follow `docs/06`, section 10. Remove the content, preserve evidence, notify the advisor,
document who saw it, and avoid sharing it further.

## 8.1 Sensitive-word list updates

The lists ship in the `naughty-words` dependency (CC BY 4.0). Updates arrive with `pnpm update`;
read the diff before deploying, because a new term can raise the false-positive rate. The local
ignore list and added Japanese threats live in `src/lib/content-filter.ts` and are covered by
tests. Never auto-delete a post because of a match; a human decides.

## 8.2 Manual password reset

There is no self-service reset yet, so a locked-out student asks a maintainer in person. Do not
accept reset requests through a public thread: you cannot verify identity there, and the request
itself reveals who forgot their password.

1. Confirm the student's identity in person or through a teacher advisor.
2. Run the command with the exact username:

   ```bash
   pnpm reset-password sakura_17
   ```

3. The command generates a 16-character password, stores only its `scrypt` hash, deletes every
   session for that account, and prints the password once.
4. Hand the password over privately. Do not paste it into chat, email, a thread, or a commit.
5. Ask the student to log in and change it once a self-service reset exists. Until then, tell
   them to treat it as a one-time password and ask for another reset if it leaks.
6. Record the reset (date, username, who asked) in the maintainer's private log, not in the
   public database.

The command needs `DATABASE_URL`. It reads `.env` from the repository root, so run it from the
repository directory on the server.

## 9. Launch checklist

- [ ] Teacher advisor and administration approval in writing.
- [ ] Domain and HTTPS working; HTTP redirects to HTTPS.
- [ ] Demo accounts deleted; real admin account created with a unique password.
- [ ] `COOKIE_SECURE` left at its secure default.
- [ ] Daily backup cron installed and one restore tested.
- [x] Rate limiting implemented and tuned through environment variables.
- [ ] Terms, rules, privacy notice, and moderation policy published, and the teacher advisor has
      read the terms that the school's name appears in.
- [ ] At least two moderators trained; escalation contacts shared.
- [ ] Uptime monitoring configured.
- [ ] Error logging accessible to the maintainer.
- [ ] `pnpm bootstrap` run: official boards exist, one real `ADMIN`, no demo accounts
      (`pnpm exec prisma studio` to confirm the user table has exactly the accounts you expect).
- [ ] `/robots.txt` still answers `Disallow: /`; switch to allow only when the site is announced
      (edit `src/app/robots.ts`).
- [ ] An error page shows the school's design, not Next's default (throw once from `/meta` and
      confirm the ERROR code appears).
- [ ] Rollback procedure written down and practiced once.

## 10. Cost estimate

| Item | Annual cost (JPY, approximate) |
| --- | --- |
| Domain | 1,500–4,000 |
| VPS (1 vCPU, 1 GB) | 7,000–15,000 |
| Offsite backup storage | 0–2,000 |
| TLS certificates | 0 (Let's Encrypt via Caddy) |
| **Total** | **under 20,000** |

A school-owned server can reduce the cash cost but adds operational risk. Decide who owns the
domain and the server account before launch; a student's personal account is not an acceptable
long-term home for school infrastructure.

## 11. Maintenance calendar

| When | Task |
| --- | --- |
| Weekly | Review open reports, check disk and logs, apply dependency patches |
| Monthly | Restore drill, dependency audit (`pnpm audit`), review moderator workload |
| Each term | Policy review with the advisor, moderator training refresh |
| Yearly | Renew domain, review hosting owner and succession plan |
