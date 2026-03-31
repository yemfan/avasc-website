"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

export type AvascTabsListProps = React.ComponentProps<typeof TabsList>;

function AvascTabsList({ className, ...props }: AvascTabsListProps) {
  return <TabsList className={cn("h-11 rounded-xl border-border bg-muted/30", className)} {...props} />;
}

export { Tabs as AvascTabs, AvascTabsList, TabsTrigger as AvascTabsTrigger, TabsContent as AvascTabsContent };
