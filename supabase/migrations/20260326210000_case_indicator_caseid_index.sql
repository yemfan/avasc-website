-- Speed up “all indicators for case” lookups used by the matching engine.
CREATE INDEX IF NOT EXISTS "CaseIndicator_caseId_idx" ON "CaseIndicator" ("caseId");
