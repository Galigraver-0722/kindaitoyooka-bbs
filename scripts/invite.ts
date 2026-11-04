/**
 * Issue, list and revoke registration codes.
 *
 *   pnpm invite create 5 "1-A 2026-11"
 *   pnpm invite list
 *   pnpm invite revoke ABCD
 *
 * Codes are printed once, in plaintext, and only their SHA-256 hash is stored.
 */
import { createInviteCodes, formatInviteCode, listInviteCodes, revokeInviteCode } from "../src/lib/invites";
import { prisma } from "../src/lib/db";

async function main() {
  const [action, ...rest] = process.argv.slice(2);

  if (action === "create") {
    const count = Number(rest[0] ?? "1");
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      console.error("usage: pnpm invite create <1-100> [note]");
      process.exit(1);
    }
    const note = rest.slice(1).join(" ") || null;
    const codes = await createInviteCodes(count, note);
    console.log(`created ${codes.length} invite code(s). Shown once; hashes only are stored.`);
    for (const code of codes) {
      console.log(`  ${formatInviteCode(code)}`);
    }
    return;
  }

  if (action === "list") {
    const rows = await listInviteCodes();
    if (rows.length === 0) {
      console.log("no invite codes yet");
      return;
    }
    for (const row of rows) {
      const state = row.usedAt ? `used ${row.usedAt.toISOString()}` : "unused";
      console.log(`${row.prefix}-****  ${state}  ${row.note ?? ""}`);
    }
    return;
  }

  if (action === "revoke") {
    const prefix = rest[0];
    if (!prefix) {
      console.error("usage: pnpm invite revoke <prefix>");
      process.exit(1);
    }
    const removed = await revokeInviteCode(prefix);
    console.log(removed === 0 ? "no unused code with that prefix" : `revoked ${removed} code(s)`);
    return;
  }

  console.error("usage: pnpm invite <create|list|revoke>");
  process.exit(1);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
