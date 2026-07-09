-- On-demand translation cache for public DB content (blog, alerts, briefings, stories).
-- English is canonical; each row holds one entity's translated fields for one
-- non-English locale, keyed by a hash of the English source so edits invalidate it.
CREATE TABLE "ContentTranslation" (
  "id"         UUID NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId"   TEXT NOT NULL,
  "locale"     TEXT NOT NULL,
  "sourceHash" TEXT NOT NULL,
  "fields"     JSONB NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContentTranslation_entityType_entityId_locale_key"
  ON "ContentTranslation" ("entityType", "entityId", "locale");

CREATE INDEX "ContentTranslation_entityType_entityId_idx"
  ON "ContentTranslation" ("entityType", "entityId");
