import { PrismaClient } from "@prisma/client";

// In development, Next.js hot-reloads modules. Reusing one client across reloads
// avoids exhausting the SQLite connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
