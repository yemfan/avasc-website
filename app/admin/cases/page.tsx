export const dynamic = "force-dynamic";
export default function AdminCasesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">Cases</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Review submitted scam reports, indicators, and moderation status.
        </p>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Cases table will appear here.</p>
      </section>
    </div>
  );
}
