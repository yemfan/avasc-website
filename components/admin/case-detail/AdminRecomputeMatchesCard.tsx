import { recomputeMatchesAction } from "@/app/admin/cases/[id]/recompute-actions";

type AdminRecomputeMatchesCardProps = {
  caseId: string;
};

export function AdminRecomputeMatchesCard({
  caseId,
}: AdminRecomputeMatchesCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Recompute Matches</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Re-run indicator matching and refresh cached similar cases and cluster suggestions.
      </p>

      <form action={recomputeMatchesAction} className="mt-4">
        <input type="hidden" name="caseId" value={caseId} />
        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Recompute Matches
        </button>
      </form>
    </section>
  );
}
