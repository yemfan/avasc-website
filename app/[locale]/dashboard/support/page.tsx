import { SupportRequestCard } from "@/components/victim-dashboard/SupportRequestCard";
import { EmptyState } from "@/components/victim-dashboard/EmptyState";
import { SafeInfoAlert } from "@/components/victim-dashboard/SafeInfoAlert";
import { requireAuthUser, getUserSupportRequests, getUserCases } from "@/lib/victim-dashboard";
import { getPrisma } from "@/lib/prisma";
import { SupportRequestForm } from "./SupportRequestForm";

export const dynamic = "force-dynamic";

export default async function DashboardSupportPage() {
  const user = await requireAuthUser();
  const prisma = getPrisma();
  const [requests, cases] = await Promise.all([
    getUserSupportRequests(prisma, user.id),
    getUserCases(user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Support</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          If you need emotional support, help reporting, or recovery guidance, ask here. We respond when we can — you’re
          not a burden for reaching out.
        </p>
      </div>

      <SafeInfoAlert>
        This is not emergency services. If you are in immediate danger, call your local emergency number.
      </SafeInfoAlert>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">New request</h2>
        <div id="support-form">
          <SupportRequestForm cases={cases.map((c) => ({ id: c.id, title: c.title }))} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Your requests</h2>
        {requests.length === 0 ? (
          <EmptyState
            title="No support requests yet"
            description="If something feels overwhelming or confusing, you can send a short note — we’ll route it to the team."
            actionLabel="Scroll up to request support"
            actionHref="#support-form"
          />
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <SupportRequestCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
