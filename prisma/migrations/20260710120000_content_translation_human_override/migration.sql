-- Human-authored native-translation override for ContentTranslation.
-- `isHuman` pins a row so the machine translator never overwrites it and it is
-- always served over machine output. `stale` flags a human row whose English
-- source changed since it was written (still served, but surfaced for re-review).
ALTER TABLE "ContentTranslation" ADD COLUMN IF NOT EXISTS "isHuman" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ContentTranslation" ADD COLUMN IF NOT EXISTS "stale" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "ContentTranslation_locale_isHuman_idx" ON "ContentTranslation" ("locale", "isHuman");
