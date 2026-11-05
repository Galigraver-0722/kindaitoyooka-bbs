/**
 * Apply the retention schedule from the privacy notice.
 *
 *   pnpm purge          # run from cron, e.g. nightly
 *
 *  - refused-write excerpts: 7 days
 *  - expired rate-limit rows: immediately after their window
 *  - deleted post bodies: 90 days after deletion
 *  - reports: 1 year
 *  - audit log rows: 3 years
 *  - expired sessions
 *
 * A safety case can set `safetyHoldUntil` on a post or thread. The hold pauses
 * body erasure until the advisor releases it; it does not make the content
 * public again.
 */
import { prisma } from "../src/lib/db";

const DAY = 24 * 60 * 60 * 1000;
const before = (days: number) => new Date(Date.now() - days * DAY);
const notHeld = (now: Date) => ({
  OR: [{ safetyHoldUntil: null }, { safetyHoldUntil: { lte: now } }],
});

async function main() {
  const now = new Date();
  const [sessions, blocked, limits, postBodies, threadBodies, reports, audits] = await Promise.all([
    prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.blockedAttempt.deleteMany({ where: { createdAt: { lt: before(7) } } }),
    prisma.rateLimit.deleteMany({ where: { resetAt: { lte: now } } }),
    prisma.post.updateMany({
      where: {
        isDeleted: true,
        body: { not: "" },
        deletedAt: { lt: before(90) },
        ...notHeld(now),
      },
      data: { body: "" },
    }),
    // Removing a thread sets Thread.isDeleted; its posts keep isDeleted=false.
    // Erase those bodies from the thread's deletion timestamp instead.
    prisma.post.updateMany({
      where: {
        body: { not: "" },
        isDeleted: false,
        thread: {
          isDeleted: true,
          deletedAt: { lt: before(90) },
          ...notHeld(now),
        },
        ...notHeld(now),
      },
      data: { body: "" },
    }),
    prisma.report.deleteMany({ where: { createdAt: { lt: before(365) } } }),
    prisma.auditLog.deleteMany({ where: { createdAt: { lt: before(365 * 3) } } }),
  ]);

  console.log(
    [
      `sessions: ${sessions.count}`,
      `blocked excerpts: ${blocked.count}`,
      `expired rate limits: ${limits.count}`,
      `deleted bodies erased: ${postBodies.count}`,
      `thread bodies erased: ${threadBodies.count}`,
      `reports: ${reports.count}`,
      `audit rows: ${audits.count}`,
    ].join(", "),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
