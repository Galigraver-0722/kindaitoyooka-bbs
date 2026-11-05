-- Launch hardening: durable deletion timestamps, safety holds, moderation
-- flags for public metadata, and indexes for pulse/retention queries.

ALTER TABLE "Thread" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "Thread" ADD COLUMN "safetyHoldUntil" DATETIME;
ALTER TABLE "Post" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "Post" ADD COLUMN "safetyHoldUntil" DATETIME;

-- Existing soft-deleted rows have no separate timestamp. `updatedAt` is the
-- best available approximation; future deletions write the exact moment.
UPDATE "Thread" SET "deletedAt" = "updatedAt" WHERE "isDeleted" = 1;
UPDATE "Post" SET "deletedAt" = "updatedAt" WHERE "isDeleted" = 1;

CREATE INDEX "Thread_updatedAt_idx" ON "Thread"("updatedAt");
CREATE INDEX "Post_updatedAt_idx" ON "Post"("updatedAt");
CREATE INDEX "ThreadLike_createdAt_idx" ON "ThreadLike"("createdAt");
CREATE INDEX "PostLike_createdAt_idx" ON "PostLike"("createdAt");
CREATE INDEX "ThreadBookmark_createdAt_idx" ON "ThreadBookmark"("createdAt");
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");

CREATE TABLE "ModerationFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "words" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'SCANNER',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    "resolvedById" TEXT,
    CONSTRAINT "ModerationFlag_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "ModerationFlag_status_createdAt_idx" ON "ModerationFlag"("status", "createdAt");
CREATE INDEX "ModerationFlag_targetType_targetId_idx" ON "ModerationFlag"("targetType", "targetId");
