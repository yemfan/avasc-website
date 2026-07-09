-- Language the victim reported in (app locale: en | es | zh). Nullable; existing
-- rows stay NULL (treated as English). Used to keep the victim's original words
-- canonical and to route replies/translation-for-review.
ALTER TABLE "Case" ADD COLUMN IF NOT EXISTS "language" TEXT;
