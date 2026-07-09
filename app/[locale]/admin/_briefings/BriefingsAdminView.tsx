import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/admin/format";
import { listBriefings } from "@/lib/briefings/queries";
import { generateBriefingFormAction } from "@/lib/briefings/admin-actions";
import type { BriefingKind } from "@/lib/briefings/generate";

import { GenerateBriefingButton } from "./GenerateBriefingButton";

type KindCopy = {
  crumb: string;
  heading: string;
  intro: string;
  generateLabel: string;
};

const COPY: Record<BriefingKind, KindCopy> = {
  weekly: {
    crumb: "Weekly news",
    heading: "Weekly briefings",
    intro:
      'AVASC’s "This Week in Scams" — a broad weekly roundup grounded in our public-safe data plus authoritative external reporting (FTC, FBI IC3, CISA, FinCEN, state AGs).',
    generateLabel: "Generate this week’s briefing",
  },
  daily: {
    crumb: "Daily news",
    heading: "Daily briefings",
    intro:
      'AVASC’s "Today in Scams" — a tighter, more urgent same-day brief on what is active or breaking today, grounded in our public-safe data plus authoritative external reporting.',
    generateLabel: "Generate today’s briefing",
  },
};

/**
 * Shared management view for the weekly / daily briefing admin pages.
 * Server component: gate the *page* with requireRole, then render this.
 */
export async function BriefingsAdminView({ kind }: { kind: BriefingKind }) {
  const copy = COPY[kind];
  const briefings = await listBriefings(kind);

  // Bind the cadence to the form action (Next 15 server-action binding).
  const action = generateBriefingFormAction.bind(null, kind);

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs
          items={[{ label: "Overview", href: "/admin" }, { label: copy.crumb }]}
        />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{copy.heading}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">{copy.intro}</p>
        <p className="mt-1 max-w-2xl text-xs text-slate-500">
          Generating publishes to the public{" "}
          <Link href="/briefings" className="underline">
            /briefings
          </Link>{" "}
          library and (in future) feeds the subscriber digest.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-slate-900">Generate a new briefing</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Runs Claude with live web search. This can take up to a few minutes.
            </p>
          </div>
          <form action={action}>
            <GenerateBriefingButton label={copy.generateLabel} />
          </form>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Recent {kind} briefings</CardTitle>
        </CardHeader>
        <CardContent>
          {briefings.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No briefings yet — generate one to publish the first {kind} briefing.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {briefings.map((b) => (
                <li key={b.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-900">{b.title}</span>
                      <Badge variant={b.status === "published" ? "default" : "secondary"}>
                        {b.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {b.periodLabel ? `${b.periodLabel} · ` : ""}Published {formatDate(b.publishedAt)}
                    </p>
                  </div>
                  <Link
                    href={`/briefings/${b.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700 underline hover:text-slate-900"
                  >
                    View
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
