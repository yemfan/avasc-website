import { ScamCluster } from "@prisma/client";

type AdminClusterSummaryCardProps = {
  cluster: ScamCluster;
};

export function AdminClusterSummaryCard({
  cluster,
}: AdminClusterSummaryCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Cluster Summary</h3>

      <div className="mt-4 space-y-5">
        <Block label="Summary" value={cluster.summary} />
        <Block label="Red Flags" value={cluster.redFlags} />
        <Block label="Common Script" value={cluster.commonScript} />
        <Block label="Safety Warning" value={cluster.safetyWarning} />
        <Block
          label="Recommended Next Step"
          value={cluster.recommendedNextStep}
        />
      </div>
    </section>
  );
}

function Block({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-7">
        {value || "Not provided."}
      </p>
    </div>
  );
}
