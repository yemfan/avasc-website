"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

export type AvascSelectTriggerProps = React.ComponentProps<typeof SelectTrigger>;

function AvascSelectTrigger({ className, ...props }: AvascSelectTriggerProps) {
  return <SelectTrigger className={cn("w-full rounded-xl", className)} {...props} />;
}

export {
  Select as AvascSelect,
  SelectContent as AvascSelectContent,
  SelectGroup as AvascSelectGroup,
  SelectItem as AvascSelectItem,
  SelectLabel as AvascSelectLabel,
  SelectSeparator as AvascSelectSeparator,
  SelectValue as AvascSelectValue,
  AvascSelectTrigger,
};
