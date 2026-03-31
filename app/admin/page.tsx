export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin Overview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor incoming cases, support requests, moderation queues, and scam intelligence.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending Cases</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Open Support Requests</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Stories Pending Review</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Published Clusters</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="mt-3 text-sm text-muted-foreground">No recent moderation activity yet.</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>• Review pending cases</p>
            <p>• Moderate stories and comments</p>
            <p>• Publish alerts</p>
            <p>• Update scam clusters</p>
          </div>
        </div>
      </section>
    </div>
  );
}
