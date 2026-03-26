import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      scamType: true,
      status: true,
      visibility: true,
      reporterUserId: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review submissions. Promote users to admin/moderator via SQL or a future admin tool.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent cases</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {cases.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-medium text-slate-900">{c.title}</p>
                <p className="text-xs text-slate-500">
                  {c.scamType} · {c.status} · {c.visibility}
                  {c.reporterUserId ? "" : " · anonymous submission"}
                </p>
              </div>
              <Link href={`/cases/${c.id}`} className="text-sm font-medium text-slate-900 underline">
                Open
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
