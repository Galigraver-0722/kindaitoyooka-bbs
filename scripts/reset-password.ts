/**
 * Reset a local account password without email.
 *
 * Usage:
 *   pnpm reset-password <username>
 *
 * The new password is generated and printed once. Hand it to the account owner
 * in person; never paste it into a public thread or commit it anywhere.
 */
import { randomInt } from "node:crypto";
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/passwords";

/** Load `.env` the way Next.js does, so the script works without extra flags. */
function loadLocalEnv(): void {
  if (process.env.DATABASE_URL) {
    return;
  }

  try {
    const file = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of file.split("\n")) {
      const match = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!match) {
        continue;
      }
      const value = match[2].replace(/^["']|["']$/g, "");
      process.env[match[1]] ??= value;
    }
  } catch {
    // No .env file: rely on the caller's environment.
  }
}

loadLocalEnv();

const prisma = new PrismaClient();
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generatePassword(length = 16): string {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += ALPHABET[randomInt(ALPHABET.length)];
  }
  return value;
}

async function main(): Promise<void> {
  const username = process.argv[2]?.trim().toLowerCase();
  if (!username) {
    console.error("Usage: pnpm reset-password <username>");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true },
  });

  if (!user) {
    console.error(`No account named "${username}".`);
    process.exitCode = 1;
    return;
  }

  const password = generatePassword();
  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    // Any old session must stop working once the password changes.
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);

  console.log(`Password reset for ${user.username} (${user.role}).`);
  console.log(`New password: ${password}`);
  console.log("All existing sessions were signed out. Share this password privately.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
