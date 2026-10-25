-- SQLite cannot add a column whose default is a function, so the column starts
-- with a constant and is backfilled from the row's own timestamps. Prisma's
-- @updatedAt keeps it current on every write; the default is only a fallback.
ALTER TABLE "Thread" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00';
UPDATE "Thread" SET "updatedAt" = "lastPostAt";

ALTER TABLE "Post" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00';
UPDATE "Post" SET "updatedAt" = "createdAt";
