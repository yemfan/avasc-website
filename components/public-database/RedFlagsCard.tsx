import { AlertTriangle } from "lucide-react";

export function RedFlagsCard({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Staff are still curating common warning signs for this pattern. Review the summary and public indicators
        above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-slate-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
