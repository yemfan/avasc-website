import type { ReactNode } from "react";
import type { User } from "@prisma/client";
import { DashboardSidebar } from "@/components/avasc/DashboardSidebar";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";

export type DashboardShellProps = {
  user: User;
  children: ReactNode;
};

/**
 * Victim dashboard chrome. Public `TopNavbar` + footer come from root `AppShell` — do not nest another top bar here.
 */
export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[var(--avasc-bg)]">
      <DashboardMobileNav />
      <div className="flex min-h-0">
        <DashboardSidebar user={user} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
