import Link from "next/link";
import type { User } from "@prisma/client";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export type DashboardSidebarProps = {
  user: User;
  unreadAlertCount: number;
};

export function DashboardSidebar({ user, unreadAlertCount }: DashboardSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-5">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          AVASC
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">Victim Support Portal</p>
      </div>

      <div className="px-4 py-4">
        <div className="rounded-xl border bg-muted/30 px-4 py-3">
          <p className="text-sm font-medium">{user.displayName || user.email}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{user.role}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-6">
        <DashboardNav unreadAlertCount={unreadAlertCount} />
      </div>
    </div>
  );
}
