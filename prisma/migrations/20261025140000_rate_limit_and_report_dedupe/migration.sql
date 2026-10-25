-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Report_reporterId_postId_idx" ON "Report"("reporterId", "postId");


-- One open report per (reporter, post): a second click updates nothing instead
-- of stacking duplicates in the queue. SQLite supports partial indexes.
CREATE UNIQUE INDEX "Report_one_open_per_reporter_post"
  ON "Report"("reporterId", "postId")
  WHERE "resolvedAt" IS NULL AND "reporterId" IS NOT NULL;
