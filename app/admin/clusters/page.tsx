import Link from "next/link";
import { ClusterPublicStatus, RiskLevel } from "@prisma/client";
import { DataTable } from "@/components/avasc/DataTable";
import { PageHeader } from "@/components/avasc/PageHeader";
import { RiskBadge } from "@/components/avasc/RiskBadge";
import { StatCard } from "@/components/avasc/StatCard";
import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { findClusterMergeSuggestions } from "@/lib/clustering";

export const dynamic = "force-dynamic";

type ClusterTableRow = {
  id: string;
  title: string;
  scamType: string;
  risk: string;
  cases: number;
  updatedAt: string;
};

export default async function AdminClustersPage() {
  const prisma = getPrisma();
  const staff = await requireStaff();
  const edit = canMutate(staff.role);

  const [clusters, publishedCount, pendingSuggestions, criticalCount, mergeSuggestions] =
    await Promise.all([
      prisma.scamCluster.findMany({
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { caseLinks: true } } },
      }),
      prisma.scamCluster.count({ where: { publicStatus: ClusterPublicStatus.PUBLISHED } }),
      prisma.clusterSuggestion.count({ where: { status: "PENDING" } }),
      prisma.scamCluster.count({ where: { riskLevel: RiskLevel.CRITICAL } }),
      edit ? findClusterMergeSuggestions(prisma) : Promise.resolve([]),
    ]);

  const mergeHints = edit ? mergeSuggestions.slice(0, 5) : [];
  const mergeSignalCount = edit ? mergeSuggestions.length : "—";

  const rows: ClusterTableRow[] = clusters.map((c) => ({
    id: c.id,
    title: c.title,
    scamType: c.scamType,
    risk: c.riskLevel,
    cases: c._count.caseLinks,
    updatedAt: c.updatedAt.toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intelligence"
        title="Scam Clusters"
        description="Review, search, and manage published and internal scam intelligence clusters."
        actions={
          edit ? (
            <Link
              href="/admin/clusters/new"
              className="inline-flex rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]"
            >
              New Cluster
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Published Clusters" value={publishedCount} />
        <StatCard label="Pending Suggestions" value={pendingSuggestions} />
        <StatCard
          label="Merge Signals"
          value={mergeSignalCount}
          hint={edit ? undefined : "Merge scan runs for users who can edit clusters."}
        />
        <StatCard label="Critical Risk" value={criticalCount} />
      </div>

      {mergeHints.length > 0 ? (
        <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-semibold text-white">Merge candidates</h2>
          <p className="mt-1 text-xs text-[var(--avasc-text-muted)]">
            High interconnect scores between cluster pairs — review before merging.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {mergeHints.map((m) => (
              <div
                key={`${m.sourceClusterId}-${m.targetClusterId}`}
                className="rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)]/40 p-4"
              >
                <p className="font-medium text-[var(--avasc-text-primary)]">
                  <Link
                    href={`/admin/clusters/${m.sourceClusterId}`}
                    className="text-[var(--avasc-gold-light)] hover:text-[var(--avasc-gold)]"
                  >
                    {m.sourceClusterTitle}
                  </Link>{" "}
                  ↔{" "}
                  <Link
                    href={`/admin/clusters/${m.targetClusterId}`}
                    className="text-[var(--avasc-gold-light)] hover:text-[var(--avasc-gold)]"
                  >
                    {m.targetClusterTitle}
                  </Link>
                </p>
                <p className="mt-1 text-xs text-[var(--avasc-text-secondary)]">
                  Interconnect {m.interconnectScore} · {m.confidenceLabel} · {m.pairCountAboveStrong}{" "}
                  pair(s)
                </p>
                <p className="mt-1 text-xs text-[var(--avasc-text-muted)]">{m.reasons[0]}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <DataTable
        caption="All scam clusters in the system, newest updates first."
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage="No clusters found. Create one to start linking cases."
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (row) => (
              <div>
                <p className="font-medium text-white">{row.title}</p>
                <p className="mt-1 text-xs text-[var(--avasc-text-secondary)]">{row.scamType}</p>
              </div>
            ),
          },
          {
            key: "risk",
            header: "Risk",
            cell: (row) => <RiskBadge level={row.risk} />,
          },
          {
            key: "cases",
            header: "Cases",
            cell: (row) => (
              <span className="text-[var(--avasc-text-secondary)]">{row.cases}</span>
            ),
          },
          {
            key: "updatedAt",
            header: "Updated",
            cell: (row) => (
              <span className="text-[var(--avasc-text-secondary)]">{row.updatedAt}</span>
            ),
          },
          {
            key: "actions",
            header: "",
            cell: (row) => (
              <Link
                href={`/admin/clusters/${row.id}`}
                className="inline-flex rounded-lg border border-[var(--avasc-border)] px-3 py-2 text-xs font-medium text-[var(--avasc-text-primary)] transition hover:border-[var(--avasc-gold)] hover:text-white"
              >
                View
              </Link>
            ),
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
