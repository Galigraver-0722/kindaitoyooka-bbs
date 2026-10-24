#!/usr/bin/env bash
# Daily backup wrapper for cron. Uses the app's own VACUUM INTO script so the
# copy is consistent while the site is running.
set -euo pipefail
umask 077

APP_DIR="${APP_DIR:-/srv/bbs/app}"
DEST="${1:-/srv/backups}"

cd "$APP_DIR"
./node_modules/.bin/tsx scripts/backup.ts "$DEST"

# Keep one month of daily backups. Adjust if the school wants a longer history.
find "$DEST" -name 'bbs-*.db' -mtime +30 -delete
