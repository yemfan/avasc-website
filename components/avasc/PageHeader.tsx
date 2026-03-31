import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type PageHeaderProps = {
  title: string;
  description?: string;
  /** Optional kicker above the title (e.g. section label). */
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

/**
 * Primary page title block for dashboard and admin surfaces.
 * Uses AVASC tokens from `app/globals.css`.
 */
export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--avasc-gold-light)]/90">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
