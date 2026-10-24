# Deployment files

These files are templates for the single-server deployment described in
`docs/07-operations.md`. They are not used by the application at runtime.

| File | Where it goes |
| --- | --- |
| `Caddyfile` | `/etc/caddy/Caddyfile`; replace `bbs.example.com` |
| `toyooka-bbs.service` | `/etc/systemd/system/toyooka-bbs.service`; replace the pnpm path |
| `toyooka-bbs.env.example` | `/srv/bbs/app/.env` |
| `bbs-backup.sh` | `/usr/local/bin/bbs-backup.sh`, then add it to cron |

Installation order: copy the app to `/srv/bbs/app`, create `.env`, run
`pnpm install --frozen-lockfile && pnpm build`, install the systemd unit, start
the service, point Caddy at it, then install the backup cron. Verify with
`curl -fsS https://bbs.example.com/health` and one real restore drill.

The backup script writes to `/srv/backups` by default. Set `APP_DIR` or pass a
destination directory as the first argument if your layout differs.
