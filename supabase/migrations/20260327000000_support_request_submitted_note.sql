-- Immutable copy of the victim's message at request time. Staff edits `notes` separately.
ALTER TABLE "SupportRequest" ADD COLUMN IF NOT EXISTS "submittedNote" TEXT;

UPDATE "SupportRequest"
SET "submittedNote" = "notes"
WHERE "submittedNote" IS NULL AND "notes" IS NOT NULL;
