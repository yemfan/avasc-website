import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Database, HeartHandshake, Shield } from "lucide-react";

import { AvascAlertSection, type AlertItem } from "@/components/marketing/AvascAlertSection";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-[var(--avasc-text-primary)] shadow-sm backdrop-blur-sm transition hover:border-[var(--avasc-gold)]/35 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_-12px_rgba(197,139,43,0.45)] transition hover:brightness-[1.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

export function HomepageHero({
  realtimeAlerts,
  dailyAlerts,
}: {
  realtimeAlerts: AlertItem[];
  dailyAlerts: AlertItem[];
}) {
  const t = useTranslations("hero");
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(135deg,var(--avasc-bg-soft)_0%,#0a1628_45%,var(--avasc-blue)_100%)] px-6 py-12 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 10% 0%, rgba(197, 139, 43, 0.12), transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 20%, rgba(30, 144, 255, 0.08), transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(15, 23, 42, 0.9), transparent)
          `,
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[var(--avasc-gold)]/5 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--avasc-gold)]/25 bg-[var(--avasc-gold)]/[0.07] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--avasc-gold-light)]">
              <Shield className="h-3.5 w-3.5 opacity-90" aria-hidden />
              {t("badge")}
            </p>
            <h1 className="font-display mt-6 text-[2rem] font-medium leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem]">
              {t.rich("headline", {
                highlight: (chunks) => (
                  <span className="bg-gradient-to-r from-[var(--avasc-gold-light)] to-[var(--avasc-gold)] bg-clip-text text-transparent">
                    {chunks}
                  </span>
                ),
              })}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--avasc-text-secondary)] sm:text-lg sm:leading-8">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/report" className={primaryBtn}>
                {t("reportScam")}
                <ArrowRight className="h-4 w-4 opacity-90" aria-hidden />
              </Link>
              <Link href="/database" className={secondaryBtn}>
                <Database className="h-4 w-4 text-[var(--avasc-gold-light)]" aria-hidden />
                {t("searchDatabase")}
              </Link>
              <Link href="/about" className={secondaryBtn}>
                <HeartHandshake className="h-4 w-4 text-[var(--avasc-cyan)]" aria-hidden />
                {t("aboutAvasc")}
              </Link>
            </div>
            <p className="mt-4 text-sm text-[var(--avasc-text-muted)]">
              {t.rich("alertsNote", {
                link: (chunks) => (
                  <Link
                    href="#alerts-news"
                    className="font-medium text-[var(--avasc-gold-light)] underline-offset-2 hover:text-white hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="min-w-0">
            <div
              className="rounded-2xl border border-white/[0.1] bg-[#050a14]/75 p-5 shadow-[0_16px_48px_-20px_rgba(0,0,0,0.65)] ring-1 ring-[var(--avasc-gold)]/[0.12] backdrop-blur-md sm:p-6 lg:p-7"
              role="region"
              aria-label={t("alertsRegionLabel")}
            >
              <AvascAlertSection
                realtimeAlerts={realtimeAlerts}
                dailyAlerts={dailyAlerts}
                hideSubscribeCta
                compact
                title={t("alertsPanelTitle")}
                subtitle={t("alertsPanelSubtitle")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
