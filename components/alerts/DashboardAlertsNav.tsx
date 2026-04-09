"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { avascNavItemClass } from "@/components/avasc/nav-link-styles";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/dashboard/alerts", label: "Alert center" },
  { href: "/dashboard/alerts/following", label: "Following" },
  { href: "/dashboard/alerts/preferences", label: "Preferences" },
] as const;

export function DashboardAlertsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 flex flex-wrap gap-2 border-b border-[var(--avasc-divider)] pb-3"
      aria-label="Alerts sections"
    >
      {LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn("rounded-xl px-4 py-2 text-sm font-medium", avascNavItemClass(active))}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
