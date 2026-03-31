export function PublicDatabaseEmptyState() {
  return (
    <section className="rounded-2xl border border-border bg-background p-10 text-center shadow-sm">
      <p className="text-lg font-medium text-foreground">No matching profiles</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Try different keywords, clear filters, or broaden your search. Only published scam profiles with public
        indicators are shown.
      </p>
    </section>
  );
}
