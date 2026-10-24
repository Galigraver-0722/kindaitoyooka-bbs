/**
 * Create a consistent SQLite backup without stopping the application.
 *
 * Usage:
 *   pnpm backup [output-directory]
 *
 * `VACUUM INTO` writes a transactionally consistent copy, unlike copying the
 * live file while writes are in flight.
 */
import { createHash } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { inspectDatabase } from "./backup-lib";
import { loadLocalEnv } from "./env";

loadLocalEnv();

const prisma = new PrismaClient();

function timestamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

async function main(): Promise<void> {
  const outputDir = resolve(process.argv[2] ?? "backups");
  mkdirSync(outputDir, { recursive: true });

  const target = join(outputDir, `bbs-${timestamp()}.db`);
  if (existsSync(target)) {
    throw new Error(`Refusing to overwrite an existing backup: ${target}`);
  }

  const escaped = target.replace(/'/g, "''");
  await prisma.$executeRawUnsafe(`VACUUM INTO '${escaped}'`);
  chmodSync(target, 0o600);

  const digest = createHash("sha256").update(readFileSync(target)).digest("hex");
  const report = await inspectDatabase(target);

  console.log(`Backup written: ${target}`);
  console.log(`SHA-256: ${digest}`);
  console.log(
    `Integrity: ${report.integrity} · users ${report.users} · threads ${report.threads} · posts ${report.posts} · reports ${report.reports}`,
  );

  if (!report.ok) {
    throw new Error("The backup failed the SQLite integrity check.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
