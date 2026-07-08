import { UserRole } from "@prisma/client";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { requireRole } from "@/lib/auth/require-role";
import { listPublishedBriefings } from "@/lib/briefings/queries";

import { SocialGenerator } from "./SocialGenerator";
import { DailyAutopilotAdmin } from "./DailyAutopilotAdmin";

export const dynamic = "force-dynamic";

/**
 * Staff-only social content tool. Generates on-demand social posts from a published
 * briefing (not saved). The briefing is the canonical, cited content; social posts
 * are an ephemeral rendering the team copies out.
 */
export default async function SocialAdminPage() {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const briefings = await listPublishedBriefings(30);
  const options = briefings.map((b) => ({
    slug: b.slug,
    title: b.title,
    periodLabel: b.periodLabel,
  }));

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Social" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Social content</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Turn a published briefing into ready-to-post social copy across platforms. Same public-safe,
          victim-centered discipline as the briefings — accurate to the briefing, non-sensational,
          never a how-to for scammers.
        </p>
      </div>

      <DailyAutopilotAdmin />

      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">On-demand: turn a briefing into social copy</h2>
        <p className="mt-1 text-sm text-slate-500">Separate from the daily rotation — generate shareable copy from any briefing.</p>
      </div>
      <SocialGenerator briefings={options} />
    </div>
  );
}
