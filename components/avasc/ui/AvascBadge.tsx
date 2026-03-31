import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export type AvascBadgeProps = BadgeProps;

function AvascBadge({ className, ...props }: AvascBadgeProps) {
  return <Badge className={cn("rounded-lg font-semibold", className)} {...props} />;
}

export { AvascBadge };
