import { CaseStatusBadge, VisibilityBadge } from "@/components/admin/AdminStatusBadge";
import type { CaseStatus, CaseVisibility } from "@prisma/client";

export function StatusBadge({ status }: { status: CaseStatus }) {
  return <CaseStatusBadge status={status} />;
}

export function CaseVisibilityStatusBadge({ visibility }: { visibility: CaseVisibility }) {
  return <VisibilityBadge visibility={visibility} />;
}
