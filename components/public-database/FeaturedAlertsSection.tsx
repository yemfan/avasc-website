import Link from "next/link";
import type { PublicFeaturedAlert } from "@/lib/public-database/public-profile-types";
import { Megaphone } from "lucide-react";

export function FeaturedAlertsSection({ alerts }: { alerts: PublicFeaturedAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-sky-700" aria-hidden />
        <h2 className="text-lg font-semibold text-slate-900">Featured alerts</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((a) => (
          <article
            key={a.id}
            className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/80 to-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">{a.scamType}</p>
            <h3 className="mt-2 text-base font-semibold text-slate-900">{a.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{a.summary}</p>
            {a.publishedAt ? (
              <p className="mt-3 text-xs text-slate-500">
                Published {new Date(a.publishedAt).toLocaleDateString()}
              </p>
            ) : null}
            <Link href="/database" className="mt-4 inline-block text-sm font-semibold text-sky-900 hover:underline">
              Search related patterns →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
