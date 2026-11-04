-- The console shows the current code, so the value itself has to be stored.
-- Older rows predate this column and stay NULL; the console then asks the
-- administrator to issue a new code.
ALTER TABLE "InviteCode" ADD COLUMN "code" TEXT;
