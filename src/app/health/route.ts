import { prisma } from "@/lib/db";
import { CHANNEL, VERSION } from "@/lib/version";

export const dynamic = "force-dynamic";

/**
 * Readiness check for the reverse proxy or an uptime monitor. The version and
 * channel are here so a deployment can be identified with one curl, without
 * reading the commit that happens to be on disk.
 */
export async function GET() {
  const build = { version: VERSION, channel: CHANNEL };
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "ok", ...build });
  } catch {
    return Response.json({ status: "error", database: "error", ...build }, { status: 503 });
  }
}
