"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@prisma/client";
import { getAdminNavItemsForRole } from "@/components/admin/admin-nav-config";
import { avascNavItemClass } from "@/components/avasc/nav-link-styles";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils/cn";

/** Shown below `lg` when the sidebar is hidden. */
export function AdminMobileNav({ user }: { user: User }) {
  const pathname = usePathname();
  const items = getAdminNavItemsForRole(user.role);

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-[var(--avasc-divider)] bg-[var(--avasc-bg-soft)]/95 px-2 py-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Admin sections"
    >
      {items.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("shrink-0 rounded-lg px-2 py-1.5 text-[10px] font-medium", avascNavItemClass(active))}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
