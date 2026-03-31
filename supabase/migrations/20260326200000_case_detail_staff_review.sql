-- Staff review flags for indicators and evidence (admin case detail workflow).

ALTER TABLE "CaseIndicator"
    ADD COLUMN IF NOT EXISTS "staffReview" TEXT NOT NULL DEFAULT 'none';

ALTER TABLE "EvidenceFile"
    ADD COLUMN IF NOT EXISTS "staffReviewStatus" TEXT NOT NULL DEFAULT 'none';
