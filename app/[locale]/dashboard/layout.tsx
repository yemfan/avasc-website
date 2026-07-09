import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getUnreadAlertCount } from "@/lib/alerts/get-unread-alert-count";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [{ email: user.email.toLowerCase() }],
    },
  });

  const unreadAlertCount = subscription ? await getUnreadAlertCount(subscription.id) : 0;

  return (
    <DashboardShell user={user} unreadAlertCount={unreadAlertCount}>
      {children}
    </DashboardShell>
  );
}
