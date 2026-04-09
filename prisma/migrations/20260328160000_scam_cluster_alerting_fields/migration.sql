-- AlterTable
ALTER TABLE "ScamCluster" ADD COLUMN "threatScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ScamCluster" ADD COLUMN "reportCountSnapshot" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ScamCluster" ADD COLUMN "lastAlertedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ScamCluster_lastAlertedAt_idx" ON "ScamCluster"("lastAlertedAt");
