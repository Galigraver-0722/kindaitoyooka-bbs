/**
 * Issue, inspect and stop the registration code.
 *
 *   pnpm invite                 # show the active code's prefix, note and uses
 *   pnpm invite new "4月"       # issue a new code (the old one stops working)
 *   pnpm invite stop            # stop the current code
 *
 * Registration uses one shared code, so the plaintext is printed once when it
 * is issued; only its SHA-256 hash is stored. The same actions exist in the
 * console under /admin?tab=invites.
 */
import { prisma } from "../src/lib/db";
import {
  activeInviteCode,
  formatInviteCode,
  issueInviteCode,
  listInviteUses,
  retireActiveInviteCode,
} from "../src/lib/invites";

async function main() {
  const [action, ...rest] = process.argv.slice(2);

  if (action === "new" || action === "create") {
    const note = rest.join(" ") || null;
    const code = await issueInviteCode(note);
    console.log(`active code: ${formatInviteCode(code)}`);
    console.log("The previous code no longer works. This value is shown once.");
    return;
  }

  if (action === "stop" || action === "revoke") {
    const stopped = await retireActiveInviteCode();
    console.log(stopped ? "current code stopped" : "no active code");
    return;
  }

  const current = await activeInviteCode();
  if (!current) {
    console.log("no active code; issue one with `pnpm invite new`");
    return;
  }
  console.log(`active code: ${current.prefix}-****  ${current.note ?? ""}`);
  console.log(`issued ${current.createdAt.toISOString()}, ${current._count.uses} account(s)`);
  for (const use of await listInviteUses(10)) {
    console.log(`  ${use.createdAt.toISOString()}  ${use.user.username}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
