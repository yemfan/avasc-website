"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  HeartHandshake,
  Home,
  LayoutList,
  LifeBuoy,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/cases", label: "My cases", icon: LayoutList },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/stories", label: "Stories", icon: BookOpen },
  { href: "/recovery", label: "Recovery center", icon: HeartHandshake },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200/80 bg-white/90 py-8 pl-4 pr-2 md:block lg:w-64">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Your space</p>
      <nav className="mt-6 flex flex-col gap-1" aria-label="Dashboard">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
