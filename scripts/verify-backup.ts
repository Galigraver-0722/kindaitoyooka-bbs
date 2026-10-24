/**
 * Check a backup file before trusting it.
 *
 * Usage:
 *   pnpm verify-backup <backup-file>
 */
import { resolve } from "node:path";
import { inspectDatabase } from "./backup-lib";

async function main(): Promise<void> {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: pnpm verify-backup <backup-file>");
    process.exitCode = 1;
    return;
  }

  const path = resolve(file);
  const report = await inspectDatabase(path);

  console.log(`Database: ${path}`);
  console.log(`Integrity: ${report.integrity}`);
  console.log(
    `Counts: users ${report.users} · threads ${report.threads} · posts ${report.posts} · reports ${report.reports}`,
  );
  console.log(`Latest threads: ${report.latestThreads.join(" / ") || "(none)"}`);

  if (!report.ok) {
    console.error("Backup verification failed.");
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
