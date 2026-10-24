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
| TLS | A domain plus automatic certificates (Caddy is the easiest) |

## 2. Environment variables

| Name | Required | Example | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | `file:./prod.db` | Relative to `prisma/` |
| `NODE_ENV` | in production | `production` | Set by `next start` too |
| `PORT` | no | `3000` | Pass with `pnpm start -p 3000` |
| `COOKIE_SECURE` | no | `true` | Defaults to secure in production; `false` only for plain HTTP on a LAN |
| `RATE_LIMIT_<NAME>_LIMIT` | no | `10` | Overrides one limit; `<NAME>` is `LOGIN`, `REGISTER`, `THREAD`, `REPLY`, `REPORT`, `LIKE`, or `BOOKMARK` |
| `RATE_LIMIT_<NAME>_WINDOW_MIN` | no | `10` | Window in minutes for the same limit |

Rate-limit counters live in process memory. A restart resets them, and a second app instance
would keep its own counters. That is acceptable for one school server; move the counters to a
shared store before scaling out.

The defaults are intentionally loose because a class can share one school IP: 10 login attempts
per 10 minutes per IP + username, 60 registrations per hour per IP, 10 threads per hour, 60
replies per hour, 30 reports per day, and 300 reactions per hour. Tighten a single limit in
`.env` instead of editing code, and restart the service:

```bash
# Example: five login attempts per ten minutes on a public-facing deployment
RATE_LIMIT_LOGIN_LIMIT=5
RATE_LIMIT_LOGIN_WINDOW_MIN=10
```

Never commit `.env`. `.env.example` documents the fields.

## 3. Local development

```bash
pnpm install
cp .env.example .env
pnpm db:push        # create prisma/dev.db
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
pnpm exec prisma migrate dev --name <change>   # after switching to migrations
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
pnpm exec prisma migrate deploy   # after the initial migration exists
pnpm build
```

If the project is still using `db push` (pre-launch only), run `pnpm db:push` instead of
`migrate deploy`. Switch to migrations before real users exist.

Create the first administrator by registering on the site. On an empty database, the first
account becomes `ADMIN`. Then remove any demo accounts:

```bash
pnpm exec prisma studio   # or a SQL client; delete the seeded users
```

### 4.3 systemd unit

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

[Install]
WantedBy=multi-user.target
```

Replace `/usr/local/bin/pnpm` with the output of `command -v pnpm`. Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now toyooka-bbs
sudo systemctl status toyooka-bbs
```

### 4.4 TLS with Caddy

`/etc/caddy/Caddyfile`:

```caddyfile
bbs.example.com {
    encode gzip
    reverse_proxy 127.0.0.1:3000
}
```

```bash
sudo systemctl reload caddy
```

Caddy obtains and renews certificates automatically. Point the domain's DNS at the server first.

### 4.5 Firewall

Allow 22 (if needed), 80, and 443 only. Do not expose port 3000 to the internet.

## 5. Backups

The database is one file. Protect it as if it were the whole site.

### Daily backup script

`/usr/local/bin/bbs-backup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
umask 077

DB=/srv/bbs/app/prisma/prod.db
DEST=/srv/backups
STAMP=$(date +%Y-%m-%d)

sqlite3 "$DB" ".backup '$DEST/bbs-$STAMP.db'"
find "$DEST" -name 'bbs-*.db' -mtime +30 -delete

# Optional: copy off the server (rclone, rsync, or the school's storage)
# rclone copy "$DEST/bbs-$STAMP.db" remote:bbs-backups/
```

```bash
sudo chmod 700 /usr/local/bin/bbs-backup.sh
sudo crontab -e
# 0 3 * * * /usr/local/bin/bbs-backup.sh
```

### Restore drill (do this monthly)

```bash
sudo systemctl stop toyooka-bbs
cp /srv/backups/bbs-2026-10-24.db /srv/bbs/app/prisma/prod.db
sudo chown bbs:bbs /srv/bbs/app/prisma/prod.db
sudo systemctl start toyooka-bbs
curl -fsS https://bbs.example.com/ >/dev/null && echo OK
```

Verify that a known thread and its replies are present. A backup that has never been restored is
a hope, not a backup.

## 6. Migrations

Before launch, create the initial migration:

```bash
pnpm exec prisma migrate dev --name init
git add prisma/migrations
```

On each deploy:

```bash
git pull
pnpm install --frozen-lockfile
pnpm exec prisma migrate deploy
pnpm build
sudo systemctl restart toyooka-bbs
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
- [ ] Rules, privacy notice, and moderation policy published.
- [ ] At least two moderators trained; escalation contacts shared.
- [ ] Uptime monitoring configured.
- [ ] Error logging accessible to the maintainer.
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
