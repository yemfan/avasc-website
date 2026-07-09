import { Link } from "@/i18n/navigation";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsOverview } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ window?: string | string[] }>;
};

function firstString(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function BarList({ items }: { items: Array<{ label: string; value: number }> }) {
  if (items.length === 0) return <p className="text-sm text-slate-500">No data.</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2">
      {items.map((row) => (
        <li key={row.label} className="text-sm">
          <div className="flex justify-between gap-2">
            <span className="truncate text-slate-700">{row.label}</span>
            <span className="shrink-0 font-medium tabular-nums">{row.value}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded bg-slate-100">
            <div
              className="h-full rounded bg-slate-800"
              style={{ width: `${Math.round((row.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const w = firstString(sp.window);
  const window = w === "30d" ? "30d" : "7d";
  const data = await getAnalyticsOverview({ window });

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Analytics" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">
          Window:{" "}
          <Link
            href="/admin/analytics?window=7d"
            className={window === "7d" ? "font-semibold text-slate-900" : "underline"}
          >
            7 days
          </Link>{" "}
          ·{" "}
          <Link
            href="/admin/analytics?window=30d"
            className={window === "30d" ? "font-semibold text-slate-900" : "underline"}
          >
            30 days
          </Link>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alerts by type</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={data.alertsByType} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Imports by status</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={data.importsByStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cases by scam type</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={data.casesByScamType} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top indicator types</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={data.topIndicatorTypes} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clusters by risk</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={data.clustersByRisk} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reported losses over time</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={data.lossesOverTime.map((x) => ({ label: x.label, value: Math.round(x.value) }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
