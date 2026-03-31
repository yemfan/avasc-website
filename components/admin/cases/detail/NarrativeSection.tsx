import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NarrativeSection({
  summaryShort,
  narrativePrivate,
  narrativePublic,
}: {
  summaryShort: string | null;
  narrativePrivate: string;
  narrativePublic: string | null;
}) {
  const longPrivate = narrativePrivate.length > 600;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Narrative</CardTitle>
        <p className="text-xs text-slate-500">Staff-only fields; expand long text as needed.</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {summaryShort ? (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Summary</p>
            <p className="mt-1.5 whitespace-pre-wrap text-slate-800">{summaryShort}</p>
          </div>
        ) : null}

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Full narrative (private)</p>
          {longPrivate ? (
            <details className="mt-2 group rounded-lg border border-slate-200 bg-slate-50/80">
              <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-700 marker:text-slate-400">
                Show full narrative ({narrativePrivate.length.toLocaleString()} characters)
              </summary>
              <div className="border-t border-slate-200 px-4 py-3">
                <p className="whitespace-pre-wrap text-slate-800">{narrativePrivate}</p>
              </div>
            </details>
          ) : (
            <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-slate-50/80 p-4 text-slate-800">
              {narrativePrivate}
            </p>
          )}
        </div>

        {narrativePublic ? (
          <details className="rounded-lg border border-slate-200 bg-white">
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-700">
              Public / anonymized narrative
            </summary>
            <div className="border-t border-slate-100 px-4 py-3">
              <p className="whitespace-pre-wrap text-slate-800">{narrativePublic}</p>
            </div>
          </details>
        ) : (
          <p className="text-xs text-slate-500">No public / anonymized narrative on file.</p>
        )}
      </CardContent>
    </Card>
  );
}
