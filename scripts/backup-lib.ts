import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

export type DatabaseReport = {
  ok: boolean;
  integrity: string;
  users: number;
  threads: number;
  posts: number;
  reports: number;
  latestThreads: string[];
};

/** Open a SQLite file in read-only fashion for an integrity and content check. */
export async function inspectDatabase(path: string): Promise<DatabaseReport> {
  const absolute = resolve(path);
  if (!existsSync(absolute)) {
    throw new Error(`Database file not found: ${absolute}`);
  }

  const client = new PrismaClient({ datasourceUrl: `file:${absolute}` });

  try {
    const rows = await client.$queryRawUnsafe<Array<{ integrity_check: string }>>(
      "PRAGMA integrity_check",
    );
    const [users, threads, posts, reports, latest] = await Promise.all([
      client.user.count(),
      client.thread.count(),
      client.post.count(),
      client.report.count(),
      client.thread.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { title: true },
      }),
    ]);

    const integrity = rows[0]?.integrity_check ?? "unknown";

    return {
      ok: integrity === "ok",
      integrity,
      users,
      threads,
      posts,
      reports,
      latestThreads: latest.map((thread) => thread.title),
    };
  } finally {
    await client.$disconnect();
  }
}
