import { cn } from "@/lib/utils/cn";

/** Shared focus ring for text-like controls (inputs, textarea, select). */
export const AVASC_CONTROL_FOCUS =
  "focus-visible:border-[var(--avasc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--avasc-gold)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

const AVASC_CONTROL_SHELL =
  "w-full rounded-lg border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm leading-snug text-[var(--avasc-text-primary)] shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--avasc-text-muted)] disabled:cursor-not-allowed disabled:opacity-[0.55]";

/** Single-line style inputs + select. */
export function avascControlClassName(extra?: string) {
  return cn(AVASC_CONTROL_SHELL, "min-h-11", AVASC_CONTROL_FOCUS, extra);
}

/** Multi-line textarea. */
export function avascTextareaClassName(extra?: string) {
  return cn(AVASC_CONTROL_SHELL, "min-h-[5.5rem] resize-y", AVASC_CONTROL_FOCUS, extra);
}
