import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export function ScamTypeBadge({ scamType, className }: { scamType: string; className?: string }) {
  const label = scamType.replace(/_/g, " ");
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", className)}>
      {label}
    </Badge>
  );
}
