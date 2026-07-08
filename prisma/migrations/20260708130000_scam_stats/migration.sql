-- Year-over-year scam/fraud statistics for the public trend chart.
CREATE TABLE "ScamStat" (
  "id"            UUID NOT NULL,
  "metric"        TEXT NOT NULL,
  "year"          INTEGER NOT NULL,
  "valueBillions" DOUBLE PRECISION NOT NULL,
  "source"        TEXT NOT NULL,
  "sourceUrl"     TEXT NOT NULL,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ScamStat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ScamStat_metric_year_key" ON "ScamStat" ("metric", "year");
CREATE INDEX "ScamStat_metric_year_idx" ON "ScamStat" ("metric", "year");
