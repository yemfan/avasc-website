import { mergeClustersAction } from "@/app/admin/clusters/[id]/merge-actions";

type MergeSuggestionActionRowProps = {
  mergeSuggestionId: string;
  sourceClusterId: string;
  targetClusterId: string;
  directionLabel: string;
  clusterTitle: string;
  score: number;
  confidence: string;
  status: string;
  reasons: string[];
};

export function MergeSuggestionActionRow({
  mergeSuggestionId,
  sourceClusterId,
  targetClusterId,
  directionLabel,
  clusterTitle,
  score,
  confidence,
  status,
  reasons,
}: MergeSuggestionActionRowProps) {
  const canMerge = status === "PENDING";

  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-muted-foreground">{directionLabel}</p>
      <p className="mt-1 text-sm font-medium">{clusterTitle}</p>

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Pill>{confidence}</Pill>
        <Pill variant="outline">Score: {score}</Pill>
        <Pill variant="outline">{status}</Pill>
      </div>

      {reasons.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      ) : null}

      {canMerge ? (
        <form action={mergeClustersAction} className="mt-4">
          <input type="hidden" name="mergeSuggestionId" value={mergeSuggestionId} />
          <input type="hidden" name="sourceClusterId" value={sourceClusterId} />
          <input type="hidden" name="targetClusterId" value={targetClusterId} />

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Merge
            </button>
          </div>
        </form>
      ) : null}
    </div>
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
