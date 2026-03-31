import type { User } from "@prisma/client";
import { LogoutButton } from "@/components/auth/LogoutButton";

type DashboardTopbarProps = {
  user: User;
};

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your reports, support requests, and next steps.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
