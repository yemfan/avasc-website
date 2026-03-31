import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  icon?: ReactNode;
  className?: string;
};

const primaryCtaClass =
  "inline-flex rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

const secondaryCtaClass =
  "inline-flex rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition hover:border-[var(--avasc-gold)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

/**
 * Centered empty / zero-data pattern with optional primary + secondary actions.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      {icon ? (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-[var(--avasc-gold)]">
          {icon}
        </div>
      ) : null}

      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--avasc-text-secondary)]">
        {description}
      </p>

      {actionLabel && actionHref ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={actionHref} className={primaryCtaClass}>
            {actionLabel}
          </Link>
          {secondaryActionLabel && secondaryActionHref ? (
            <Link href={secondaryActionHref} className={secondaryCtaClass}>
              {secondaryActionLabel}
            </Link>
          ) : null}
        </div>
      ) : secondaryActionLabel && secondaryActionHref ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={secondaryActionHref} className={secondaryCtaClass}>
            {secondaryActionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
