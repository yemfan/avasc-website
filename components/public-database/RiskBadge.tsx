import { Badge } from "@/components/ui/badge";
import { describeRiskLevelForAudience } from "@/lib/public-database/public-indicator-display";
import type { PublicRiskLevel } from "@/lib/public-database/public-profile-types";
import { cn } from "@/lib/utils/cn";

const VARIANT: Record<PublicRiskLevel, "default" | "secondary" | "warning" | "danger"> = {
  CRITICAL: "danger",
  HIGH: "warning",
  MEDIUM: "secondary",
  LOW: "secondary",
};

export function RiskBadge({
  level,
  className,
}: {
  level: PublicRiskLevel;
  className?: string;
}) {
  return (
    <Badge
      variant={VARIANT[level]}
      className={cn("font-semibold tracking-wide", className)}
      title={describeRiskLevelForAudience(level)}
    >
      Risk: {level}
    </Badge>
  );
}
