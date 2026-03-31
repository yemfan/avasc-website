import type {
  CaseStatus,
  CommentModerationStatus,
  ModerationStatus,
} from "@prisma/client";

export function formatCaseStatus(status: CaseStatus): string {
  switch (status) {
    case "NEW":
      return "New";
    case "PENDING_REVIEW":
      return "Pending review";
    case "NEEDS_FOLLOW_UP":
      return "Needs follow-up";
    case "CLUSTERED":
      return "Clustered";
    case "PUBLISHED_ANONYMIZED":
      return "Published (anonymized)";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
}

export function formatStoryStatus(status: ModerationStatus): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "FLAGGED":
      return "Flagged";
    default:
      return status;
  }
}

export function formatCommentStatus(status: CommentModerationStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "FLAGGED":
      return "Flagged";
    case "SPAM":
      return "Spam";
    default:
      return status;
  }
}

export function formatCurrency(cents: number | null | undefined, currency: string | null | undefined) {
  if (cents == null) return "—";
  const cur = currency ?? "USD";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${cur}`;
  }
}

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
