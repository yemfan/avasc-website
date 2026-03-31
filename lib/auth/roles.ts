import type { UserRole } from "@prisma/client";

export type StaffRole = Extract<UserRole, "admin" | "moderator">;

export function isStaffRole(role: UserRole): role is StaffRole {
  return role === "admin" || role === "moderator";
}

export function canMutate(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}

export function canMergeClusters(role: UserRole): boolean {
  return role === "admin";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "admin";
}

export function canPublishAlerts(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}
