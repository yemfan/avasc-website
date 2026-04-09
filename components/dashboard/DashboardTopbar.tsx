import Link from "next/link";
import { Bell } from "lucide-react";
import type { User } from "@prisma/client";
import { LogoutButton } from "@/components/auth/LogoutButton";

type DashboardTopbarProps = {
  user: User;
  unreadAlertCount: number;
};

export function DashboardTopbar({ user, unreadAlertCount }: DashboardTopbarProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your reports, alerts, and support activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/alerts"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border"
            aria-label={
              unreadAlertCount > 0 ? `Alerts, ${unreadAlertCount} unread` : "Alerts"
            }
          >
            <Bell className="h-5 w-5" aria-hidden />
            {unreadAlertCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {unreadAlertCount > 99 ? "99+" : unreadAlertCount}
              </span>
            ) : null}
          </Link>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user.displayName || "Supporter"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
