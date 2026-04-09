-- External OneDrive JSON ingestion + outbound Alert approval metadata

ALTER TABLE "Alert"
ADD COLUMN "sourceType" TEXT,
ADD COLUMN "sourceName" TEXT,
ADD COLUMN "sourceFileId" TEXT,
ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'APPROVED',
ADD COLUMN "approvedByUserId" UUID,
ADD COLUMN "approvedAt" TIMESTAMP(3);

CREATE INDEX "Alert_approvalStatus_idx" ON "Alert"("approvalStatus");
CREATE INDEX "Alert_sourceType_idx" ON "Alert"("sourceType");

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_approvedByUserId_fkey"
  FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ExternalContentIngestion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sourceName" TEXT NOT NULL,
    "sourceFilePath" TEXT NOT NULL,
    "sourceFileId" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'ONEDRIVE',
    "contentType" TEXT NOT NULL,
    "checksum" TEXT,
    "sourcePayloadId" TEXT,
    "rawPayload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "linkedAlertId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalContentIngestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ExternalContentIngestion_sourceFileId_idx" ON "ExternalContentIngestion"("sourceFileId");
CREATE INDEX "ExternalContentIngestion_status_idx" ON "ExternalContentIngestion"("status");
CREATE INDEX "ExternalContentIngestion_contentType_idx" ON "ExternalContentIngestion"("contentType");
CREATE INDEX "ExternalContentIngestion_checksum_idx" ON "ExternalContentIngestion"("checksum");
CREATE INDEX "ExternalContentIngestion_sourcePayloadId_idx" ON "ExternalContentIngestion"("sourcePayloadId");

ALTER TABLE "ExternalContentIngestion" ADD CONSTRAINT "ExternalContentIngestion_linkedAlertId_fkey"
  FOREIGN KEY ("linkedAlertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;
