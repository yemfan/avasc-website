export * from "./layout";
export * from "./navigation";
export * from "./product";
export * from "./ui";

/** Dashboard / admin shell entrypoints (canonical implementations live in this folder). */
export { AdminShell, type AdminShellProps } from "./AdminShell";
export { DashboardShell, type DashboardShellProps } from "./DashboardShell";
export { avascNavItemClass } from "./nav-link-styles";
