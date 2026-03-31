"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@prisma/client";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils/cn";
import { avascNavItemClass } from "@/components/avasc/nav-link-styles";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/cases", label: "My Cases" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/stories", label: "Stories" },
  { href: "/dashboard/profile", label: "Profile" },
] as const;

export type DashboardSidebarProps = {
  user: User;
};

/**
 * Desktop sidebar for the victim dashboard. Pairs with {@link DashboardShell} and root {@link TopNavbar}.
 */
export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const accountLabel = user.displayName?.trim() || user.email || "Account";

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--avasc-divider)] bg-[var(--avasc-bg-soft)] lg:block">
      <div className="flex h-full min-h-[calc(100vh-4.5rem)] flex-col">
        <div className="border-b border-[var(--avasc-divider)] px-6 py-6">
          <Link
            href="/dashboard"
            className="rounded-md text-xl font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg-soft)]"
          >
            AVASC
          </Link>
          <p className="mt-1 text-sm text-[var(--avasc-text-secondary)]">Victim Dashboard</p>
        </div>

        <nav className="flex flex-1 flex-col space-y-1.5 overflow-y-auto px-4 py-6" aria-label="Dashboard">
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
          <p className="text-xs text-[var(--avasc-text-muted)]">
            <span className="font-medium text-[var(--avasc-text-primary)]">{accountLabel}</span>
          </p>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
