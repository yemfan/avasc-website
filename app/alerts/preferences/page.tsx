import { AlertPreferencesForm } from "@/components/alerts/AlertPreferencesForm";
import { SectionShell } from "@/components/avasc/layout/SectionShell";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

export default async function AlertPreferencesPage() {
  const user = await requireUser();

  const sub = await prisma.subscription.findFirst({
    where: { email: user.email },
    select: {
      id: true,
      email: true,
      phone: true,
      smsEnabled: true,
      emailDaily: true,
      emailWeekly: true,
      isActive: true,
    },
  });

  return (
    <SectionShell>
      <div className="mx-auto max-w-xl">
        <AlertPreferencesForm subscription={sub} />
      </div>
    </SectionShell>
  );
}
