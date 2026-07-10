import { getLocale, getTranslations } from "next-intl/server";
import { Radio } from "lucide-react";

import { getCfpbSnapshot } from "@/lib/scam-stats/cfpb";
import type { Locale } from "@/i18n/config";

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-ES", zh: "zh-CN" };

/**
 * Live scam-complaint stats from the CFPB Consumer Complaint Database (cached
 * daily in AppSetting). Renders the 12-month total + most-reported states, with
 * a clear "live / updated" signal and a source link.
 */
export async function CfpbLiveStats() {
  const [locale, t, snap] = await Promise.all([
    getLocale() as Promise<Locale>,
    getTranslations("cfpb"),
    getCfpbSnapshot(),
  ]);
  if (!snap || snap.total <= 0) return null;

  const dateLocale = DATE_LOCALE[locale] ?? "en-US";
  const updated = new Date(snap.fetchedAt).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" });
  const maxState = Math.max(...snap.byState.map((s) => s.count), 1);

  return (
    <section className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          <Radio className="h-3.5 w-3.5" aria-hidden />
          {t("live")}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h2>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        <div>
          <p className="text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
            {snap.total.toLocaleString(dateLocale)}
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{t("totalLabel")}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--avasc-text-muted)]">{t("topStates")}</p>
          <ul className="mt-3 space-y-2">
            {snap.byState.slice(0, 6).map((s) => (
              <li key={s.state} className="flex items-center gap-3 text-sm">
                <span className="w-8 shrink-0 font-semibold text-foreground">{s.state}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--avasc-bg-soft)]">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-[var(--avasc-gold-dark)] to-[var(--avasc-gold-light)]"
                    style={{ width: `${Math.round((s.count / maxState) * 100)}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right tabular-nums text-muted-foreground">
                  {s.count.toLocaleString(dateLocale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--avasc-border)] pt-4 text-xs text-[var(--avasc-text-muted)]">
        <span>
          {t("updated")} {updated}
        </span>
        <a
          href={snap.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--avasc-gold-light)]"
        >
          {t("sourceCta")}
        </a>
      </div>
    </section>
  );
}
