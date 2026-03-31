import type { AdminClusterDetail } from "@/lib/admin/get-admin-cluster-detail";
import { MergeSuggestionActionRow } from "@/components/admin/cluster-detail/MergeSuggestionActionRow";

type AdminClusterMergeSuggestionsCardProps = {
  sourceMerges: AdminClusterDetail["sourceMerges"];
  targetMerges: AdminClusterDetail["targetMerges"];
};

export function AdminClusterMergeSuggestionsCard({
  sourceMerges,
  targetMerges,
}: AdminClusterMergeSuggestionsCardProps) {
  const items = [
    ...sourceMerges.map((item) => ({
      id: item.id,
      direction: "Suggested merge into",
      mergeSuggestionId: item.id,
      sourceClusterId: item.sourceClusterId,
      targetClusterId: item.targetCluster.id,
      score: item.interconnectScore,
      confidence: item.confidenceLabel,
      reasonsJson: item.reasonsJson,
      cluster: item.targetCluster,
      status: item.status,
    })),
    ...targetMerges.map((item) => ({
      id: item.id,
      direction: "Suggested merge from",
      mergeSuggestionId: item.id,
      sourceClusterId: item.sourceCluster.id,
      targetClusterId: item.targetClusterId,
      score: item.interconnectScore,
      confidence: item.confidenceLabel,
      reasonsJson: item.reasonsJson,
      cluster: item.sourceCluster,
      status: item.status,
    })),
  ];

  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Merge Suggestions</h3>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No merge suggestions for this cluster.
          </p>
        ) : (
          items.map((item) => (
            <MergeSuggestionActionRow
              key={item.id}
              mergeSuggestionId={item.mergeSuggestionId}
              sourceClusterId={item.sourceClusterId}
              targetClusterId={item.targetClusterId}
              directionLabel={item.direction}
              clusterTitle={item.cluster.title}
              score={item.score}
              confidence={item.confidence}
              status={item.status}
              reasons={
                Array.isArray(item.reasonsJson)
                  ? item.reasonsJson.map((reason) => String(reason))
                  : []
              }
            />
          ))
        )}
      </div>
    </section>
  );
}
