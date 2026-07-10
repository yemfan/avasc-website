import { UserRole } from "@prisma/client";

export type AdminNavItem = {
  href: string;
  label: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/clusters", label: "Clusters" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/alerts", label: "Alerts" },
  { href: "/admin/alerts/visibility", label: "Alert surfaces" },
  { href: "/admin/weekly-news", label: "Weekly briefing" },
  { href: "/admin/daily-news", label: "Daily briefing" },
  { href: "/admin/social", label: "Social content" },
  { href: "/admin/translations", label: "Translations" },
  { href: "/admin/imports", label: "Imports" },
  { href: "/admin/audit", label: "Audit Log" },
  { href: "/admin/users", label: "Users" },
];

/** Moderators: no audit log or user management. */
export function getAdminNavItemsForRole(role: UserRole): AdminNavItem[] {
  if (role === UserRole.admin) return ADMIN_NAV_ITEMS;
  return ADMIN_NAV_ITEMS.filter(
    (item) => item.href !== "/admin/audit" && item.href !== "/admin/users"
  );
}
