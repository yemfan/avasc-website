import React from "react";
import Link from "next/link";
import { AlertTriangle, Bell, ChevronRight, Radio, ShieldAlert } from "lucide-react";

import type {
  AlertPriority,
  AlertType,
  PublicAlertItem,
} from "@/lib/alerts/avasc-alert-section-api-and-loader";

export type { AlertPriority, AlertType };
export type AlertItem = PublicAlertItem;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function priorityClasses(priority: AlertPriority) {
  switch (priority) {
    case "CRITICAL":
      return {
        badge: "border-red-500/30 bg-red-500/15 text-red-300",
        dot: "bg-red-400",
        cardBorder: "hover:border-red-500/40",
      };
    case "HIGH":
      return {
        badge: "border-orange-500/30 bg-orange-500/15 text-orange-300",
        dot: "bg-orange-400",
        cardBorder: "hover:border-orange-500/40",
      };
    case "MEDIUM":
      return {
        badge: "border-amber-500/30 bg-amber-500/15 text-amber-300",
        dot: "bg-amber-400",
        cardBorder: "hover:border-amber-500/40",
      };
    default:
      return {
        badge: "border-slate-600 bg-slate-800 text-slate-300",
        dot: "bg-slate-400",
        cardBorder: "hover:border-slate-500/40",
      };
  }
}

function alertHref(item: AlertItem) {
  return item.slug ? `/database/${item.slug}` : "/database";
}

export function AvascAlertSection({
  realtimeAlerts,
  dailyAlerts,
  title = "AVASC Alerts",
  subtitle = "Live scam intelligence with realtime warnings and daily analysis.",
}: {
  realtimeAlerts: AlertItem[];
  dailyAlerts: AlertItem[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
            <Bell className="h-3.5 w-3.5" />
            Live Intelligence Layer
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--avasc-text-secondary)]">{subtitle}</p>
        </div>

        <Link
          href="/alerts/subscribe"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14]"
        >
          Subscribe to Alerts
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <RealtimeAlertTicker items={realtimeAlerts} />
      <DailyAlertFeed items={dailyAlerts} />
    </section>
  );
}

export function RealtimeAlertTicker({ items }: { items: AlertItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 text-sm text-[var(--avasc-text-secondary)]">
        No active realtime alerts right now.
      </div>
    );
  }

  const duplicated = [...items, ...items];

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--avasc-border)] bg-gradient-to-r from-[#15090a] via-[#0F172A] to-[#0B1F3A] shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <style>{`
        @keyframes avascTickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .avasc-ticker-track {
          animation: avascTickerScroll 45s linear infinite;
          width: max-content;
        }
        .avasc-ticker-wrapper:hover .avasc-ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex items-center border-b border-white/5 px-4 py-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
          <Radio className="h-3.5 w-3.5" />
          LIVE ALERTS
        </div>
        <div className="ml-3 text-xs text-[var(--avasc-text-muted)]">Critical and high-priority scam activity</div>
      </div>

      <div className="avasc-ticker-wrapper overflow-hidden py-4">
        <div className="avasc-ticker-track flex items-center gap-4 px-4">
          {duplicated.map((item, index) => {
            const styles = priorityClasses(item.priority);
            return (
              <Link
                key={`${item.id}-${index}`}
                href={alertHref(item)}
                className="inline-flex min-w-max items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:border-[var(--avasc-gold)] hover:bg-white/10"
              >
                <span className={cx("h-2.5 w-2.5 rounded-full", styles.dot)} />
                <span className="font-medium">{item.shortText}</span>
                <span className={cx("rounded-full border px-2 py-0.5 text-[10px] font-semibold", styles.badge)}>
                  {item.priority}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DailyAlertFeed({ items }: { items: AlertItem[] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-[var(--avasc-text-secondary)]">
        No daily alerts published yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <DailyAlertCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function DailyAlertCard({ item }: { item: AlertItem }) {
  const styles = priorityClasses(item.priority);

  return (
    <article
      className={cx(
        "rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)] transition",
        styles.cardBorder
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
          <ShieldAlert className="h-3.5 w-3.5" />
          Daily Alert
        </div>
        <span className={cx("rounded-full border px-3 py-1 text-xs font-semibold", styles.badge)}>{item.priority}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--avasc-text-secondary)]">{item.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {typeof item.stats?.newReports === "number" ? (
          <MetaPill>{item.stats.newReports} new reports</MetaPill>
        ) : null}
        {typeof item.stats?.amountLostUsd === "number" ? (
          <MetaPill>${item.stats.amountLostUsd.toLocaleString()} estimated loss</MetaPill>
        ) : null}
        {item.stats?.indicatorLabel ? <MetaPill>{item.stats.indicatorLabel}</MetaPill> : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs text-[var(--avasc-text-muted)]">{item.publishedAt}</div>
        <Link
          href={alertHref(item)}
          className="inline-flex items-center text-sm font-medium text-[var(--avasc-gold-light)] hover:text-white"
        >
          View details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function AlertStripCompact({ items }: { items: AlertItem[] }) {
  if (!items.length) return null;

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" />
          AVASC Realtime Alert
        </span>
        <Link href={alertHref(items[0])} className="truncate hover:underline">
          {items[0].shortText}
        </Link>
      </div>
    </div>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
      {children}
    </span>
  );
}

export function DemoAvascAlertSection() {
  const realtimeAlerts: AlertItem[] = [
    {
      id: "rt1",
      type: "REALTIME",
      priority: "CRITICAL",
      title: "New crypto scam wallet detected",
      summary:
        "A wallet linked to multiple high-loss reports was added to an existing critical cluster.",
      shortText: "Wallet 0x92B8... flagged — 3 victims — estimated loss $120K",
      publishedAt: "Apr 9, 2026 · 10:15 AM",
      slug: "fake-crypto-investment-group",
      stats: { newReports: 3, amountLostUsd: 120000, indicatorLabel: "WALLET" },
    },
    {
      id: "rt2",
      type: "REALTIME",
      priority: "HIGH",
      title: "Fake support domain detected",
      summary: "A support impersonation domain has been tied to a growing cluster.",
      shortText: "Fake exchange support domain detected — coinbase-secure-login.com",
      publishedAt: "Apr 9, 2026 · 9:40 AM",
      slug: "fake-investigator-impersonation-wave",
      stats: { indicatorLabel: "DOMAIN" },
    },
    {
      id: "rt3",
      type: "REALTIME",
      priority: "HIGH",
      title: "Telegram investment scam surge",
      summary: "New reports show a spike in Telegram-based investment fraud tactics.",
      shortText: "Telegram investment scam surge — 5 reports today — Los Angeles pattern",
      publishedAt: "Apr 9, 2026 · 8:55 AM",
      slug: "fake-crypto-investment-group",
      stats: { newReports: 5, indicatorLabel: "PLATFORM: Telegram" },
    },
  ];

  const dailyAlerts: AlertItem[] = [
    {
      id: "d1",
      type: "DAILY",
      priority: "CRITICAL",
      title: "Fake Crypto Recovery Scam Surge",
      summary:
        "Recovery scammers are targeting prior victims with promises to unlock frozen funds after an upfront payment.",
      shortText: "Recovery scam surge detected",
      publishedAt: "Daily Alert · Apr 9, 2026",
      slug: "romance-recovery-wallet-ring",
      stats: { newReports: 27, amountLostUsd: 18500, indicatorLabel: "WhatsApp → fake recovery agent" },
    },
    {
      id: "d2",
      type: "DAILY",
      priority: "HIGH",
      title: "Impersonation cluster expanding",
      summary:
        "Callers are posing as investigators, exchanges, and law firms to request verification fees before a fake release of funds.",
      shortText: "Impersonation cluster expanding",
      publishedAt: "Daily Alert · Apr 9, 2026",
      slug: "fake-investigator-impersonation-wave",
      stats: { newReports: 11, indicatorLabel: "Phone + fake investigator script" },
    },
    {
      id: "d3",
      type: "DAILY",
      priority: "MEDIUM",
      title: "Public-safe indicators added",
      summary:
        "New public-safe domains and aliases were approved and added to active published scam profiles.",
      shortText: "New indicators published",
      publishedAt: "Daily Alert · Apr 9, 2026",
      slug: "fake-crypto-investment-group",
      stats: { indicatorLabel: "Domains + aliases" },
    },
  ];

  return <AvascAlertSection realtimeAlerts={realtimeAlerts} dailyAlerts={dailyAlerts} />;
}
