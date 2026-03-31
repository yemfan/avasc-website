import { cn } from "@/lib/utils/cn";

/** Subtle gold highlight for active dashboard/admin nav items (sidebar + mobile). */
export function avascNavItemClass(active: boolean) {
  return cn(
    "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-soft)]",
    active
      ? "border border-[color-mix(in_srgb,var(--avasc-gold)_38%,transparent)] bg-[color-mix(in_srgb,var(--avasc-gold)_14%,transparent)] text-white shadow-[inset_0_1px_0_0_rgba(245,201,106,0.12)]"
      : "border border-transparent text-[var(--avasc-text-secondary)] hover:border-[var(--avasc-border)] hover:bg-white/[0.04] hover:text-white"
  );
}
