"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

export type AvascDialogContentProps = React.ComponentProps<typeof DialogContent>;

function AvascDialogContent({ className, ...props }: AvascDialogContentProps) {
  return <DialogContent className={cn("rounded-2xl border-border bg-card", className)} {...props} />;
}

export {
  Dialog as AvascDialog,
  DialogTrigger as AvascDialogTrigger,
  AvascDialogContent,
  DialogHeader as AvascDialogHeader,
  DialogTitle as AvascDialogTitle,
  DialogDescription as AvascDialogDescription,
  DialogClose as AvascDialogClose,
};
