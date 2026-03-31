import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  className?: string;
};

/**
 * Compact metric tile for operational dashboards.
 */
export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-[var(--avasc-text-secondary)]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white tabular-nums">{value}</p>
          {hint ? <p className="mt-2 text-xs text-[var(--avasc-text-muted)]">{hint}</p> : null}
        </div>

        {icon ? (
          <div className="shrink-0 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] p-3 text-[var(--avasc-gold)]">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
