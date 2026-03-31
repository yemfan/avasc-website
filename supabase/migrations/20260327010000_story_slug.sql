ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- Deterministic fallback slug for existing rows.
UPDATE "Story"
SET "slug" = CONCAT('story-', LOWER(REPLACE(id::text, '-', '')))
WHERE "slug" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Story_slug_key" ON "Story"("slug");
