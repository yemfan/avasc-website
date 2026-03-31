import type { ReactNode } from "react";
import { DashboardMobileNav } from "./DashboardMobileNav";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";

export function DashboardShell({
  children,
  userName,
  userEmail,
}: {
  children: ReactNode;
  userName: string | null;
  userEmail: string | null;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f7f9]">
      <div className="mx-auto flex max-w-[1400px] gap-0">
        <DashboardSidebar />
        <div className="flex min-h-[calc(100vh-4rem)] min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          <DashboardTopbar userName={userName} userEmail={userEmail} />
          <div className="flex-1 px-4 py-8 sm:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
