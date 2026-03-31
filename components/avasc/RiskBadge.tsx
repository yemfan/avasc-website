import { cn } from "@/lib/utils/cn";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Muted, token-aligned risk chips (AVASC palette — calm, not consumer-neon). */
const styles: Record<RiskLevel, string> = {
  LOW: "border-[var(--risk-low)]/35 bg-[var(--risk-low)]/[0.09] text-[var(--risk-low)]",
  MEDIUM: "border-[var(--risk-medium)]/35 bg-[var(--risk-medium)]/[0.09] text-[var(--risk-medium)]",
  HIGH: "border-[var(--risk-high)]/35 bg-[var(--risk-high)]/[0.09] text-[var(--risk-high)]",
  CRITICAL: "border-[var(--risk-critical)]/40 bg-[var(--risk-critical)]/[0.12] text-red-300/95",
};

function normalizeRiskLevel(level: string): RiskLevel {
  const u = level.trim().toUpperCase();
  switch (u) {
    case "LOW":
    case "MINIMAL":
      return "LOW";
    case "MEDIUM":
    case "MODERATE":
      return "MEDIUM";
    case "HIGH":
    case "SEVERE":
      return "HIGH";
    case "CRITICAL":
    case "EXTREME":
      return "CRITICAL";
    default:
      return "MEDIUM";
  }
}

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel | string;
  className?: string;
}) {
  const L = typeof level === "string" ? normalizeRiskLevel(level) : level;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        styles[L],
        className
      )}
    >
      {L}
    </span>
  );
}
