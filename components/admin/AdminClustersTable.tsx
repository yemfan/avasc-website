import Link from "next/link";
import { Prisma } from "@prisma/client";

type ClusterRow = Prisma.ScamClusterGetPayload<{
  include: {
    caseLinks: {
      select: {
        id: true;
      };
    };
    indicatorAggregates: {
      select: {
        id: true;
        indicatorType: true;
      };
    };
    _count: {
      select: {
        caseLinks: true;
        indicatorAggregates: true;
        sourceMerges: true;
        targetMerges: true;
      };
    };
  };
}>;

type AdminClustersTableProps = {
  clusters: ClusterRow[];
};

export function AdminClustersTable({ clusters }: AdminClustersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Scam Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Cases</th>
              <th className="px-4 py-3 font-medium">Indicators</th>
              <th className="px-4 py-3 font-medium">Merge Signals</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>

          <tbody>
            {clusters.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No clusters found for the current filters.
                </td>
              </tr>
            ) : (
              clusters.map((cluster) => (
                <tr
                  key={cluster.id}
                  className="border-t align-top hover:bg-muted/20"
                >
                  <td className="px-4 py-4">
                    <div className="max-w-[320px]">
                      <p className="font-medium">{cluster.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {cluster.summary}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {cluster.scamType}
                  </td>

                  <td className="px-4 py-4">
                    <Pill>{cluster.publicStatus}</Pill>
                  </td>

                  <td className="px-4 py-4">
                    <Pill variant="outline">{cluster.riskLevel}</Pill>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {cluster._count.caseLinks}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {cluster._count.indicatorAggregates}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {cluster._count.sourceMerges + cluster._count.targetMerges}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {cluster.updatedAt.toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/clusters/${cluster.id}`}
                      className="rounded-lg border px-3 py-2 text-xs font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Pill({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground"
      : "bg-muted text-foreground";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}
