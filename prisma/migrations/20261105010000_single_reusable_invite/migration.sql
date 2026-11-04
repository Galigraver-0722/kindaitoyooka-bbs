-- One reusable code at a time, plus a row per account that came in through it.
-- The old table tracked single use; map "used" rows to "retired" so the
-- previous codes stay as history while at most one remains active.

PRAGMA foreign_keys=OFF;

CREATE TABLE "new_InviteCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeHash" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retiredAt" DATETIME
);

INSERT INTO "new_InviteCode" ("id", "codeHash", "prefix", "note", "createdAt", "retiredAt")
SELECT "id", "codeHash", "prefix", "note", "createdAt", "usedAt" FROM "InviteCode";

DROP TABLE "InviteCode";
ALTER TABLE "new_InviteCode" RENAME TO "InviteCode";

CREATE UNIQUE INDEX "InviteCode_codeHash_key" ON "InviteCode"("codeHash");
CREATE INDEX "InviteCode_retiredAt_idx" ON "InviteCode"("retiredAt");

CREATE TABLE "InviteUse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InviteUse_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "InviteCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InviteUse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "InviteUse_userId_key" ON "InviteUse"("userId");
CREATE INDEX "InviteUse_codeId_idx" ON "InviteUse"("codeId");

PRAGMA foreign_keys=ON;
