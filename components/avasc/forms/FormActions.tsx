import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type FormActionsProps = {
  primaryLabel: string;
  primaryPendingLabel?: string;
  primaryButtonType?: "submit" | "button";
  isSubmitting?: boolean;
  secondaryLabel?: string;
  secondaryHref?: string;
  children?: ReactNode;
  className?: string;
};

const primaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-6 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

const secondaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--avasc-border)] px-6 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition hover:border-[var(--avasc-gold)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--avasc-gold)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-card)]";

export function FormActions({
  primaryLabel,
  primaryPendingLabel = "Submitting…",
  primaryButtonType = "submit",
  isSubmitting = false,
  secondaryLabel,
  secondaryHref,
  children,
  className,
}: FormActionsProps) {
  const showSecondary = Boolean(secondaryLabel && secondaryHref);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-[var(--avasc-divider)] pt-6 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 max-w-xl">{children}</div>

      <div className="flex flex-wrap gap-3 sm:justify-end">
        {showSecondary ? (
          <Link
            href={secondaryHref!}
            className={cn(secondaryClass, isSubmitting && "pointer-events-none opacity-50")}
            tabIndex={isSubmitting ? -1 : undefined}
            aria-disabled={isSubmitting}
          >
            {secondaryLabel}
          </Link>
        ) : null}

        <button
          type={primaryButtonType}
          disabled={isSubmitting}
          className={cn(primaryClass, isSubmitting && "cursor-wait opacity-80")}
        >
          {isSubmitting ? primaryPendingLabel : primaryLabel}
        </button>
      </div>
    </div>
  );
}
