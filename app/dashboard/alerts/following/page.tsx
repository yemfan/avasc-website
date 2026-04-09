import { FollowedScamsList } from "@/components/alerts/FollowedScamsList";
import { getFollowedScams } from "@/lib/alerts/get-followed-scams";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardFollowedScamsPage() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [{ email: user.email }],
    },
  });

  const followed = subscription ? await getFollowedScams(subscription.id) : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">Followed Scams</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the scam profiles you are following for future alerts and updates.
        </p>
      </section>

      <FollowedScamsList items={followed} />
    </div>
  );
}
