/**
 * Apply the retention schedule from the privacy notice.
 *
 *   pnpm purge          # run from cron, e.g. nightly
 *
 *  - refused-write excerpts: 7 days
 *  - deleted post bodies: 90 days after deletion
 *  - reports: 1 year
 *  - audit log rows: 3 years
 *  - expired sessions
 *
 * Nothing else is touched: live posts, accounts and backups are handled by the
 * backup wrapper (30-day rotation) and by the maintainer.
 */
import { prisma } from "../src/lib/db";

const DAY = 24 * 60 * 60 * 1000;
const before = (days: number) => new Date(Date.now() - days * DAY);

async function main() {
  const sessions = await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  const blocked = await prisma.blockedAttempt.deleteMany({ where: { createdAt: { lt: before(7) } } });
  const bodies = await prisma.post.updateMany({
    where: { isDeleted: true, body: { not: "" }, updatedAt: { lt: before(90) } },
    data: { body: "" },
  });
  const reports = await prisma.report.deleteMany({ where: { createdAt: { lt: before(365) } } });
  const audits = await prisma.auditLog.deleteMany({ where: { createdAt: { lt: before(365 * 3) } } });

  console.log(
    [
      `sessions: ${sessions.count}`,
      `blocked excerpts: ${blocked.count}`,
      `deleted bodies erased: ${bodies.count}`,
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
