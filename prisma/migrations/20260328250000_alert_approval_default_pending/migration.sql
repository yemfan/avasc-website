-- Handoff package: default approvalStatus PENDING; keep INTERNAL/MANUAL/system rows APPROVED
ALTER TABLE "Alert" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "Alert" ALTER COLUMN "approvalStatus" SET DEFAULT 'PENDING';

UPDATE "Alert"
SET "approvalStatus" = 'APPROVED'
WHERE "sourceType" IS NULL OR "sourceType" IN ('INTERNAL', 'MANUAL');
