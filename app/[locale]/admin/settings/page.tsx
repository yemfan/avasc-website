import { Link } from "@/i18n/navigation";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Settings" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Operational settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Feed configuration (OneDrive folders, cron schedules) lives in environment variables and{" "}
          <code className="rounded bg-slate-100 px-1">vercel.json</code> crons today.
        </p>
      </div>
      <Card>
        <CardContent className="space-y-3 py-8 text-sm text-slate-600">
          <p>
            See <span className="font-mono text-xs">.env.example</span> for ingestion and delivery keys.
          </p>
          <p>
            <Link href="/admin/imports" className="font-medium text-slate-900 underline">
              Imports
            </Link>{" "}
            — monitor file flow and failures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
