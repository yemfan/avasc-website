import type { Case } from "@prisma/client";

type AdminCaseNarrativeCardProps = {
  record: Case;
};

export function AdminCaseNarrativeCard({ record }: AdminCaseNarrativeCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Narrative</h3>

      <div className="mt-4 space-y-5">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Summary</h4>
          <p className="mt-2 text-sm leading-7">{record.summary}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Full Narrative</h4>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7">
            {record.fullNarrative || "No additional narrative provided."}
          </p>
        </div>

        {record.internalNotes ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="text-sm font-medium text-amber-900">Internal Notes</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm text-amber-900">
              {record.internalNotes}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
