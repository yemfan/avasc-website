import type { ReactNode } from "react";
import { DashboardShell } from "@/components/avasc/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
