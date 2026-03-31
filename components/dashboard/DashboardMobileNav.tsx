"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, LayoutList, LifeBuoy, UserCircle } from "lucide-react";
import { avascNavItemClass } from "@/components/avasc/nav-link-styles";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/cases", label: "Cases", icon: LayoutList },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/stories", label: "Stories", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
] as const;

/** Shown below `lg` when the sidebar is hidden — matches `DashboardShell` breakpoint. */
export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-[var(--avasc-divider)] bg-[var(--avasc-bg-soft)]/95 px-2 py-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
              avascNavItemClass(active)
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
