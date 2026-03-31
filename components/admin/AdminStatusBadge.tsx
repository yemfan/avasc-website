import type {
  CaseStatus,
  CaseVisibility,
  CommentModerationStatus,
  ModerationStatus,
} from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatCaseStatus, formatCommentStatus, formatStoryStatus } from "@/lib/admin/format";

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const variant =
    status === "CLOSED"
      ? "secondary"
      : status === "PENDING_REVIEW" || status === "NEEDS_FOLLOW_UP"
        ? "warning"
        : status === "NEW"
          ? "outline"
          : "info";
  return <Badge variant={variant}>{formatCaseStatus(status)}</Badge>;
}

export function VisibilityBadge({ visibility }: { visibility: CaseVisibility }) {
  const variant =
    visibility === "public_story_candidate"
      ? "danger"
      : visibility === "anonymized_public"
        ? "warning"
        : "secondary";
  return <Badge variant={variant}>{visibility}</Badge>;
}

export function StoryStatusBadge({ status }: { status: ModerationStatus }) {
  const variant =
    status === "APPROVED"
      ? "success"
      : status === "REJECTED"
        ? "danger"
        : status === "FLAGGED"
          ? "warning"
          : status === "DRAFT"
            ? "outline"
            : "warning";
  return <Badge variant={variant}>{formatStoryStatus(status)}</Badge>;
}

export function CommentStatusBadge({ status }: { status: CommentModerationStatus }) {
  const variant =
    status === "APPROVED"
      ? "success"
      : status === "REJECTED" || status === "SPAM"
        ? "danger"
        : status === "FLAGGED"
          ? "warning"
          : "warning";
  return <Badge variant={variant}>{formatCommentStatus(status)}</Badge>;
}

export function RiskBadge({ level }: { level: string }) {
  const l = level.toLowerCase();
  const variant =
    l === "critical" ? "danger" : l === "high" ? "warning" : l === "low" ? "secondary" : "info";
  return <Badge variant={variant}>{level}</Badge>;
}
