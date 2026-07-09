import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ReportCta } from "@/components/avasc/ReportCta";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.avasc.org").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("resources");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      url: `${SITE_URL}/resources`,
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    alternates: { canonical: "/resources" },
  };
}

type Resource = { name: string; url: string; descKey: string };
type ResourceGroup = { titleKey: string; blurbKey: string; items: Resource[] };

const GROUPS: ResourceGroup[] = [
  {
    titleKey: "group1Title",
    blurbKey: "group1Blurb",
    items: [
      { name: "FTC — Report Fraud", url: "https://reportfraud.ftc.gov", descKey: "ftcReportFraud" },
      { name: "FBI IC3", url: "https://www.ic3.gov", descKey: "fbiIc3" },
      { name: "IdentityTheft.gov", url: "https://www.identitytheft.gov", descKey: "identityTheftGov" },
      { name: "CFPB Complaints", url: "https://www.consumerfinance.gov/complaint/", descKey: "cfpb" },
      { name: "SEC — Report Investment Fraud", url: "https://www.sec.gov/tcr", descKey: "sec" },
      { name: "FCC — Unwanted Calls & Texts", url: "https://consumercomplaints.fcc.gov", descKey: "fcc" },
    ],
  },
  {
    titleKey: "group2Title",
    blurbKey: "group2Blurb",
    items: [
      { name: "FTC Consumer Advice", url: "https://consumer.ftc.gov/scams", descKey: "ftcConsumerAdvice" },
      { name: "AARP Fraud Watch Network", url: "https://www.aarp.org/money/scams-fraud/", descKey: "aarpFraudWatch" },
      { name: "CISA — Secure Our World", url: "https://www.cisa.gov/secure-our-world", descKey: "cisa" },
      { name: "National Cybersecurity Alliance", url: "https://staysafeonline.org", descKey: "ncsa" },
      { name: "Google — Be Scam Ready", url: "https://bescamready.withgoogle.com", descKey: "googleScamReady" },
      { name: "BBB Scam Tips", url: "https://www.bbb.org/all/scamtips", descKey: "bbbScamTips" },
    ],
  },
  {
    titleKey: "group3Title",
    blurbKey: "group3Blurb",
    items: [
      { name: "BBB Scam Tracker", url: "https://www.bbb.org/scamtracker", descKey: "bbbScamTracker" },
      { name: "FTC Scam Alerts", url: "https://consumer.ftc.gov/scam-alerts", descKey: "ftcScamAlerts" },
      { name: "Chainabuse", url: "https://www.chainabuse.com", descKey: "chainabuse" },
    ],
  },
  {
    titleKey: "group4Title",
    blurbKey: "group4Blurb",
    items: [
      { name: "Cybercrime Support Network", url: "https://fightcybercrime.org", descKey: "cybercrimeSupport" },
      { name: "Identity Theft Resource Center", url: "https://www.idtheftcenter.org", descKey: "idtheftCenter" },
      { name: "AARP Fraud Watch Helpline", url: "https://www.aarp.org/money/scams-fraud/helpline/", descKey: "aarpHelpline" },
      { name: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org", descKey: "lifeline988" },
      { name: "NCMEC CyberTipline", url: "https://report.cybertip.org", descKey: "ncmec" },
    ],
  },
];

export default async function ResourcesPage() {
  const t = await getTranslations("resources");

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Scam Resources — Report, Learn & Get Help",
    description:
      "A curated directory of trusted resources to report scams, learn online safety, verify before you trust, and get victim support.",
    url: `${SITE_URL}/resources`,
    isPartOf: { "@type": "WebSite", name: "AVASC", url: SITE_URL },
    hasPart: GROUPS.flatMap((g) =>
      g.items.map((item) => ({ "@type": "WebPage", name: item.name, url: item.url }))
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t("heading")}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t.rich("intro", {
            report: (chunks) => (
              <Link href="/report" className="text-[var(--avasc-gold-light)] underline underline-offset-2 hover:text-[var(--avasc-gold)]">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </header>

      {GROUPS.map((group) => (
        <section key={group.titleKey} className="space-y-4">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground">{t(group.titleKey)}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(group.blurbKey)}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.items.map((item) => {
              let host = item.url;
              try {
                host = new URL(item.url).host.replace(/^www\./, "");
              } catch {
                /* keep raw url */
              }
              return (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-5 shadow-sm transition-colors hover:border-[var(--avasc-gold)]/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-foreground group-hover:text-[var(--avasc-gold-light)]">
                      {item.name}
                    </span>
                    <ExternalLink
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avasc-text-muted)] group-hover:text-[var(--avasc-gold-light)]"
                      aria-hidden
                    />
                  </div>
                  <span className="mt-0.5 text-xs text-[var(--avasc-text-muted)]">{host}</span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
                </a>
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
        {t("disclaimer")}
      </p>

      <ReportCta />
    </div>
  );
}
