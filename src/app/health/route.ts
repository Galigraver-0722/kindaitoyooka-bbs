import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Readiness check for the reverse proxy or an uptime monitor. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "ok" });
  } catch {
    return Response.json({ status: "error", database: "error" }, { status: 503 });
  }
}
