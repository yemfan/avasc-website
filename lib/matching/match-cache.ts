/**
 * Optional persistence for precomputed case-to-case similarity (future).
 *
 * Suggested Prisma model (not applied in MVP — add when you need read-heavy dashboards):
 *
 * model CaseMatchCache {
 *   id            String   @id
 *   sourceCaseId  String   @map("sourceCaseId")
 *   targetCaseId  String   @map("targetCaseId")
 *   totalScore    Int      @map("totalScore")
 *   strengthLabel String   @map("strengthLabel")
 *   summaryJson   Json?    @map("summaryJson")
 *   computedAt    DateTime @map("computedAt")
 *   @@unique([sourceCaseId, targetCaseId])
 *   @@index([sourceCaseId, totalScore])
 * }
 *
 * Invalidate on: CaseIndicator CRUD, Case soft-merge, manual staff override.
 */

export type CaseMatchCachePayload = {
  sourceCaseId: string;
  targetCaseId: string;
  totalScore: number;
  strengthLabel: string;
  summaryJson: unknown;
  computedAt: Date;
};
