import Link from "next/link";
import { CaseStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CaseCard } from "@/components/victim-dashboard/CaseCard";
import { getUserCases, presentCaseStatus } from "@/lib/victim-dashboard";
import { requireUser } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

const FILTER_STATUSES: CaseStatus[] = [
  CaseStatus.NEW,
  CaseStatus.PENDING_REVIEW,
  CaseStatus.NEEDS_FOLLOW_UP,
  CaseStatus.CLUSTERED,
  CaseStatus.PUBLISHED_ANONYMIZED,
  CaseStatus.CLOSED,
];

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardCasesPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? (sp.status as CaseStatus) : undefined;
  const scamType = typeof sp.scamType === "string" ? sp.scamType : undefined;
  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;

  const cases = await getUserCases(user.id, { status, scamType, from, to });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Cases</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Review your submitted scam reports and track their status.
            </p>
          </div>
          <Button asChild>
            <Link href="/report">Report a scam</Link>
          </Button>
        </div>
      </section>

      {cases.length === 0 ? (
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">You haven’t submitted any cases yet.</p>
        </section>
      ) : (
        <>
          <form
            className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-background p-6 shadow-sm"
            method="get"
          >
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status ?? ""}
                className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">All</option>
                {FILTER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {presentCaseStatus(s).label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="scamType" className="block text-xs font-medium text-muted-foreground">
                Scam type contains
              </label>
              <input
                id="scamType"
                name="scamType"
                defaultValue={scamType ?? ""}
                className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="e.g. romance"
              />
            </div>
            <div>
              <label htmlFor="from" className="block text-xs font-medium text-muted-foreground">
                From
              </label>
              <input
                id="from"
                name="from"
                type="date"
                defaultValue={from ?? ""}
                className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-xs font-medium text-muted-foreground">
                To
              </label>
              <input
                id="to"
                name="to"
                type="date"
                defaultValue={to ?? ""}
                className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" variant="secondary">
              Apply filters
            </Button>
          </form>

          <div className="grid gap-6 md:grid-cols-2">
            {cases.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
