-- Staff RBAC, moderation metadata, cluster editorial fields.

ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'viewer';

ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "name" TEXT;

ALTER TABLE "Case"
    ADD COLUMN IF NOT EXISTS "internalNotes" TEXT;

ALTER TABLE "CaseIndicator"
    ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "confidenceScore" DOUBLE PRECISION;

ALTER TABLE "Story"
    ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

ALTER TABLE "Comment"
    ADD COLUMN IF NOT EXISTS "flagReason" TEXT;

ALTER TABLE "ScamCluster"
    ADD COLUMN IF NOT EXISTS "commonScript" TEXT,
    ADD COLUMN IF NOT EXISTS "redFlags" TEXT,
    ADD COLUMN IF NOT EXISTS "safetyWarning" TEXT,
    ADD COLUMN IF NOT EXISTS "recommendedNextStep" TEXT;
