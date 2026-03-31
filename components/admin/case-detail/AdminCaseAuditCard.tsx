type AdminCaseAuditCardProps = {
  caseId: string;
};

export function AdminCaseAuditCard({ caseId }: AdminCaseAuditCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Audit</h3>
      <p className="mt-3 text-sm text-muted-foreground">Audit timeline for case {caseId} will appear here.</p>
    </section>
  );
}
