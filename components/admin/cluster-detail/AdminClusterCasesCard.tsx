import { ScamClusterCase, Case, User } from "@prisma/client";

type CaseLinkWithCase = ScamClusterCase & {
  case: Pick<
    Case,
    "id" | "title" | "scamType" | "status" | "visibility" | "createdAt"
  > & {
    user: Pick<User, "id" | "displayName" | "email">;
  };
};

type AdminClusterCasesCardProps = {
  caseLinks: CaseLinkWithCase[];
};

export function AdminClusterCasesCard({
  caseLinks,
}: AdminClusterCasesCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Linked Cases</h3>

      <div className="mt-4 space-y-3">
        {caseLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No linked cases yet.</p>
        ) : (
          caseLinks.map((link) => (
            <div key={link.id} className="rounded-xl border p-4">
              <p className="text-sm font-medium">{link.case.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {link.case.scamType} � {link.case.status} � {link.case.visibility}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Submitted by {link.case.user.displayName || link.case.user.email}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
