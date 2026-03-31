import type { CaseStatus, CaseVisibility } from "@prisma/client";

export type VictimCaseStatusPresentation = {
  label: string;
  description: string;
  tone: "neutral" | "progress" | "complete" | "attention";
};

const CASE_STATUS_MAP: Record<CaseStatus, VictimCaseStatusPresentation> = {
  NEW: {
    label: "Received",
    description: "We’ve received your report safely. Our team will review it; you don’t need to do anything else right now.",
    tone: "progress",
  },
  PENDING_REVIEW: {
    label: "Under review",
    description: "We’re looking at what you shared. We may reach out if a few more details would help.",
    tone: "progress",
  },
  NEEDS_FOLLOW_UP: {
    label: "More information helpful",
    description: "We may need a bit more from you to move forward — check your messages or support requests.",
    tone: "attention",
  },
  CLUSTERED: {
    label: "Linked to patterns",
    description: "Your report has been connected with similar cases for analysis. This helps protect others.",
    tone: "progress",
  },
  PUBLISHED_ANONYMIZED: {
    label: "Published (anonymized)",
    description: "A redacted, anonymized summary may appear in public education materials — not your identity.",
    tone: "complete",
  },
  CLOSED: {
    label: "Closed",
    description:
      "This report is closed on our side. You can still save evidence, request support, or file a new report if something else happens.",
    tone: "complete",
  },
};

export function presentCaseStatus(status: CaseStatus): VictimCaseStatusPresentation {
  return CASE_STATUS_MAP[status] ?? CASE_STATUS_MAP.NEW;
}

export function presentVisibility(v: CaseVisibility): { label: string; helper: string } {
  switch (v) {
    case "private":
      return {
        label: "Private",
        helper: "Your full report stays private to AVASC staff unless you choose otherwise.",
      };
    case "anonymized_public":
      return {
        label: "Shared anonymously",
        helper: "A redacted summary may be used for public education — not your identity.",
      };
    case "public_story_candidate":
      return {
        label: "Public summary allowed",
        helper: "You agreed that a public-facing summary could be published after review.",
      };
    default:
      return { label: String(v), helper: "" };
  }
}
