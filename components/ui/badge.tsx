import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "border-avasc-gold/35 bg-avasc-gold/15 text-avasc-gold-light",
        secondary: "border-border bg-muted/60 text-muted-foreground",
        outline: "border-border text-foreground",
        success: "border-risk-low/40 bg-risk-low/15 text-risk-low",
        warning: "border-risk-medium/40 bg-risk-medium/15 text-risk-medium",
        danger: "border-risk-high/40 bg-risk-high/15 text-risk-high",
        info: "border-avasc-cyan/40 bg-avasc-cyan/10 text-avasc-cyan",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
