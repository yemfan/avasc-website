import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type AvascCardProps = React.ComponentProps<typeof Card>;

function AvascCard({ className, ...props }: AvascCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-border/90 bg-card shadow-none hover:border-avasc-gold/15 hover:shadow-[0_0_0_1px_rgba(197,139,43,0.08)]",
        className
      )}
      {...props}
    />
  );
}

export {
  AvascCard,
  CardHeader as AvascCardHeader,
  CardTitle as AvascCardTitle,
  CardDescription as AvascCardDescription,
  CardContent as AvascCardContent,
  CardFooter as AvascCardFooter,
};
