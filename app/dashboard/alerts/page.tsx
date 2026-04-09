import { AlertCenterList, type AlertCenterListItem } from "@/components/alerts/AlertCenterList";
import { markAllAlertsReadAction } from "@/app/dashboard/alerts/actions";
import { getUserAlertCenter } from "@/lib/alerts/get-user-alert-center";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardAlertsPage() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [{ email: user.email }],
    },
  });

  const rawFeed = subscription ? await getUserAlertCenter(subscription.id) : [];
  const feed: AlertCenterListItem[] = rawFeed.map((i) => ({
    id: i.id,
    title: i.title,
    message: i.message,
    alertType: i.alertType,
    channel: i.channel,
    isRead: i.isRead,
    createdAt: i.createdAt.toISOString(),
    scamCluster: i.scamCluster ? { slug: i.scamCluster.slug } : null,
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Alert Center</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View recent AVASC alerts, scam updates, and digest activity.
            </p>
          </div>

          <form action={markAllAlertsReadAction}>
            <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-medium">
              Mark All as Read
            </button>
          </form>
        </div>
      </section>

      <AlertCenterList items={feed} />
    </div>
  );
}
