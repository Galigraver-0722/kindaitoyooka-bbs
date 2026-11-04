/**
 * Anonymise an account without touching its posts.
 *
 *   pnpm delete-account <username>
 *
 * The row stays so that threads keep their author, but the name is replaced by
 * 「削除済み利用者」 (numbered if that name is taken), the address and password
 * are cleared, every session is deleted, and the account is suspended so it can
 * never sign in again. Posts, replies, likes and read markers are left in place;
 * an individual post can be removed by the maintainer on request.
 */
import { randomBytes } from "node:crypto";
import { prisma } from "../src/lib/db";

const PLACEHOLDER = "削除済み利用者";

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error("usage: pnpm delete-account <username>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true },
  });
  if (!user) {
    console.error(`no such account: ${username}`);
    process.exit(1);
  }
  if (user.role === "ADMIN") {
    const admins = await prisma.user.count({ where: { role: "ADMIN", isSuspended: false, deletedAt: null } });
    if (admins <= 1) {
      console.error("refusing to delete the last administrator");
      process.exit(1);
    }
  }

  let name = PLACEHOLDER;
  let suffix = 2;
  while (await prisma.user.findUnique({ where: { username: name }, select: { id: true } })) {
    name = `${PLACEHOLDER}${suffix}`;
    suffix += 1;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        username: name,
        email: null,
        passwordHash: `deleted:${randomBytes(32).toString("hex")}`,
        isSuspended: true,
        suspendedAt: new Date(),
        suspendedReason: "アカウント削除",
        deletedAt: new Date(),
        bio: null,
        avatarColor: null,
        avatarRing: null,
      },
    }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
    prisma.postLike.deleteMany({ where: { userId: user.id } }),
    prisma.threadLike.deleteMany({ where: { userId: user.id } }),
    prisma.threadBookmark.deleteMany({ where: { userId: user.id } }),
    prisma.threadRead.deleteMany({ where: { userId: user.id } }),
    prisma.draft.deleteMany({ where: { userId: user.id } }),
  ]);

  console.log(`anonymised ${user.username} -> ${name}; posts kept, sign-in disabled.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
