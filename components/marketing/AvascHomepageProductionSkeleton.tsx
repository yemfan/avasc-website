import Link from "next/link";
import React from "react";
import {
  ShieldCheck,
  Search,
  Bell,
  FileWarning,
  Database,
  Users,
  ArrowRight,
  CheckCircle2,
  Globe,
  LineChart,
  MessageSquareHeart,
} from "lucide-react";
import type { PublicAlertItem } from "@/lib/alerts/avasc-alert-section-api-and-loader";
import { HomepageAlertSignup } from "@/components/marketing/HomepageAlertSignup";
import { AvascAlertSection } from "@/components/marketing/AvascAlertSection";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MarketingPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050A14] text-[#E5E7EB]">
      <style>{`
:root {
--avasc-gold: #C58B2B;
--avasc-gold-light: #F5C96A;
--avasc-gold-dark: #8B5E1A;
--avasc-blue: #0B1F3A;
--avasc-blue-light: #1E3A5F;
--avasc-bg: #050A14;
--avasc-bg-soft: #0F172A;
--avasc-bg-card: #111827;
--avasc-border: #1E293B;
--avasc-divider: #263041;
--avasc-text-primary: #E5E7EB;
--avasc-text-secondary: #9CA3AF;
--avasc-text-muted: #6B7280;
--risk-low: #22C55E;
--risk-medium: #F59E0B;
--risk-high: #EF4444;
--risk-critical: #B91C1C;
}
`}</style>
      {children}
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--avasc-divider)] bg-[rgba(5,10,20,0.85)] backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A]">
                <ShieldCheck className="h-5 w-5 text-[var(--avasc-gold)]" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide text-[var(--avasc-gold-light)]">AVASC</div>
                <div className="hidden text-xs text-[#9CA3AF] sm:block">
                  Association of Victims Against Cyber-Scams
                </div>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#database" className="text-sm text-[#9CA3AF] hover:text-white">
              Database
            </a>
            <a href="#alerts" className="text-sm text-[#9CA3AF] hover:text-white">
              Alerts
            </a>
            <a href="#how-it-works" className="text-sm text-[#9CA3AF] hover:text-white">
              How It Works
            </a>
            <a href="#partners" className="text-sm text-[#9CA3AF] hover:text-white">
              Partners
            </a>
            <a href="#support" className="text-sm text-[#9CA3AF] hover:text-white">
              Support
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/donate"
              className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
            >
              Donate
            </Link>
            <Link
              href="/report"
              className="rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)]"
            >
              Report Case
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] via-[#0B1F3A] to-[#050A14] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)] sm:p-12 lg:p-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,139,43,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(30,144,255,0.12),transparent_25%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
            <Bell className="h-3.5 w-3.5" />
            Realtime Scam Intelligence + Victim Support
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The public warning system for cyber-scam victims.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#9CA3AF]">
            Search scam patterns, report matching cases, follow active scam profiles, and receive realtime alerts when
            dangerous scams escalate.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/database"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14] shadow-[0_0_20px_rgba(197,139,43,0.18)]"
            >
              Search Scam Database
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/report"
              className="rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
            >
              Report a Matching Case
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#9CA3AF]">
            <div className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--avasc-gold)]" /> Privacy-first
            </div>
            <div className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--avasc-gold)]" /> Public-safe intelligence
            </div>
            <div className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--avasc-gold)]" /> Victim support focused
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(5,10,20,0.55)] p-5">
            <div className="text-sm text-[#9CA3AF]">Published Scam Profiles</div>
            <div className="mt-2 text-4xl font-bold text-white">1,284</div>
            <div className="mt-2 text-sm text-[#6B7280]">Publicly searchable scam intelligence clusters</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Verified Indicators" value="9,421" />
            <MetricCard label="Realtime Alerts Sent" value="18,306" />
            <MetricCard label="Followed Scam Profiles" value="6,572" />
            <MetricCard label="New Reports This Week" value="312" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.03)] p-4">
      <div className="text-xs uppercase tracking-wide text-[#6B7280]">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    {
      icon: Database,
      title: "Public Scam Database",
      text: "Search published scam profiles and public-safe indicators.",
    },
    {
      icon: Bell,
      title: "Realtime Scam Alerts",
      text: "Critical SMS alerts and daily or weekly email intelligence.",
    },
    {
      icon: FileWarning,
      title: "Victim Report Flow",
      text: "Submit matching reports to strengthen pattern detection.",
    },
    {
      icon: Users,
      title: "Support + Recovery Guidance",
      text: "Direct victims toward support resources and next steps.",
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
            <item.icon className="h-5 w-5 text-[var(--avasc-gold-light)]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

function AlertSignupModule() {
  return (
    <section
      id="alerts"
      className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#0B1F3A] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
            AVASC Alert Network
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Stay protected in real time.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#9CA3AF]">
            Subscribe to critical scam alerts by text message and receive daily or weekly scam intelligence by email.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[#9CA3AF]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Critical SMS alerts only — no noise.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Daily and weekly digests with verified
              indicators and trends.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Unsubscribe or update preferences
              anytime.
            </li>
          </ul>
        </div>

        <HomepageAlertSignup embedded />
      </div>
    </section>
  );
}

function SearchPreview() {
  return (
    <section id="database" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
          <Search className="h-3.5 w-3.5" />
          Public Scam Database
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Search reported scam patterns in seconds.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#9CA3AF]">
          Search published scam profiles using domains, wallet addresses, emails, aliases, platforms, scam types, and
          public indicators.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/database"
            className="rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
          >
            Explore Database
          </Link>
          <Link
            href="/database"
            className="rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-[#9CA3AF] hover:text-white"
          >
            View Example Profile
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
        <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                defaultValue="primegrowth-asset.com"
                readOnly
                className="w-full rounded-lg border border-[var(--avasc-border)] bg-[#050A14] py-3 pl-11 pr-4 text-sm text-white outline-none"
              />
            </div>
            <Link
              href="/database"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14]"
            >
              Search
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FilterPill>Scam Type</FilterPill>
            <FilterPill>Risk Level</FilterPill>
            <FilterPill>Indicator Type</FilterPill>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--avasc-border)] p-5 transition hover:border-[var(--avasc-gold)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Fake Crypto Investment Group – Shared Wallet / Domain Pattern
              </h3>
              <p className="mt-1 text-sm text-[#9CA3AF]">Fake Crypto Investment</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <RiskBadge level="CRITICAL" />
              <MetaBadge>24 reports</MetaBadge>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#9CA3AF]">
            Multiple reports describe fake profit dashboards followed by withdrawal blocks, tax demands, and
            wallet-verification fees.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <IndicatorChip>DOMAIN: primegrowth-asset.com ✓</IndicatorChip>
            <IndicatorChip>WALLET: 0xabc1...8777 ✓</IndicatorChip>
            <IndicatorChip>PLATFORM: WhatsApp</IndicatorChip>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/database"
              className="rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-white"
            >
              View Scam Profile
            </Link>
            <Link
              href="/report"
              className="rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[#050A14]"
            >
              Report Matching Case
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[#9CA3AF]">
      {children}
    </div>
  );
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
      {children}
    </span>
  );
}

function RiskBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" }) {
  const styles = {
    LOW: "border-green-500/30 bg-green-500/15 text-green-400",
    MEDIUM: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    HIGH: "border-red-500/30 bg-red-500/15 text-red-400",
    CRITICAL: "border-red-700/40 bg-red-700/20 text-red-300",
  } as const;
  return (
    <span className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", styles[level])}>{level}</span>
  );
}

function IndicatorChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
      {children}
    </span>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search",
      text: "Look up a domain, wallet, phone, alias, or scam type in the AVASC database.",
    },
    {
      icon: FileWarning,
      title: "Report",
      text: "Submit a matching case and attach evidence so AVASC can compare patterns.",
    },
    {
      icon: LineChart,
      title: "Match",
      text: "AVASC links indicators, clusters related scams, and strengthens public intelligence.",
    },
    {
      icon: Bell,
      title: "Stay Alert",
      text: "Follow scam profiles and receive critical SMS alerts or personalized digests.",
    },
  ];

  return (
    <section id="how-it-works">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
          How It Works
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Search. Report. Match. Stay protected.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#9CA3AF]">
          AVASC turns scattered victim reports into structured scam intelligence that people can search and follow
          safely.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
              <step.icon className="h-5 w-5 text-[var(--avasc-gold-light)]" />
            </div>
            <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Step {index + 1}</div>
            <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CredibilitySection() {
  const cards = [
    {
      icon: Globe,
      title: "Public Safety First",
      text: "Public profiles use only moderated, public-safe indicators and published scam clusters.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy-Conscious",
      text: "Victim information stays protected. AVASC surfaces patterns, not private victim identities.",
    },
    {
      icon: MessageSquareHeart,
      title: "Built for Victims",
      text: "AVASC is designed to support victims, strengthen prevention, and improve scam awareness at scale.",
    },
  ];

  return (
    <section id="partners" className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.20)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(197,139,43,0.25)] bg-[rgba(197,139,43,0.08)]">
            <card.icon className="h-5 w-5 text-[var(--avasc-gold-light)]" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#9CA3AF]">{card.text}</p>
        </div>
      ))}
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="support" className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[#0F172A] to-[#111827] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            If this looks familiar, take the next safe step.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#9CA3AF]">
            Search for warning signs, report what happened, follow updates on active scam profiles, and help AVASC
            strengthen scam prevention for others.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/report"
              className="rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[#050A14]"
            >
              Report a Case
            </Link>
            <Link
              href="/recovery"
              className="rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-white hover:border-[var(--avasc-gold)]"
            >
              Get Support
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--avasc-border)] bg-[rgba(255,255,255,0.03)] p-6">
          <div className="text-sm font-semibold uppercase tracking-wide text-[var(--avasc-gold-light)]">
            What AVASC helps you do
          </div>
          <ul className="mt-4 space-y-3 text-sm text-[#9CA3AF]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Search public scam indicators safely
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Report matching scam experiences
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Follow scam profiles for future alerts
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--avasc-gold)]" /> Stay current with daily and weekly
              intelligence
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--avasc-divider)] py-10">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-lg font-bold tracking-wide text-[var(--avasc-gold-light)]">AVASC</div>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#9CA3AF]">
              Association of Victims Against Cyber-Scams. Public warning, pattern intelligence, and victim support.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <FooterCol
              title="Platform"
              links={[
                { label: "Database", href: "/database" },
                { label: "Realtime Alerts", href: "/alerts" },
                { label: "Report a Case", href: "/report" },
              ]}
            />
            <FooterCol
              title="Support"
              links={[
                { label: "Victim Support", href: "/recovery" },
                { label: "Followed Scams", href: "/dashboard/alerts/following" },
                { label: "Alert Preferences", href: "/alerts/preferences" },
              ]}
            />
            <FooterCol
              title="Organization"
              links={[
                { label: "About", href: "/about" },
                { label: "Partners", href: "/about#partners" },
                { label: "Donate", href: "/donate" },
              ]}
            />
          </div>
        </div>
        <div className="mt-8 text-xs text-[#6B7280]">
          © 2026 AVASC.org — Public profiles are based on moderated, public-safe scam intelligence and do not expose
          private victim information.
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-3 space-y-2">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="block text-sm text-[#9CA3AF] hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

type AvascHomepageProductionSkeletonProps = {
  realtimeAlerts: PublicAlertItem[];
  dailyAlerts: PublicAlertItem[];
};

export default function AvascHomepageProductionSkeleton({
  realtimeAlerts,
  dailyAlerts,
}: AvascHomepageProductionSkeletonProps) {
  return (
    <MarketingPageShell>
      <Navbar />
      <Container>
        <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-12">
          <Hero />
          <AvascAlertSection realtimeAlerts={realtimeAlerts} dailyAlerts={dailyAlerts} />
          <TrustStrip />
          <AlertSignupModule />
          <SearchPreview />
          <HowItWorks />
          <CredibilitySection />
          <FinalCTA />
        </div>
      </Container>
      <Footer />
    </MarketingPageShell>
  );
}
