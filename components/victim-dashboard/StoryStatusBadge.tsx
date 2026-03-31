import { Badge } from "@/components/ui/badge";
import type { ModerationStatus } from "@prisma/client";
import { storyStatusPresentation } from "@/lib/victim-dashboard/story-labels";
import { cn } from "@/lib/utils/cn";

export function StoryStatusBadge({
  status,
  publishedAt,
}: {
  status: ModerationStatus;
  publishedAt: Date | null;
}) {
  const p = storyStatusPresentation(status, publishedAt);
  return (
    <Badge variant="outline" className={cn("font-medium")} title={p.helper}>
      {p.label}
    </Badge>
  );
}
