import type { ReactNode } from "react";
import type { User } from "@prisma/client";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export type DashboardShellProps = {
  user: User;
  unreadAlertCount: number;
  children: ReactNode;
};

export function DashboardShell({ user, unreadAlertCount, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r bg-background lg:block">
          <DashboardSidebar user={user} unreadAlertCount={unreadAlertCount} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar user={user} unreadAlertCount={unreadAlertCount} />

          <div className="border-b lg:hidden">
            <DashboardMobileNav unreadAlertCount={unreadAlertCount} />
          </div>

          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
