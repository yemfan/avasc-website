import { Info } from "lucide-react";

export function SafeInfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 text-sm text-sky-950">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
