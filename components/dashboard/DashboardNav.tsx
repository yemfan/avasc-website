"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type DashboardNavProps = {
  unreadAlertCount: number;
};

type NavItem = {
  href: string;
  label: string;
  badge?: number;
};

export function DashboardNav({ unreadAlertCount }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/cases", label: "My Cases" },
    { href: "/dashboard/support", label: "Support" },
    { href: "/dashboard/stories", label: "Stories" },
    { href: "/dashboard/alerts", label: "Alerts", badge: unreadAlertCount },
    { href: "/dashboard/alerts/following", label: "Following" },
    { href: "/dashboard/alerts/preferences", label: "Preferences" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <nav className="space-y-1" aria-label="Dashboard">
      {navItems.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-black text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>{item.label}</span>

            {item.badge != null && item.badge > 0 ? (
              <span
                className={clsx(
                  "inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
                  active ? "bg-white/20 text-white" : "bg-black text-white"
                )}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
