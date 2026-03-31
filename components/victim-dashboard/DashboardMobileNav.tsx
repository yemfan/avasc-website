"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HeartHandshake, Home, LayoutList, LifeBuoy, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/cases", label: "Cases", icon: LayoutList },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/stories", label: "Stories", icon: BookOpen },
  { href: "/recovery", label: "Recovery", icon: HeartHandshake },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
] as const;

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-white/95 px-2 py-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Dashboard sections"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
              active ? "bg-slate-900 text-white" : "text-slate-600"
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
