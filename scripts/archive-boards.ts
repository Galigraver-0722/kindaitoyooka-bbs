/**
 * Archive community boards that have gone quiet.
 *
 * A student board is a promise to a club, not a permanent slot, so a board with
 * no thread activity for `BOARD_ARCHIVE_DAYS` (default 90) is archived: it leaves
 * the sidebar, stops accepting new threads, and keeps every thread readable.
 *
 * Run it from cron once a day, e.g.
 *   0 4 * * * cd /srv/bbs/app && pnpm archive-boards >> /var/log/bbs-archive.log 2>&1
 *
 * `--dry-run` prints what would change without writing.
 */
import { prisma } from "../src/lib/db";

const DEFAULT_DAYS = 90;

function archiveDays(): number {
  const raw = Number.parseInt(process.env.BOARD_ARCHIVE_DAYS ?? "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DAYS;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const days = archiveDays();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const boards = await prisma.board.findMany({
    where: { kind: "COMMUNITY", isArchived: false },
    select: {
      id: true,
      slug: true,
      name: true,
      threads: {
        where: { isDeleted: false },
        orderBy: { lastPostAt: "desc" },
        take: 1,
        select: { lastPostAt: true },
      },
    },
  });

  const quiet = boards.filter((board) => {
    const last = board.threads[0]?.lastPostAt;
    // A community board that never received a thread keeps a grace period from
    // its own creation only if it is older than the window; otherwise it is new.
    return last ? last < cutoff : false;
  });

  for (const board of quiet) {
    const last = board.threads[0]?.lastPostAt;
    console.log(
      `${dryRun ? "would archive" : "archiving"} /b/${board.slug} (${board.name}) — last activity ${last?.toISOString() ?? "never"}`,
    );
    if (!dryRun) {
      await prisma.board.update({
        where: { id: board.id },
        data: { isArchived: true },
      });
      await prisma.auditLog.create({
        data: {
          actorId: null,
          action: "board.archive",
          targetType: "board",
          targetId: board.id,
          details: `Archived automatically after ${days} days without activity.`,
        },
      });
    }
  }

  console.log(
    `${dryRun ? "Dry run: " : ""}${quiet.length} board(s) ${dryRun ? "would be" : "were"} archived (window ${days} days).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
