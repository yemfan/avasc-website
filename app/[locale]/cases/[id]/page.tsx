import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";
import { getCaseDetailById } from "@/lib/db/case-detail";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

type EntityRow = {
  id: string;
  type: string;
  normalizedValue: string;
  riskScore: number;
  reportCount: number;
};

export default async function CaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await ensureAppUser(user);

  const db = getServiceSupabase();
  const { data: appUser } = await db.from("User").select("role").eq("id", user.id).maybeSingle();

  const c = await getCaseDetailById(id);

  if (!c) notFound();

  const allowed =
    c.reporterUserId === user.id || appUser?.role === "admin" || appUser?.role === "moderator";
  if (!allowed) redirect("/dashboard");

  const indicators = c.indicators as { id: string; type: string; value: string; rawValue: string | null }[];
  const evidence = c.evidence as { id: string; mimeType: string; sizeBytes: number }[];
  const entityLinks = c.entityLinks as { entityId: string; entity: EntityRow }[];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{c.title as string}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {c.scamType as string} · {c.status as string} · visibility: {c.visibility as string}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Your narrative (private)</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{c.narrativePrivate as string}</p>
      </section>

      {c.narrativePublic ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Public summary</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{c.narrativePublic as string}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Indicators</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {indicators.map((i) => (
            <li key={i.id} className="font-mono text-slate-800">
              {i.type}: {i.rawValue ?? i.value}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Linked scam patterns</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {entityLinks.map((l) => (
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
        {evidence.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No files uploaded.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {evidence.map((e) => (
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
