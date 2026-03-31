import type { UserRole } from "@prisma/client";
export {
  type StaffRole,
  isStaffRole,
  canMutate,
  canMergeClusters,
  canManageUsers,
  canPublishAlerts,
} from "@/lib/auth/roles";

/** Case review UI and mutations (excludes read-only viewer role). */
export function canAccessCaseReview(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}
