import Link from "next/link";
import { notFound } from "next/navigation";
import { SupportRequestStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseStatusBadge } from "@/components/victim-dashboard/CaseStatusBadge";
import { EvidenceList } from "@/components/victim-dashboard/EvidenceList";
import { EvidenceUploadClient } from "@/components/victim-dashboard/EvidenceUploadClient";
import { SafeInfoAlert } from "@/components/victim-dashboard/SafeInfoAlert";
import { SimilarPatternCard } from "@/components/victim-dashboard/SimilarPatternCard";
import { ScamTypeBadge } from "@/components/public-database/ScamTypeBadge";
import {
  getNextStepsForCase,
  getUserCaseDetail,
  getVictimSafePublishedClustersForCase,
  presentVisibility,
  requireAuthUser,
} from "@/lib/victim-dashboard";
import { supportStatusLabel, supportTypeLabel } from "@/lib/victim-dashboard/support-labels";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  const cur = currency || "USD";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(amount);
}

export default async function DashboardCaseDetailPage({ params }: PageProps) {
  const user = await requireAuthUser();
  const { id } = await params;
  const c = await getUserCaseDetail(user.id, id);
  if (!c) notFound();

  const prisma = getPrisma();
  const [clusters, supportRows, openSupport] = await Promise.all([
    c.allowCaseMatching ? getVictimSafePublishedClustersForCase(prisma, c.id) : Promise.resolve([]),
    prisma.supportRequest.findMany({
      where: { userId: user.id, caseId: c.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, supportType: true, status: true, note: true, createdAt: true },
    }),
    prisma.supportRequest.count({
      where: { userId: user.id, caseId: c.id, status: { not: SupportRequestStatus.CLOSED } },
    }),
  ]);

  const vis = presentVisibility(c.visibility);
  const nextSteps = getNextStepsForCase({
    status: c.status,
    scamType: c.scamType,
    supportOpen: openSupport > 0,
    recoveryStage: c.recoveryStage,
  });

  const hasS3 = Boolean(process.env.S3_BUCKET_AVASC);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <Link href="/dashboard/cases" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← My cases
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ScamTypeBadge scamType={c.scamType} />
          <CaseStatusBadge status={c.status} />
          <Badge variant="outline" title={vis.helper}>
            {vis.label}
          </Badge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{c.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Submitted {c.createdAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
        <Card className="border-slate-200 p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-700">
            {c.summary?.trim() || "No short summary on file — your full narrative is below."}
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500">Amount lost</dt>
              <dd className="text-slate-900">{formatMoney(c.amountLost, c.currency)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Payment method</dt>
              <dd className="text-slate-900">{c.paymentMethod ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Incident window</dt>
              <dd className="text-slate-900">
                {c.incidentStartDate ? c.incidentStartDate.toLocaleDateString() : "—"} →{" "}
                {c.incidentEndDate ? c.incidentEndDate.toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">First contact</dt>
              <dd className="text-slate-900">{c.initialContactChannel ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Jurisdiction</dt>
              <dd className="text-slate-900">{c.jurisdiction ?? "—"}</dd>
            </div>
          </dl>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Your narrative</h2>
        <Card className="border-slate-200 p-5 shadow-sm">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {c.fullNarrative?.trim() || c.summary}
          </p>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Indicators you provided</h2>
        <p className="text-sm text-slate-600">These are the clues you attached to your report.</p>
        <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          {c.indicators.map((i) => (
            <li key={i.id} className="text-sm">
              <span className="font-medium text-slate-800">{i.displayLabel}</span>
              <span className="ml-2 font-mono text-slate-900">{i.value}</span>
              {i.rawDisplay ? (
                <span className="ml-2 text-xs text-slate-500">(as entered: {i.rawDisplay})</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Evidence</h2>
        <EvidenceList files={c.evidence} />
        {hasS3 ? <EvidenceUploadClient caseId={c.id} /> : null}
        {!hasS3 ? (
          <SafeInfoAlert>
            File uploads aren’t configured in this environment. You can describe additional evidence in a{" "}
            <Link href="/dashboard/support" className="font-medium underline">
              support request
            </Link>
            .
          </SafeInfoAlert>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Next steps for you</h2>
        <Card className="border-slate-200 p-5 shadow-sm">
          <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-700">
            {nextSteps.map((s) => (
              <li key={s.title}>
                <span className="font-medium text-slate-900">{s.title}</span>
                <p className="mt-1 text-slate-600">{s.detail}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Support requests for this case</h2>
        {supportRows.length === 0 ? (
          <p className="text-sm text-slate-600">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {supportRows.map((s) => {
              const st = supportStatusLabel(s.status);
              return (
                <li key={s.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
                  <span className="font-medium">{supportTypeLabel(s.supportType)}</span>
                  <span className="text-slate-600"> — {st.label}</span>
                  {st.helper ? <p className="mt-1 text-xs text-slate-500">{st.helper}</p> : null}
                  {s.note ? (
                    <p className="mt-2 text-slate-700">
                      <span className="font-medium text-slate-800">Your message: </span>
                      {s.note}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
        <Button asChild variant="secondary">
          <Link href="/dashboard/support">Request support</Link>
        </Button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Similar published scam patterns</h2>
        {!c.allowCaseMatching ? (
          <SafeInfoAlert>You opted out of pattern matching for this report, so we don’t show related profiles here.</SafeInfoAlert>
        ) : clusters.length === 0 ? (
          <p className="text-sm text-slate-600">
            We didn’t find published scam profiles that strongly overlap yet. That doesn’t mean you’re alone — staff may
            still connect reports internally.
          </p>
        ) : (
          <div className="grid gap-4">
            {clusters.map((m) => (
              <SimilarPatternCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href={`/cases/${c.id}`}>Open printable view</Link>
        </Button>
      </div>
    </div>
  );
}
