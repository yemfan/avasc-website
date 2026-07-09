import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/require-role";
import { BriefingsAdminView } from "@/app/[locale]/admin/_briefings/BriefingsAdminView";

export const dynamic = "force-dynamic";

export default async function AdminDailyNewsPage() {
  await requireRole([UserRole.admin, UserRole.moderator]);
  return <BriefingsAdminView kind="daily" />;
}
