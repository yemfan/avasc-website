import {
  ClusterPublicStatus,
  RiskLevel,
  ScamCluster,
  ScamClusterCase,
} from "@prisma/client";
import {
  assignCaseToClusterAction,
  createClusterFromCaseAction,
  removeCaseFromClusterAction,
} from "@/app/admin/cases/[id]/cluster-actions";

type ClusterLinkWithCluster = ScamClusterCase & {
  scamCluster: ScamCluster;
};

type ClusterSuggestionWithCluster = {
  id: string;
  suggestionType: string;
  confidenceLabel: string;
  fitScore: number | null;
  status: string;
  suggestedTitle: string | null;
  reasonsJson: unknown;
  suggestedCluster: ScamCluster | null;
};

type ClusterOption = Pick<
  ScamCluster,
  "id" | "title" | "scamType" | "publicStatus" | "riskLevel"
>;

type AdminCaseClusterAssignmentCardProps = {
  caseId: string;
  caseTitle: string;
  caseScamType: string;
  clusterLinks: ClusterLinkWithCluster[];
  clusterSuggestions: ClusterSuggestionWithCluster[];
  allClusters: ClusterOption[];
};

export function AdminCaseClusterAssignmentCard({
  caseId,
  caseTitle,
  caseScamType,
  clusterLinks,
  clusterSuggestions,
  allClusters,
}: AdminCaseClusterAssignmentCardProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Current Cluster Links</h3>

        <div className="mt-4 space-y-3">
          {clusterLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This case is not linked to any cluster yet.
            </p>
          ) : (
            clusterLinks.map((link) => (
              <div
                key={link.id}
                className="rounded-xl border p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">{link.scamCluster.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {link.scamCluster.scamType} • {link.scamCluster.publicStatus} •{" "}
                      {link.scamCluster.riskLevel}
                    </p>
                  </div>

                  <form action={removeCaseFromClusterAction}>
                    <input type="hidden" name="caseId" value={caseId} />
                    <input
                      type="hidden"
                      name="clusterId"
                      value={link.scamCluster.id}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border px-3 py-2 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Suggested Cluster Matches</h3>

        <div className="mt-4 space-y-3">
          {clusterSuggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cluster suggestions available yet.
            </p>
          ) : (
            clusterSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{suggestion.suggestionType}</Pill>
                  <Pill variant="outline">{suggestion.confidenceLabel}</Pill>
                  {typeof suggestion.fitScore === "number" ? (
                    <Pill variant="outline">Fit Score: {suggestion.fitScore}</Pill>
                  ) : null}
                  <Pill variant="outline">{suggestion.status}</Pill>
                </div>

                <div className="mt-3 text-sm">
                  {suggestion.suggestedCluster ? (
                    <p className="font-medium">
                      {suggestion.suggestedCluster.title}
                    </p>
                  ) : suggestion.suggestedTitle ? (
                    <p className="font-medium">{suggestion.suggestedTitle}</p>
                  ) : null}

                  {Array.isArray(suggestion.reasonsJson) &&
                  suggestion.reasonsJson.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {suggestion.reasonsJson.map((reason, idx) => (
                        <li key={idx}>{String(reason)}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Assign to Existing Cluster</h3>

        <form action={assignCaseToClusterAction} className="mt-4 space-y-4">
          <input type="hidden" name="caseId" value={caseId} />

          <div>
            <label
              htmlFor="clusterId"
              className="mb-2 block text-sm font-medium"
            >
              Select Cluster
            </label>
            <select
              id="clusterId"
              name="clusterId"
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                Choose a cluster
              </option>
              {allClusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id}>
                  {cluster.title} — {cluster.scamType} — {cluster.publicStatus}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Assign to Cluster
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Create New Cluster from Case</h3>

        <form action={createClusterFromCaseAction} className="mt-4 space-y-4">
          <input type="hidden" name="caseId" value={caseId} />

          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Cluster Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={`${caseScamType} - ${caseTitle}`}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="scamType" className="mb-2 block text-sm font-medium">
              Scam Type
            </label>
            <input
              id="scamType"
              name="scamType"
              required
              defaultValue={caseScamType}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="summary" className="mb-2 block text-sm font-medium">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={5}
              placeholder="Write a short internal/public-safe cluster summary..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="publicStatus"
                className="mb-2 block text-sm font-medium"
              >
                Public Status
              </label>
              <select
                id="publicStatus"
                name="publicStatus"
                defaultValue={ClusterPublicStatus.DRAFT}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {Object.values(ClusterPublicStatus).map((status) => (
                  <option key={status} value={status}>
                    {formatEnum(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="riskLevel"
                className="mb-2 block text-sm font-medium"
              >
                Risk Level
              </label>
              <select
                id="riskLevel"
                name="riskLevel"
                defaultValue={RiskLevel.MEDIUM}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {Object.values(RiskLevel).map((level) => (
                  <option key={level} value={level}>
                    {formatEnum(level)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Create Cluster
            </button>
          </div>
        </form>
      </section>
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

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
