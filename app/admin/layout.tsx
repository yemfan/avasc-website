import { UserRole } from "@prisma/client";
import { AdminShell } from "@/components/avasc/AdminShell";
import { requireRole } from "@/lib/auth/require-role";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole([UserRole.admin, UserRole.moderator]);

  return <AdminShell user={user}>{children}</AdminShell>;
}
