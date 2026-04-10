import type { ReactNode } from "react";
import { AppShell } from "@/components/avasc/layout/AppShell";

/** Global nav + footer on every route (including homepage) for consistent, professional chrome. */
export function ConditionalAppShell({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
