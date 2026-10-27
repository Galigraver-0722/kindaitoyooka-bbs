-- Official announcements move from a code constant into the database so an
-- administrator can post a notice without a redeploy.
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publishedAt" DATETIME NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'notice',
    "titleJa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bodyJa" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Announcement_publishedAt_idx" ON "Announcement"("publishedAt");
