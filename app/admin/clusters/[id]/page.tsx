import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { UserRole } from "@prisma/client";
import { getAdminClusterDetail } from "@/lib/admin/get-admin-cluster-detail";

import { AdminClusterHeader } from "@/components/admin/cluster-detail/AdminClusterHeader";
import { AdminClusterSummaryCard } from "@/components/admin/cluster-detail/AdminClusterSummaryCard";
import { AdminClusterCasesCard } from "@/components/admin/cluster-detail/AdminClusterCasesCard";
import { AdminClusterIndicatorsCard } from "@/components/admin/cluster-detail/AdminClusterIndicatorsCard";
import { AdminClusterMergeSuggestionsCard } from "@/components/admin/cluster-detail/AdminClusterMergeSuggestionsCard";
import { AdminClusterEditCard } from "@/components/admin/cluster-detail/AdminClusterEditCard";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminClusterDetailPage({ params }: PageProps) {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const { id } = await params;
  const cluster = await getAdminClusterDetail(id);

  if (!cluster) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminClusterHeader cluster={cluster} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <AdminClusterSummaryCard cluster={cluster} />
          <AdminClusterCasesCard caseLinks={cluster.caseLinks} />
          <AdminClusterIndicatorsCard indicators={cluster.indicatorAggregates} />
          <AdminClusterMergeSuggestionsCard
            sourceMerges={cluster.sourceMerges}
            targetMerges={cluster.targetMerges}
          />
        </div>

        <div className="space-y-6">
          <AdminClusterEditCard cluster={cluster} />
        </div>
      </div>
    </div>
  );
}
