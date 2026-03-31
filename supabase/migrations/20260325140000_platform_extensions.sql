-- Extends AVASC schema for full report wizard, indicator types, Prisma-aligned tables.
-- Safe to re-run fragments in SQL editor if some steps already applied (check errors).

-- New indicator kinds (search / entity linking)
ALTER TYPE "IndicatorType" ADD VALUE IF NOT EXISTS 'tx_hash';
ALTER TYPE "IndicatorType" ADD VALUE IF NOT EXISTS 'social_handle';
ALTER TYPE "IndicatorType" ADD VALUE IF NOT EXISTS 'alias';
ALTER TYPE "IndicatorType" ADD VALUE IF NOT EXISTS 'app_platform';

ALTER TABLE "Case"
    ADD COLUMN IF NOT EXISTS "summaryShort" TEXT,
    ADD COLUMN IF NOT EXISTS "recoveryStage" TEXT DEFAULT 'unspecified',
    ADD COLUMN IF NOT EXISTS "initialContactChannel" TEXT,
    ADD COLUMN IF NOT EXISTS "jurisdictionCountry" TEXT,
    ADD COLUMN IF NOT EXISTS "jurisdictionState" TEXT,
    ADD COLUMN IF NOT EXISTS "recoveryStage" TEXT DEFAULT 'unspecified',
    ADD COLUMN IF NOT EXISTS "allowFollowUp" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS "allowLawEnforcementReferral" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "allowCaseMatching" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS "allowAnonymizedPublicSearch" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "storyVisibilityCandidate" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "supportTypes" JSONB;

ALTER TABLE "EvidenceFile"
    ADD COLUMN IF NOT EXISTS "redactionStatus" TEXT DEFAULT 'none';

ALTER TABLE "Story"
    ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "linkedCaseId" TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Story_linkedCaseId_fkey'
    ) THEN
        ALTER TABLE "Story"
            ADD CONSTRAINT "Story_linkedCaseId_fkey"
            FOREIGN KEY ("linkedCaseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ScamCluster" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "scamType" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "publicStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ScamCluster_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ScamCluster_slug_key" ON "ScamCluster"("slug");

CREATE TABLE IF NOT EXISTS "ScamClusterCase" (
    "id" TEXT NOT NULL,
    "scamClusterId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    CONSTRAINT "ScamClusterCase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ScamClusterCase_cluster_case_key" ON "ScamClusterCase"("scamClusterId", "caseId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ScamClusterCase_scamClusterId_fkey'
    ) THEN
        ALTER TABLE "ScamClusterCase"
            ADD CONSTRAINT "ScamClusterCase_scamClusterId_fkey"
            FOREIGN KEY ("scamClusterId") REFERENCES "ScamCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ScamClusterCase_caseId_fkey'
    ) THEN
        ALTER TABLE "ScamClusterCase"
            ADD CONSTRAINT "ScamClusterCase_caseId_fkey"
            FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SupportRequest" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "caseId" TEXT,
    "supportType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "notes" TEXT,
    "assignedToUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SupportRequest_caseId_idx" ON "SupportRequest"("caseId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'SupportRequest_userId_fkey'
    ) THEN
        ALTER TABLE "SupportRequest"
            ADD CONSTRAINT "SupportRequest_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'SupportRequest_caseId_fkey'
    ) THEN
        ALTER TABLE "SupportRequest"
            ADD CONSTRAINT "SupportRequest_caseId_fkey"
            FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'SupportRequest_assignedToUserId_fkey'
    ) THEN
        ALTER TABLE "SupportRequest"
            ADD CONSTRAINT "SupportRequest_assignedToUserId_fkey"
            FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ScamAlert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "scamType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScamAlert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" UUID,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_entity_idx" ON "AuditLog"("entityType", "entityId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_actorUserId_fkey'
    ) THEN
        ALTER TABLE "AuditLog"
            ADD CONSTRAINT "AuditLog_actorUserId_fkey"
            FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
