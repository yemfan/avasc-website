import { getLocale, getTranslations } from "next-intl/server";

import { getScamBreakdowns, type ScamBreakdownGroup } from "@/lib/scam-stats/queries";
import { translateMany } from "@/lib/i18n/translate-content";
import type { Locale } from "@/i18n/config";

/** Compact USD label: $6.57B / $470M. */
function usd(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${Math.round(value / 1e6)}M`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

const KNOWN_DIM = new Set(["ftc_payment_method", "ic3_crime_type"]);

/**
 * Public "where the money goes" panel — verified FTC / FBI IC3 loss breakdowns
 * rendered as ranked bar lists with a source citation. Category labels are
 * translated on demand for the active locale.
 */
export async function ScamBreakdowns() {
  const [locale, t, groups] = await Promise.all([
    getLocale() as Promise<Locale>,
    getTranslations("scamStats"),
    getScamBreakdowns(),
  ]);

  const visible = groups.filter((g) => KNOWN_DIM.has(g.dimension));
  if (visible.length === 0) return null;

  // Translate every category label once for the active locale (cached).
  const flat = visible.flatMap((g) => g.rows.map((r) => ({ id: `${g.dimension}:${r.category}`, fields: { label: r.category } })));
  const translated = await translateMany("scam_category", locale, flat);
  const labelFor = new Map(flat.map((it, i) => [it.id, translated[i]?.label ?? it.fields.label]));

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t("sectionTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("sectionIntro")}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((g) => (
          <BreakdownCard key={g.dimension} group={g} title={t(`dim_${g.dimension}`)} sourceLabel={t("sourceLabel")} labelFor={labelFor} />
        ))}
      </div>
    </section>
  );
}

function BreakdownCard({
  group,
  title,
  sourceLabel,
  labelFor,
}: {
  group: ScamBreakdownGroup;
  title: string;
  sourceLabel: string;
  labelFor: Map<string, string>;
}) {
  const max = Math.max(...group.rows.map((r) => r.valueUsd), 1);
  return (
    <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-[var(--avasc-text-muted)]">
          {group.source} · {group.year}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {group.rows.map((r) => {
          const label = labelFor.get(`${group.dimension}:${r.category}`) ?? r.category;
          return (
            <li key={r.category}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-foreground">{label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">{usd(r.valueUsd)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--avasc-bg-soft)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--avasc-gold-dark)] to-[var(--avasc-gold-light)]"
                  style={{ width: `${Math.round((r.valueUsd / max) * 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <a
        href={group.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs text-[var(--avasc-text-muted)] underline hover:text-[var(--avasc-gold-light)]"
      >
        {sourceLabel}: {group.source}
      </a>
    </div>
  );
}
