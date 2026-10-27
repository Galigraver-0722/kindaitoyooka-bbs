-- CreateTable
CREATE TABLE "BlockedAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "words" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlockedAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BlockedAttempt_createdAt_idx" ON "BlockedAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "BlockedAttempt_userId_idx" ON "BlockedAttempt"("userId");
