import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await ensureAppUser(user);

  const db = getServiceSupabase();
  const { data: cases, error } = await db
    .from("Case")
    .select("id, title, scamType, status, visibility, supportRequested, createdAt")
    .eq("reporterUserId", user.id)
    .order("createdAt", { ascending: false });
  if (error) throw error;

  const list = cases ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track cases you submitted and follow recovery guidance.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-700">
          <li>Secure accounts and enable two-factor authentication where possible.</li>
          <li>Report to your bank or card network if funds were transferred.</li>
          <li>File a report with local law enforcement or cybercrime unit.</li>
          <li>Keep evidence copies in a safe place.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Your cases</h2>
          <Link
            href="/report"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            New report
          </Link>
        </div>
        {list.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No cases yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {list.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-500">
                    {c.scamType} · {c.status} · {c.visibility}
                    {c.supportRequested ? " · support requested" : ""}
                  </p>
                </div>
                <Link href={`/cases/${c.id}`} className="text-sm font-medium text-slate-900 underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
