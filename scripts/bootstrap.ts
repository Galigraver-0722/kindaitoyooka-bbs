/**
 * First-run setup for a real deployment.
 *
 * The development seed creates boards *and* demo accounts with a public
 * password, so it must never touch a production database. Without it, though, a
 * fresh database has no boards at all and the only board-creating route makes
 * COMMUNITY boards — an administrator would be stuck on an empty site.
 *
 * This script fills exactly that hole and nothing else: the official boards,
 * plus optionally the first administrator. It never creates sample threads,
 * never creates demo users, and is safe to re-run (boards are upserted by slug).
 *
 * Usage:
 *   BOOTSTRAP_ADMIN_USERNAME=teacher BOOTSTRAP_ADMIN_PASSWORD='…' pnpm bootstrap
 *   pnpm bootstrap --promote existing-username      # promote, keep the password
 *   pnpm bootstrap --boards-only                    # boards only
 *
 * The password is read from the environment, not from argv, so it does not end
 * up in the shell history or in `ps` on a shared host.
 */
import { BoardKind, PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/passwords";
import { LIMITS, validatePassword, validateUsername } from "../src/lib/validation";
import { loadLocalEnv } from "./env";

loadLocalEnv();

const prisma = new PrismaClient();

/** The official boards, same names and ordering the development seed uses. */
const OFFICIAL_BOARDS = [
  {
    slug: "general",
    name: "雑談",
    description: "なんでも話す場所です。自己紹介もどうぞ。",
    sortOrder: 1,
    suggestedTags: "質問,雑談,自己紹介",
  },
  {
    slug: "study",
    name: "勉強",
    description: "宿題の質問、試験対策、勉強会の連絡に。",
    sortOrder: 2,
    suggestedTags: "質問,試験,宿題,勉強会",
  },
  {
    slug: "clubs",
    name: "部活・行事",
    description: "部活動の連絡、参加申し込み、行事の相談。",
    sortOrder: 3,
    suggestedTags: "連絡,文化祭,部活",
  },
  {
    slug: "lost-found",
    name: "落とし物",
    description: "落とし物の連絡と、拾った物の報告。",
    sortOrder: 4,
    suggestedTags: "落とし物,拾得物",
  },
  {
    slug: "meta",
    name: "サイトへの意見",
    description: "不具合、要望、この掲示板についての質問。",
    sortOrder: 5,
    suggestedTags: "要望,不具合,質問",
  },
] as const;

function usage(): void {
  console.error(
    [
      "Usage:",
      "  BOOTSTRAP_ADMIN_USERNAME=<name> BOOTSTRAP_ADMIN_PASSWORD=<10+ chars> pnpm bootstrap",
      "  pnpm bootstrap --promote <existing-username>",
      "  pnpm bootstrap --boards-only",
    ].join("\n"),
  );
}

async function ensureBoards(): Promise<void> {
  for (const board of OFFICIAL_BOARDS) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: {
        name: board.name,
        description: board.description,
        sortOrder: board.sortOrder,
        kind: BoardKind.OFFICIAL,
        suggestedTags: board.suggestedTags,
      },
      create: { ...board, kind: BoardKind.OFFICIAL },
    });
  }
  console.log(`official boards ready: ${OFFICIAL_BOARDS.map((board) => board.slug).join(", ")}`);
}

async function promoteExisting(username: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true, role: true } });
  if (!user) {
    console.error(`no such user: ${username}`);
    process.exitCode = 1;
    return;
  }
  await prisma.user.update({ where: { id: user.id }, data: { role: Role.ADMIN } });
  console.log(`${username}: ${user.role} -> ADMIN (password unchanged)`);
}

async function createAdmin(username: string, password: string): Promise<void> {
  if (!validateUsername(username)) {
    console.error(
      `username must be ${LIMITS.usernameMin}-${LIMITS.usernameMax} characters (letters, digits, _ or -)`,
    );
    process.exitCode = 1;
    return;
  }
  if (!validatePassword(password)) {
    console.error(`password must be at least ${LIMITS.passwordMin} characters`);
    process.exitCode = 1;
    return;
  }
  if (password === "toyooka-demo-123") {
    console.error("refusing the demo password — pick a real one");
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.user.findUnique({ where: { username }, select: { id: true, role: true } });
  if (existing) {
    // Never silently reset a password: someone may already own this account.
    console.error(
      `${username} already exists (${existing.role}). Use --promote to make it an admin, or pnpm reset-password to change its password.`,
    );
    process.exitCode = 1;
    return;
  }

  await prisma.user.create({
    data: { username, email: null, passwordHash: await hashPassword(password), role: Role.ADMIN },
  });
  console.log(`created administrator: ${username}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const boardsOnly = args.includes("--boards-only");
  const promoteIndex = args.indexOf("--promote");
  const promote = promoteIndex >= 0 ? args[promoteIndex + 1]?.trim().toLowerCase() : undefined;

  await ensureBoards();

  if (boardsOnly) {
    return;
  }

  if (promote) {
    await promoteExisting(promote);
    return;
  }

  const username = process.env.BOOTSTRAP_ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "";

  if (!username && !password) {
    console.log(
      "boards only: no administrator requested. Register the first account before opening the site to others (the first registration becomes ADMIN), or re-run with BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD.",
    );
    return;
  }
  if (!username || !password) {
    console.error("set both BOOTSTRAP_ADMIN_USERNAME and BOOTSTRAP_ADMIN_PASSWORD");
    usage();
    process.exitCode = 1;
    return;
  }

  await createAdmin(username, password);

  if (process.exitCode === 1) {
    return;
  }

  const users = await prisma.user.count();
  console.log(`users in database: ${users}`);
  console.log("next: pnpm start, then sign in and create the remaining moderators from /moderation");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
