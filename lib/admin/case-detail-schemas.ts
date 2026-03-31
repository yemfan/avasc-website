import { z } from "zod";
import { CaseStatus, CaseVisibility } from "@prisma/client";

export const caseStatusSchema = z.nativeEnum(CaseStatus);
export const caseVisibilitySchema = z.nativeEnum(CaseVisibility);

export const updateCaseCoreSchema = z.object({
  caseId: z.string().min(1),
  status: caseStatusSchema.optional(),
  visibility: caseVisibilitySchema.optional(),
  internalNotes: z.string().max(20000).optional().nullable(),
});

export const caseQuickActionSchema = z.object({
  caseId: z.string().min(1),
  intent: z.enum(["approve_anonymized", "keep_private", "flag_escalation", "mark_reviewed"]),
});

export const linkClusterSchema = z.object({
  caseId: z.string().min(1),
  clusterId: z.string().min(1),
});

export const indicatorUpdateSchema = z.object({
  indicatorId: z.string().min(1),
  value: z.string().min(1).max(500).optional(),
  isPublic: z.boolean().optional(),
  confidenceScore: z.coerce.number().int().min(0).max(100).optional().nullable(),
  staffReview: z.enum(["none", "verified", "suspicious"]).optional(),
});

export const evidenceReviewSchema = z.object({
  evidenceId: z.string().min(1),
  staffReviewStatus: z.enum(["none", "reviewed", "needs_redaction"]),
});

export type CaseQuickActionIntent = z.infer<typeof caseQuickActionSchema>["intent"];

/** UI labels for `CaseStatus` (database enum). */
export const CASE_STATUS_OPTIONS: { value: CaseStatus; label: string; description: string }[] = [
  { value: CaseStatus.NEW, label: "New", description: "New intake." },
  { value: CaseStatus.PENDING_REVIEW, label: "Pending review", description: "Awaiting staff triage." },
  { value: CaseStatus.NEEDS_FOLLOW_UP, label: "Needs follow-up", description: "Active follow-up or escalation." },
  { value: CaseStatus.CLUSTERED, label: "Clustered", description: "Linked to a scam cluster." },
  {
    value: CaseStatus.PUBLISHED_ANONYMIZED,
    label: "Published (anonymized)",
    description: "Used in anonymized public materials.",
  },
  { value: CaseStatus.CLOSED, label: "Closed", description: "No further action expected." },
];

export function workflowLabelForStatus(status: CaseStatus): string {
  return CASE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}
