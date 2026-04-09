import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { UserRole } from "@prisma/client";
import { getAdminCaseDetail } from "@/lib/admin/get-admin-case-detail";
import { getCaseReviewWorkflowData } from "@/lib/admin/get-case-review-workflow-data";

import { AvascAdminReviewWorkflow } from "@/components/admin/case-detail/AvascAdminReviewWorkflow";
import { AdminCaseHeader } from "@/components/admin/case-detail/AdminCaseHeader";
import { AdminCaseSummaryCard } from "@/components/admin/case-detail/AdminCaseSummaryCard";
import { AdminCaseNarrativeCard } from "@/components/admin/case-detail/AdminCaseNarrativeCard";
import { AdminCaseIndicatorsCard } from "@/components/admin/case-detail/AdminCaseIndicatorsCard";
import { AdminCaseEvidenceCard } from "@/components/admin/case-detail/AdminCaseEvidenceCard";
import { AdminCaseSupportCard } from "@/components/admin/case-detail/AdminCaseSupportCard";
import { AdminCaseAuditCard } from "@/components/admin/case-detail/AdminCaseAuditCard";
import { AdminCaseMatchCard } from "@/components/admin/case-detail/AdminCaseMatchCard";
import { AdminCaseModerationCard } from "@/components/admin/case-detail/AdminCaseModerationCard";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminCaseDetailPage({ params }: PageProps) {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const { id } = await params;
  const record = await getAdminCaseDetail(id);
  if (!record) notFound();

  const reviewWorkflow = await getCaseReviewWorkflowData(id);

  return (
    <div className="space-y-6">
      <AdminCaseHeader record={record} />

      {reviewWorkflow ? <AvascAdminReviewWorkflow caseId={id} data={reviewWorkflow} /> : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <AdminCaseSummaryCard record={record} />
          <AdminCaseNarrativeCard record={record} />
          <AdminCaseIndicatorsCard indicators={record.indicators} />
          <AdminCaseEvidenceCard evidenceFiles={record.evidenceFiles} />
          <AdminCaseMatchCard matches={record.sourceMatches} />
        </div>

        <div className="space-y-6">
          <AdminCaseModerationCard record={record} />
          <AdminCaseSupportCard
            supportRequests={record.supportRequests}
            clusterLinks={record.clusterLinks}
            stories={record.stories}
          />
          <AdminCaseAuditCard caseId={record.id} />
        </div>
      </div>
    </div>
  );
}
