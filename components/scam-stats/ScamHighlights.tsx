import { ArrowUpRight } from "lucide-react";

/**
 * Headline "scam by the numbers" cards — cited annual figures that complement the
 * IC3 trend chart (global scale, elder impact, crypto, recovery rate). Curated +
 * clearly year/source-labeled; not live (the trend chart carries the live series).
 */

type Highlight = {
  value: string;
  label: string;
  meta: string;
  url: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    value: "$1.03T",
    label: "Lost to scams worldwide in a single year",
    meta: "Global · GASA / Feedzai, 2024",
    url: "https://gasa.org/knowledge-base/blog/global-state-of-scams-report-2024-1-trillion-stolen-in-12-months-gasa-feedzai",
  },
  {
    value: "$4.9B",
    label: "Lost by Americans age 60+ to fraud in a year",
    meta: "U.S. · FBI IC3, 2024",
    url: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf",
  },
  {
    value: "$9.3B",
    label: "U.S. crypto-related fraud losses — up 66% year over year",
    meta: "U.S. · FBI IC3, 2024",
    url: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf",
  },
  {
    value: "4%",
    label: "Share of scam victims who ever recover their money",
    meta: "Global · GASA / Feedzai, 2024",
    url: "https://gasa.org/knowledge-base/blog/global-state-of-scams-report-2024-1-trillion-stolen-in-12-months-gasa-feedzai",
  },
];

export function ScamHighlights() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">Scam by the numbers</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <a
            key={h.label}
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-5 transition-colors hover:border-[var(--avasc-gold)]/50"
          >
            <span className="text-3xl font-bold tracking-tight text-[var(--avasc-gold-light)]">{h.value}</span>
            <span className="mt-2 text-sm leading-snug text-muted-foreground">{h.label}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--avasc-text-muted)] group-hover:text-[var(--avasc-gold-light)]">
              {h.meta}
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
