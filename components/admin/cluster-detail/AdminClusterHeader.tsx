import { ScamCluster } from "@prisma/client";

type AdminClusterHeaderProps = {
  cluster: ScamCluster;
};

export function AdminClusterHeader({ cluster }: AdminClusterHeaderProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Cluster ID: {cluster.id}</p>
          <h2 className="text-2xl font-bold tracking-tight">{cluster.title}</h2>
          <p className="text-sm text-muted-foreground">{cluster.scamType}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{cluster.publicStatus}</Badge>
          <Badge variant="outline">{cluster.riskLevel}</Badge>
        </div>
      </div>
    </section>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground"
      : "bg-black text-white";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}
