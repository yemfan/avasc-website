import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-14 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nonprofit anti-scam platform</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900">
          Report fraud. Search patterns. Recover with guidance.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          AVASC helps scam victims submit structured reports, explore a public indicator database, and access
          survivor stories — with private-by-default narratives and moderation safeguards.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/report"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Start a report
          </Link>
          <Link
            href="/database"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Search the database
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Structured reporting",
            body: "Multi-step intake for incident details, identifiers, evidence, and privacy choices.",
          },
          {
            title: "Pattern intelligence",
            body: "Indicators roll up into scam profiles with transparent risk scoring.",
          },
          {
            title: "Survivor community",
            body: "Stories and comments are moderated; links are blocked in comments for safety.",
          },
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
