type AdminCaseMatchCardProps = {
  matches: Array<{
    id: string;
    totalScore: number;
    computedAt: Date;
    targetCase: {
      id: string;
      title: string;
      scamType: string;
      status: string;
      visibility: string;
      createdAt: Date;
    };
  }>;
};

export function AdminCaseMatchCard({ matches }: AdminCaseMatchCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Case Matches</h3>
      {matches.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No source matches available.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {matches.map((m) => (
            <li key={m.id} className="rounded-lg border border-border p-2">
              {m.targetCase.title} - score {m.totalScore}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
