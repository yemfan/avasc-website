import type { PublicIndicatorGroup as Group } from "@/lib/public-database/public-profile-types";

export function PublicIndicatorGroupList({ groups }: { groups: Group[] }) {
  if (groups.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-slate-600">
        There aren’t any staff-approved public clues on this profile yet. When moderation adds safe indicators, they’ll
        show up here — you can still use the summary and red flags above.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g.type} aria-labelledby={`ind-${g.type}`}>
          <h3 id={`ind-${g.type}`} className="text-base font-semibold text-slate-900">
            {g.label}
          </h3>
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {g.items.map((row, i) => (
              <li
                key={`${g.type}-${i}-${row.displayValue.slice(0, 12)}`}
                className="flex flex-wrap items-start justify-between gap-2 px-4 py-3 text-sm"
              >
                <span className="max-w-full break-words text-slate-900">{row.displayValue}</span>
                {row.caseCount > 1 ? (
                  <span className="shrink-0 text-xs text-slate-500">
                    Seen across {row.caseCount} anonymized reports
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-slate-500">From an anonymized report</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
