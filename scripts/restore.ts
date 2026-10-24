/**
 * Restore a backup into a target database file.
 *
 * Usage:
 *   pnpm restore <backup-file> <target-db> [--force]
 *
 * The application must be stopped before restoring over its live database.
 * `--force` only exists for drills and deliberate overwrites; this script does
 * not stop the service for you.
 */
import { chmodSync, copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { inspectDatabase } from "./backup-lib";

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => arg !== "--force");
  const force = process.argv.includes("--force");
  const [backupArg, targetArg] = args;

  if (!backupArg || !targetArg) {
    console.error("Usage: pnpm restore <backup-file> <target-db> [--force]");
    process.exitCode = 1;
    return;
  }

  const backup = resolve(backupArg);
  const target = resolve(targetArg);

  const source = await inspectDatabase(backup);
  if (!source.ok) {
    console.error(`Backup failed its integrity check: ${source.integrity}`);
    process.exitCode = 1;
    return;
  }

  if (existsSync(target) && !force) {
    console.error(`Target exists: ${target}. Stop the app and pass --force to replace it.`);
    process.exitCode = 1;
    return;
  }

  copyFileSync(backup, target);
  chmodSync(target, 0o600);

  const restored = await inspectDatabase(target);
  console.log(`Restored ${backup} -> ${target}`);
  console.log(
    `Integrity: ${restored.integrity} · users ${restored.users} · threads ${restored.threads} · posts ${restored.posts}`,
  );
  console.log(`Latest threads: ${restored.latestThreads.join(" / ") || "(none)"}`);

  if (!restored.ok) {
    console.error("Restored database failed its integrity check.");
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
