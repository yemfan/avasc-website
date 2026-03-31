import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Database,
  Heart,
  LifeBuoy,
  Shield,
} from "lucide-react";
import { AvascButton } from "@/components/avasc/ui/AvascButton";
import { AvascCard, AvascCardContent } from "@/components/avasc/ui/AvascCard";
import { CTASection } from "@/components/avasc/CTASection";
import { SectionShell } from "@/components/avasc/layout/SectionShell";
import { brand, brandImages } from "@/lib/brand-images";
import { getServiceSupabase } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

async function loadPreviewData() {
  let stories: { id: string; title: string; body: string; createdAt: string }[] = [];
  let alerts: { id: string; title: string; summary: string; severity: string }[] = [];
  try {
    const db = getServiceSupabase();
    const [sRes, aRes] = await Promise.all([
      db
        .from("Story")
        .select("id, title, body, createdAt")
        .eq("status", "approved")
        .order("createdAt", { ascending: false })
        .limit(3),
      db
        .from("ScamAlert")
        .select("id, title, summary, severity")
        .eq("published", true)
        .order("publishedAt", { ascending: false })
        .limit(4),
    ]);
    if (!sRes.error && sRes.data) stories = sRes.data;
    if (!aRes.error && aRes.data) alerts = aRes.data;
  } catch {
    /* missing service env during local static analysis */
  }
  return { stories, alerts };
}

function excerpt(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export default async function Home() {
  const { stories, alerts } = await loadPreviewData();

  return (
    <div className="space-y-20 pb-16">
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-avasc-blue/90 via-avasc-bg-soft to-avasc-bg px-6 py-14 shadow-[0_0_80px_-30px_rgba(30,144,255,0.2)] md:px-12 md:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-avasc-blue-glow/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-avasc-gold/10 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-avasc-gold-light">
              Nonprofit anti-scam coalition
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.1]">
              You are not alone. Report, search patterns, and find grounded recovery support.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              AVASC helps scam victims submit structured reports, explore anonymized scam intelligence, and access
              survivor stories — private by default, moderated in public, built for dignity and trust.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src={brandImages.logoFull}
              alt={brand.logoAltFull}
              width={320}
              height={200}
              className="h-auto w-full max-w-[min(100%,18rem)] object-contain opacity-95 drop-shadow-[0_0_24px_rgba(197,139,43,0.15)] lg:max-w-[20rem]"
              priority
            />
          </div>
        </div>
        <div className="relative mt-10 flex flex-wrap gap-3">
          <AvascButton asChild variant="gold" size="lg" className="rounded-xl px-7">
            <Link href="/report" className="inline-flex items-center gap-2">
              Report a scam
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </AvascButton>
          <AvascButton asChild variant="secondary" size="lg" className="rounded-xl px-7">
            <Link href="/database" className="inline-flex items-center gap-2">
              <Database className="h-4 w-4" aria-hidden />
              Search scam database
            </Link>
          </AvascButton>
          <Link
            href="/recovery"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-avasc-gold-light"
          >
            <LifeBuoy className="h-4 w-4" aria-hidden />
            Get recovery help
          </Link>
        </div>
      </section>

      <SectionShell
        title="Just got scammed?"
        description="Pause before paying anyone new. Secure accounts, gather evidence, and avoid recovery agents who demand upfront fees."
        contentClassName="max-w-6xl"
      >
        <div className="flex flex-col gap-6 rounded-2xl border border-risk-medium/35 bg-risk-medium/10 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-risk-medium/40 bg-risk-medium/15 text-risk-medium">
              <AlertTriangle className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="max-w-xl text-sm leading-relaxed text-foreground/95">
                AVASC can help you organize what happened — we are not a law firm and cannot guarantee funds recovery.
              </p>
            </div>
          </div>
          <AvascButton asChild variant="gold" className="shrink-0">
            <Link href="/report">Start a structured report</Link>
          </AvascButton>
        </div>
      </SectionShell>

      <SectionShell contentClassName="max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Structured reporting",
              body: "A guided, multi-step intake for incident details, identifiers, evidence, privacy choices, and support needs — with autosaved drafts.",
            },
            {
              icon: Database,
              title: "Pattern intelligence",
              body: "Indicators normalize into searchable scam profiles so you can compare tactics without exposing victim identities.",
            },
            {
              icon: Heart,
              title: "Survivor community",
              body: "Stories and comments are moderated; suspicious links are blocked in comments to reduce re-victimization.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <AvascCard key={title} className="border-border/80">
              <AvascCardContent className="p-8">
                <Icon className="h-8 w-8 text-avasc-gold-light" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-5 text-lg font-semibold text-foreground">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </AvascCardContent>
            </AvascCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell contentClassName="max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <AvascCard className="border-border/80">
            <AvascCardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-avasc-cyan" aria-hidden />
                <h2 className="text-xl font-semibold text-foreground">Scam database preview</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Search anonymized indicators — wallets, domains, phones, and more — to see whether others reported
                similar tactics.
              </p>
              <Link
                href="/database"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-avasc-gold-light transition-colors hover:text-avasc-gold"
              >
                Open full search
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </AvascCardContent>
          </AvascCard>
          <AvascCard className="border-border/80">
            <AvascCardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-avasc-gold-light" aria-hidden />
                <h2 className="text-xl font-semibold text-foreground">Survivor stories</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Read moderated experiences from people who chose to speak out — optional anonymity, no DMs, safety
                first.
              </p>
              <ul className="mt-6 space-y-4">
                {stories.length ? (
                  stories.map((s) => (
                    <li key={s.id} className="border-b border-avasc-divider pb-4 last:border-0 last:pb-0">
                      <p className="font-medium text-foreground">{s.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{excerpt(s.body, 140)}</p>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">Stories will appear here as the community publishes them.</li>
                )}
              </ul>
              <Link
                href="/stories"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-avasc-gold-light transition-colors hover:text-avasc-gold"
              >
                Browse stories
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </AvascCardContent>
          </AvascCard>
        </div>
      </SectionShell>

      <SectionShell contentClassName="max-w-6xl">
        <CTASection
          title="Recovery support"
          description="Practical checklists for crypto scams, wire fraud, romance scams, and fake recovery offers — written for clarity, not legal advice."
          primaryLabel="Visit recovery center"
          primaryHref="/recovery"
        />
      </SectionShell>

      <SectionShell contentClassName="max-w-6xl">
        <CTASection
          title="Help more victims find support"
          description="Donations help AVASC keep reporting and recovery resources free, improve scam pattern intelligence, and support safe moderation for survivor stories."
          primaryLabel="Donate"
          primaryHref="/donate"
        />
      </SectionShell>

      <SectionShell
        title="Scam alerts & trends"
        description="Short warnings our team can publish as patterns emerge. Public entries in the database remain anonymized."
        contentClassName="max-w-6xl"
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {alerts.length ? (
            alerts.map((a) => (
              <li key={a.id}>
                <AvascCard className="h-full border-border/80">
                  <AvascCardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-avasc-orange">{a.severity}</p>
                    <p className="mt-2 font-semibold text-foreground">{a.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{excerpt(a.summary, 160)}</p>
                  </AvascCardContent>
                </AvascCard>
              </li>
            ))
          ) : (
            <>
              <li>
                <AvascCard className="border-border/80">
                  <AvascCardContent className="p-6 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Recovery scam surge</span>
                    <p className="mt-2">
                      Fraudsters pose as investigators and ask for &ldquo;unlock&rdquo; fees. Legitimate agencies do not
                      demand crypto or gift cards to release your money.
                    </p>
                  </AvascCardContent>
                </AvascCard>
              </li>
              <li>
                <AvascCard className="border-border/80">
                  <AvascCardContent className="p-6 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Crypto investment groups</span>
                    <p className="mt-2">
                      High-pressure Telegram or WhatsApp groups promising guaranteed returns often move victims to
                      unhosted wallets — document every address you are given.
                    </p>
                  </AvascCardContent>
                </AvascCard>
              </li>
            </>
          )}
        </ul>
      </SectionShell>
    </div>
  );
}
