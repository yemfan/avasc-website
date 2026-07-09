import Link from "next/link";
import { EmptyState } from "@/components/avasc/EmptyState";
import { PageHeader } from "@/components/avasc/PageHeader";
import { StatCard } from "@/components/avasc/StatCard";
import { requireUser } from "@/lib/auth/require-user";
import { loadDashboardOverview, presentCaseStatus } from "@/lib/victim-dashboard";
import { storyStatusPresentation } from "@/lib/victim-dashboard/story-labels";
import { supportStatusLabel, supportTypeLabel } from "@/lib/victim-dashboard/support-labels";
import { getPrisma } from "@/lib/prisma";
import type { ModerationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const [overview, publishedStoriesCount] = await Promise.all([
    loadDashboardOverview(user.id),
    getPrisma().story.count({
      where: { userId: user.id, moderationStatus: "APPROVED" },
    }),
  ]);

  const noRecentActivity =
    overview.recentCases.length === 0 &&
    overview.recentSupport.length === 0 &&
    overview.recentStories.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Your Dashboard"
        description="Track your reports, support requests, and next steps in one place."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Cases Submitted" value={overview.totalCases} />
        <StatCard label="Open Support Requests" value={overview.openSupportRequests} />
        <StatCard label="Stories Shared" value={publishedStoriesCount} />
      </div>

      {noRecentActivity ? (
        <EmptyState
          title="No recent updates"
          description="When your cases, support requests, or shared stories change, you'll see the latest activity here."
          actionLabel="Report a New Case"
          actionHref="/report"
        />
      ) : (
        <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-[var(--avasc-text-secondary)]">Cases</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {overview.recentCases.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/cases/${c.id}`}
                      className="font-medium text-[var(--avasc-gold-light)] hover:text-[var(--avasc-gold)]"
                    >
                      {c.title}
                    </Link>
                    <p className="text-xs text-[var(--avasc-text-muted)]">
                      {c.scamType} · {presentCaseStatus(c.status).label} · {c.createdAt.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[var(--avasc-text-secondary)]">Support</h3>
                <ul className="mt-2 space-y-2 text-sm text-[var(--avasc-text-primary)]">
                  {overview.recentSupport.map((s) => (
                    <li key={s.id}>
                      {supportTypeLabel(s.supportType)} — {supportStatusLabel(s.status).label}
                      {s.caseTitle ? ` · ${s.caseTitle}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--avasc-text-secondary)]">Stories</h3>
                <ul className="mt-2 space-y-2 text-sm text-[var(--avasc-text-primary)]">
                  {overview.recentStories.map((s) => {
                    const pres = storyStatusPresentation(s.status as ModerationStatus, s.publishedAt);
                    return (
                      <li key={s.id}>
                        {s.title} — {pres.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
