-- Granular fraud breakdowns (FTC / FBI IC3) — losses by payment method, contact
-- method, top crime types, etc. Complements the ScamStat year totals.
CREATE TABLE "ScamStatBreakdown" (
  "id"         UUID NOT NULL,
  "dimension"  TEXT NOT NULL,
  "source"     TEXT NOT NULL,
  "year"       INTEGER NOT NULL,
  "category"   TEXT NOT NULL,
  "valueUsd"   DOUBLE PRECISION,
  "valueCount" INTEGER,
  "rank"       INTEGER NOT NULL DEFAULT 0,
  "sourceUrl"  TEXT NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ScamStatBreakdown_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ScamStatBreakdown_dimension_year_category_key"
  ON "ScamStatBreakdown" ("dimension", "year", "category");

CREATE INDEX "ScamStatBreakdown_dimension_year_idx"
  ON "ScamStatBreakdown" ("dimension", "year");
