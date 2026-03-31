import { cn } from "@/lib/utils/cn";

export function IndicatorChip({
  type,
  value,
  verified = false,
  className,
}: {
  type: string;
  value: string;
  verified?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center rounded-full border px-3 py-1 text-xs transition-colors duration-150",
        verified
          ? "border-[rgba(197,139,43,0.32)] bg-[rgba(197,139,43,0.07)] text-[var(--avasc-gold-light)]"
          : "border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-[var(--avasc-text-secondary)]",
        className
      )}
    >
      <span className="truncate">
        {type}: {value}
      </span>
      {verified ? <span aria-hidden> ✓</span> : null}
    </span>
  );
}
