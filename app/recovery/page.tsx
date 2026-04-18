import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Recovery Center | AVASC",
  description: "Find guidance and resources for recovering from cyber-scams.",
  openGraph: {
    title: "Recovery Center | AVASC",
    description: "Find guidance and resources for recovering from cyber-scams.",
    type: "website",
    url: "https://avasc.org/recovery",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/recovery",
  },
};

const modules = [
  {
    title: "Crypto scam response",
    points: [
      "Stop sending funds; rotate credentials if a platform was compromised.",
      "Export transaction hashes, wallet addresses, and chat logs (redact personal IDs).",
      "Report to your exchange and local cybercrime unit where available.",
    ],
  },
  {
    title: "Bank & wire fraud",
    points: [
      "Call your bank’s fraud line immediately with dates and amounts.",
      "Request recall / SWIFT investigation for wires when timing allows.",
      "Preserve emails, SMS, and call logs that show misrepresentation.",
    ],
  },
  {
    title: "Romance & social engineering",
    points: [
      "Cease contact with the scammer; do not accept new “helpers” from the same thread.",
      "Document platform handles and payment trails.",
      "Seek emotional support from trusted people or counselors — shame is a tactic.",
    ],
  },
  {
    title: "Fake recovery agents",
    points: [
      "Anyone promising guaranteed return for an upfront fee is highly suspect.",
      "Legitimate agencies do not ask for gift cards or crypto to “unlock” funds.",
      "Report the new scam attempt to AVASC with prior case reference if you have one.",
    ],
  },
];

export default function RecoveryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Recovery Center",
        item: "https://avasc.org/recovery",
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to home
      </Link>
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Recovery center</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Grounded first steps and warnings — not legal advice. Pair this with a structured{" "}
          <Link href="/report" className="font-medium text-slate-900 underline underline-offset-2">
            scam report
          </Link>{" "}
          so our team can triage and match patterns safely.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((m) => (
          <section
            key={m.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{m.title}</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-600">
              {m.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-amber-950">
        <p className="font-semibold">Evidence checklist</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-amber-950/90">
          <li>Chronological narrative (private report form)</li>
          <li>Indicators: domains, numbers, wallets, transaction IDs</li>
          <li>Screenshots and PDFs (upload after account creation where required)</li>
          <li>Financial institution reference numbers</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Authoritative reporting resources</h2>
        <p className="mt-2 text-sm text-slate-600">
          Filing with the relevant U.S. agency creates an official record, helps investigators
          spot patterns, and is often required by banks or insurers. Filing with AVASC does not
          replace these — we encourage you to do both.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">FTC — Report Fraud</h3>
            <p className="mt-1 text-sm text-slate-600">
              reportfraud.ftc.gov — the U.S. Federal Trade Commission’s consumer fraud intake for
              scams, imposters, and deceptive business practices.
            </p>
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">FBI IC3</h3>
            <p className="mt-1 text-sm text-slate-600">
              ic3.gov — the FBI’s Internet Crime Complaint Center. File here for cyber-enabled
              fraud, wire fraud, crypto theft, and cross-border schemes.
            </p>
          </a>
          <a
            href="https://www.identitytheft.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">IdentityTheft.gov</h3>
            <p className="mt-1 text-sm text-slate-600">
              identitytheft.gov — FTC-run recovery planner that generates a personalized
              step-by-step plan if your identity or accounts were compromised.
            </p>
          </a>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Next Steps</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/stories"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Read Survivor Stories</h3>
            <p className="mt-1 text-sm text-slate-600">
              Learn from others who've been scammed and recovered.
            </p>
          </Link>
          <Link
            href="/report"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Report Your Case</h3>
            <p className="mt-1 text-sm text-slate-600">
              Submit a detailed report to help identify scam patterns.
            </p>
          </Link>
          <Link
            href="/database"
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <h3 className="font-medium text-slate-900">Search Our Scam Database</h3>
            <p className="mt-1 text-sm text-slate-600">
              Look up indicators and check scam profiles.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
