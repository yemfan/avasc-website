"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Home, LayoutList, LifeBuoy, UserCircle } from "lucide-react";
import { avascNavItemClass } from "@/components/avasc/nav-link-styles";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/cases", label: "Cases", icon: LayoutList },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/stories", label: "Stories", icon: BookOpen },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
] as const;

export type DashboardMobileNavProps = {
  unreadAlertCount?: number;
};

/** Shown below `lg` when the sidebar is hidden — matches `DashboardShell` breakpoint. */
export function DashboardMobileNav({ unreadAlertCount = 0 }: DashboardMobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-[var(--avasc-divider)] bg-[var(--avasc-bg-soft)]/95 px-2 py-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavActive(pathname, href);
        const showBadge = href === "/dashboard/alerts" && unreadAlertCount > 0;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
              avascNavItemClass(active)
            )}
          >
            <span className="relative inline-flex">
              <Icon className="h-4 w-4" aria-hidden />
              {showBadge ? (
                <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--avasc-gold)] px-0.5 text-[8px] font-bold leading-none text-black">
                  {unreadAlertCount > 99 ? "99+" : unreadAlertCount}
                </span>
              ) : null}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
