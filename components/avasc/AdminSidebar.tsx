"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@prisma/client";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAdminNavItemsForRole } from "@/components/admin/admin-nav-config";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils/cn";
import { avascNavItemClass } from "@/components/avasc/nav-link-styles";

export type AdminSidebarProps = {
  user: User;
};

/**
 * Desktop sidebar for staff admin routes. Pairs with {@link AdminShell} and root {@link TopNavbar}.
 */
export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const items = getAdminNavItemsForRole(user.role);
  const accountLabel = user.displayName?.trim() || user.email || "Account";

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--avasc-divider)] bg-[var(--avasc-bg-soft)] lg:block">
      <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
        <div className="border-b border-[var(--avasc-divider)] px-6 py-6">
          <Link
            href="/admin"
            className="rounded-md text-xl font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-soft)]"
          >
            AVASC Admin
          </Link>
          <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">Operations Console</p>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col space-y-1.5 overflow-y-auto px-4 py-6" aria-label="Admin">
          {items.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("block rounded-xl px-4 py-3 text-sm font-medium", avascNavItemClass(active))}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-[var(--avasc-divider)] px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--avasc-text-muted)]">
            {user.role}
          </p>
          <p className="text-sm text-[var(--avasc-text-primary)]">{accountLabel}</p>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
