import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/require-role";
import { BriefingsAdminView } from "@/app/admin/_briefings/BriefingsAdminView";

export const dynamic = "force-dynamic";

export default async function AdminWeeklyNewsPage() {
  await requireRole([UserRole.admin, UserRole.moderator]);
  return <BriefingsAdminView kind="weekly" />;
}
