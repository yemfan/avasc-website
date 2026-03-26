import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ScamEntityPage({ params }: PageProps) {
  const { id } = await params;

  const entity = await prisma.scamEntity.findUnique({
    where: { id },
    include: {
      caseLinks: {
        include: {
          case: {
            select: {
              id: true,
              title: true,
              scamType: true,
              visibility: true,
              narrativePublic: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!entity) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/database" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Database search
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Scam profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          Aggregated indicator — not an accusation against any one person. Pattern data only.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entity.type}</p>
        <p className="mt-2 font-mono text-lg text-slate-900">{entity.normalizedValue}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">Risk score</dt>
            <dd className="text-2xl font-semibold text-slate-900">{entity.riskScore}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Linked reports</dt>
            <dd className="text-2xl font-semibold text-slate-900">{entity.reportCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Last seen</dt>
            <dd className="text-sm text-slate-800">
              {new Date(entity.lastSeenAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Related cases</h2>
        <ul className="mt-4 space-y-4">
          {entity.caseLinks.map((link) => {
            const c = link.case;
            const showSummary =
              c.visibility === "public" || c.visibility === "anonymized" ? c.narrativePublic : null;
            return (
              <li key={link.caseId} className="border-b border-slate-100 pb-4 last:border-b-0">
                <p className="font-medium text-slate-900">{c.title}</p>
                <p className="text-xs text-slate-500">
                  {c.scamType} · {new Date(c.createdAt).toLocaleDateString()}
                </p>
                {showSummary ? (
                  <p className="mt-2 text-sm text-slate-700">{showSummary}</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Details restricted — this case is not published with a public summary.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
