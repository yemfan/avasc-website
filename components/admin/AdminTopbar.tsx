import type { User } from "@prisma/client";
import { LogoutButton } from "@/components/auth/LogoutButton";

type AdminTopbarProps = {
  user: User;
};

export function AdminTopbar({ user }: AdminTopbarProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Admin Console</h1>
          <p className="text-sm text-muted-foreground">
            Review reports, moderate content, and manage scam intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user.displayName || "Admin"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
