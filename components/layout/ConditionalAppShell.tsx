"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/avasc/layout/AppShell";

/**
 * Homepage renders its own full marketing chrome (nav + footer). Other routes use the global {@link AppShell}.
 */
export function ConditionalAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") {
    return <>{children}</>;
  }
  return <AppShell>{children}</AppShell>;
}
