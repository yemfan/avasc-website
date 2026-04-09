-- AlterTable
ALTER TABLE "Alert" ADD COLUMN "isPublicVisible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Alert" ADD COLUMN "isRealtimeVisible" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Alert" ADD COLUMN "isHomepageVisible" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Alert" ADD COLUMN "isDailyFeedVisible" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: keep existing public behavior for sent outbound alerts
UPDATE "Alert"
SET
  "isRealtimeVisible" = true,
  "isHomepageVisible" = true
WHERE
  "alertType" = 'REALTIME'
  AND "riskLevel" IN ('HIGH', 'CRITICAL');

UPDATE "Alert"
SET
  "isDailyFeedVisible" = true,
  "isHomepageVisible" = true
WHERE
  "alertType" = 'DAILY'
  AND "isSent" = true;

-- CreateIndex
CREATE INDEX "Alert_isPublicVisible_idx" ON "Alert"("isPublicVisible");

-- CreateIndex
CREATE INDEX "Alert_isHomepageVisible_idx" ON "Alert"("isHomepageVisible");
