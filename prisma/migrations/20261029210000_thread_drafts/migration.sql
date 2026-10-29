-- One half-written thread per account and board; publishing deletes the row.
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Draft_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Draft_userId_boardId_key" ON "Draft"("userId", "boardId");
CREATE INDEX "Draft_userId_updatedAt_idx" ON "Draft"("userId", "updatedAt");
