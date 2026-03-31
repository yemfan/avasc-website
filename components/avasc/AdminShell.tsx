import type { ReactNode } from "react";
import type { User } from "@prisma/client";
import { AdminSidebar } from "@/components/avasc/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export type AdminShellProps = {
  user: User;
  children: ReactNode;
};

/**
 * Staff admin chrome. Public `TopNavbar` + footer come from root `AppShell` — do not nest another top bar here.
 */
export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[var(--avasc-bg)]">
      <AdminMobileNav user={user} />
      <div className="flex min-h-0">
        <AdminSidebar user={user} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
