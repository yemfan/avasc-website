import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function CaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await ensureAppUser(user);

  const appUser = await prisma.user.findUnique({ where: { id: user.id } });

  const c = await prisma.case.findUnique({
    where: { id },
    include: {
      indicators: true,
      evidence: true,
      entityLinks: { include: { entity: true } },
    },
  });

  if (!c) notFound();

  const allowed =
    c.reporterUserId === user.id || appUser?.role === "admin" || appUser?.role === "moderator";
  if (!allowed) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{c.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {c.scamType} · {c.status} · visibility: {c.visibility}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Your narrative (private)</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{c.narrativePrivate}</p>
      </section>

      {c.narrativePublic ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Public summary</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{c.narrativePublic}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Indicators</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {c.indicators.map((i) => (
            <li key={i.id} className="font-mono text-slate-800">
              {i.type}: {i.rawValue ?? i.value}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Linked scam patterns</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {c.entityLinks.map((l) => (
            <li key={l.entityId}>
              <Link className="font-medium text-slate-900 underline" href={`/database/entity/${l.entityId}`}>
                {l.entity.type} · {l.entity.normalizedValue}
              </Link>{" "}
              — risk {l.entity.riskScore} / 100, reports {l.entity.reportCount}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Evidence files</h2>
        {c.evidence.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No files uploaded.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {c.evidence.map((e) => (
              <li key={e.id}>
                {e.mimeType} — {(e.sizeBytes / 1024).toFixed(1)} KB
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
