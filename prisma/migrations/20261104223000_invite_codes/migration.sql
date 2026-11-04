-- Single-use registration codes, and an anonymisation marker on the account.
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;

CREATE TABLE "InviteCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeHash" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" DATETIME,
    "usedById" TEXT,
    CONSTRAINT "InviteCode_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "InviteCode_codeHash_key" ON "InviteCode"("codeHash");
CREATE INDEX "InviteCode_usedAt_idx" ON "InviteCode"("usedAt");
