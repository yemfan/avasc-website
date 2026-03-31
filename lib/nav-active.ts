/** True when `pathname` is exactly `href` or a nested route under `href` (e.g. /admin vs /admin/cases). */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}
