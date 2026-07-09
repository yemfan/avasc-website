import { AlertPreferencesForm } from "@/components/alerts/AlertPreferencesForm";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardAlertPreferencesPage() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: {
      OR: [{ email: user.email }],
    },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">Alert Preferences</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your realtime SMS alerts and email digest settings.
        </p>
      </section>

      <AlertPreferencesForm subscription={subscription} />
    </div>
  );
}
