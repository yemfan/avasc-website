import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export function DatabaseHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent" />
      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
          <Database className="h-3.5 w-3.5" aria-hidden />
          Public intelligence
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Search reported scam patterns</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300">
          Compare your situation to known tactics — using anonymized, staff-reviewed patterns. This is not a guarantee
          of who is behind a scam; it is guidance to help you spot red flags and decide your next steps.
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Results are informational only. Victim identities and private evidence are never shown here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
            <Link href="/report">Report a scam</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
            <Link href="/recovery">Recovery help</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
