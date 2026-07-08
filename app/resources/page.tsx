import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ReportCta } from "@/components/avasc/ReportCta";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://avasc.org").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Scam Resources — Report, Learn & Get Help",
  description:
    "A curated directory of trusted places to report a scam, learn how to protect yourself, check before you trust, and find victim support — from government agencies and established nonprofits.",
  openGraph: {
    title: "Scam Resources — Report, Learn & Get Help | AVASC",
    description:
      "Trusted places to report scams, learn online safety, verify before you trust, and get victim support.",
    type: "website",
    url: `${SITE_URL}/resources`,
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  alternates: { canonical: "/resources" },
};

type Resource = { name: string; url: string; description: string };
type ResourceGroup = { title: string; blurb: string; items: Resource[] };

const GROUPS: ResourceGroup[] = [
  {
    title: "Report a scam (official)",
    blurb:
      "Filing an official report creates a record, helps investigators spot patterns, and is often required by banks or insurers. Reporting to AVASC does not replace these — do both where you can.",
    items: [
      {
        name: "FTC — Report Fraud",
        url: "https://reportfraud.ftc.gov",
        description: "The U.S. Federal Trade Commission's intake for scams, imposters, and deceptive practices.",
      },
      {
        name: "FBI IC3",
        url: "https://www.ic3.gov",
        description: "The FBI's Internet Crime Complaint Center — cyber-enabled fraud, wire fraud, and crypto theft.",
      },
      {
        name: "IdentityTheft.gov",
        url: "https://www.identitytheft.gov",
        description: "FTC-run recovery planner that builds a personalized step-by-step plan if your identity was compromised.",
      },
      {
        name: "CFPB Complaints",
        url: "https://www.consumerfinance.gov/complaint/",
        description: "Report problems with banks, lenders, and other financial companies to the Consumer Financial Protection Bureau.",
      },
      {
        name: "SEC — Report Investment Fraud",
        url: "https://www.sec.gov/tcr",
        description: "Securities and Exchange Commission tips, complaints, and referrals for investment schemes.",
      },
      {
        name: "FCC — Unwanted Calls & Texts",
        url: "https://consumercomplaints.fcc.gov",
        description: "Report robocalls and smishing (scam texts) to the Federal Communications Commission.",
      },
    ],
  },
  {
    title: "Learn & prevent",
    blurb: "Free, authoritative education to help you and the people you care about recognize scams before they cause harm.",
    items: [
      {
        name: "FTC Consumer Advice",
        url: "https://consumer.ftc.gov/scams",
        description: "Plain-language articles on how the latest scams work and how to avoid them.",
      },
      {
        name: "AARP Fraud Watch Network",
        url: "https://www.aarp.org/money/scams-fraud/",
        description: "Scam alerts, prevention tips, and a free helpline — helpful for older adults and their families.",
      },
      {
        name: "CISA — Secure Our World",
        url: "https://www.cisa.gov/secure-our-world",
        description: "The U.S. cybersecurity agency's simple steps to stay safe online.",
      },
      {
        name: "National Cybersecurity Alliance",
        url: "https://staysafeonline.org",
        description: "StaySafeOnline — practical online-safety guidance for individuals and small businesses.",
      },
      {
        name: "Google — Be Scam Ready",
        url: "https://bescamready.withgoogle.com",
        description: "Interactive tips to spot and avoid common online scams.",
      },
      {
        name: "BBB Scam Tips",
        url: "https://www.bbb.org/all/scamtips",
        description: "Better Business Bureau guidance on avoiding the most-reported scams.",
      },
    ],
  },
  {
    title: "Check before you trust",
    blurb: "Look something up before you send money, click a link, or accept an offer.",
    items: [
      {
        name: "BBB Scam Tracker",
        url: "https://www.bbb.org/scamtracker",
        description: "Search and report scams by type and location to see what others are experiencing.",
      },
      {
        name: "FTC Scam Alerts",
        url: "https://consumer.ftc.gov/scam-alerts",
        description: "Timely warnings about scams that are active right now.",
      },
      {
        name: "Chainabuse",
        url: "https://www.chainabuse.com",
        description: "Community reports of malicious crypto wallet addresses and scam platforms.",
      },
    ],
  },
  {
    title: "Victim support & getting help",
    blurb: "If you have been targeted, you are not alone — and it is not your fault. These services offer real help.",
    items: [
      {
        name: "Cybercrime Support Network",
        url: "https://fightcybercrime.org",
        description: "FightCybercrime.org — guidance and support for individuals and businesses recovering from cybercrime.",
      },
      {
        name: "Identity Theft Resource Center",
        url: "https://www.idtheftcenter.org",
        description: "Free, confidential help for victims of identity theft and related fraud.",
      },
      {
        name: "AARP Fraud Watch Helpline",
        url: "https://www.aarp.org/money/scams-fraud/helpline/",
        description: "Talk it through with a trained specialist (877-908-3360) — you don't have to be an AARP member.",
      },
      {
        name: "988 Suicide & Crisis Lifeline",
        url: "https://988lifeline.org",
        description: "If the stress feels overwhelming, call or text 988 (US) for free, confidential support, 24/7.",
      },
      {
        name: "NCMEC CyberTipline",
        url: "https://report.cybertip.org",
        description: "Report sextortion or online exploitation involving a minor to the National Center for Missing & Exploited Children.",
      },
    ],
  },
];

export default function ResourcesPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Scam resources</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Trusted places to report a scam, learn how to protect yourself, check before you trust, and
          find support if you&apos;ve been targeted. We link only to government agencies and established
          nonprofits. Reporting to{" "}
          <Link href="/report" className="text-[var(--avasc-gold-light)] underline underline-offset-2 hover:text-[var(--avasc-gold)]">
            AVASC
          </Link>{" "}
          helps us spot patterns, but it doesn&apos;t replace filing with these official channels.
        </p>
      </header>

      {GROUPS.map((group) => (
        <section key={group.title} className="space-y-4">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground">{group.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{group.blurb}</p>
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
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </a>
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-xs leading-relaxed text-[var(--avasc-text-muted)]">
        External links are provided for convenience and education. AVASC is not affiliated with these
        organizations and is not responsible for their content. Always reach a service by typing its
        address yourself rather than following links from an unexpected message.
      </p>

      <ReportCta />
    </div>
  );
}
