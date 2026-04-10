/** Mission / database / alerts / trust copy for homepage lower panel (was hero sidebar). */
export function HomepageMissionHighlights() {
  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-[#050a14]/60 p-6 backdrop-blur-md sm:p-8">
      <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { k: "Mission", v: "Victim-centered intelligence and recovery guidance—not a law firm or agency." },
          { k: "Database", v: "Anonymized indicators and published scam profiles you can search safely." },
          { k: "Alerts", v: "Realtime SMS for critical threats plus optional daily or weekly email digests." },
          { k: "Trust", v: "We never ask for passwords, full card numbers, or government IDs in public forms." },
        ].map(({ k, v }) => (
          <div key={k}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--avasc-gold-light)]/90">{k}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
