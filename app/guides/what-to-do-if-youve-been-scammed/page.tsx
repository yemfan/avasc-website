import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "What to Do If You've Been Scammed: Step-by-Step Recovery Guide | AVASC",
  description:
    "Immediate actions to take after a scam, how to report to authorities, document evidence, and access emotional support. Recovery starts now.",
  openGraph: {
    title: "What to Do If You've Been Scammed: Step-by-Step Recovery Guide | AVASC",
    description:
      "Immediate actions to take after a scam, how to report to authorities, document evidence, and access emotional support. Recovery starts now.",
    type: "article",
    url: "https://avasc.org/guides/what-to-do-if-youve-been-scammed",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/what-to-do-if-youve-been-scammed",
  },
};

export default function WhatToDoIfScammedPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What to Do If You've Been Scammed: Step-by-Step Recovery Guide",
    description:
      "Immediate actions to take after a scam, how to report to authorities, document evidence, and access emotional support.",
    author: {
      "@type": "Organization",
      name: "AVASC",
      url: "https://avasc.org",
    },
    datePublished: "2025-01-01",
    publisher: {
      "@type": "Organization",
      name: "AVASC",
    },
  };

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
        name: "Guides",
        item: "https://avasc.org/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "What to Do If You've Been Scammed",
        item: "https://avasc.org/guides/what-to-do-if-youve-been-scammed",
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Link
        href="/guides"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to guides
      </Link>

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          What to Do If You've Been Scammed: Step-by-Step Recovery Guide
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Being scammed is not a personal failure. Scammers are skilled manipulators who exploit trust. The most important thing now is to take action. These steps will help you minimize damage and begin recovery.
        </p>
      </header>

      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6">
        <h2 className="font-semibold text-red-950">If you're in immediate danger</h2>
        <p className="mt-2 text-sm text-red-950/90">
          If a scammer is threatening violence or you're experiencing a mental health crisis, contact emergency services immediately.
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Step 1: Immediate Actions (Today)</h2>
          <p className="text-slate-700 leading-relaxed">
            Take these steps immediately to prevent further damage:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Stop all contact</h3>
            <p className="mt-2 text-slate-700">
              Cut off communication with the scammer immediately. Block their number, email, and social media accounts. Do not respond, even to say goodbye or to ask questions.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Secure your accounts</h3>
            <p className="mt-2 text-slate-700">
              If the scammer has access to your email, banking, or social media passwords, change all of them immediately. Use strong, unique passwords and enable two-factor authentication on all critical accounts.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check your accounts for unauthorized activity</h3>
            <p className="mt-2 text-slate-700">
              Review your bank and credit card statements for unauthorized transactions. Check for new accounts opened in your name and monitor your credit report.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you sent cryptocurrency</h3>
            <p className="mt-2 text-slate-700">
              Write down the wallet address and transaction ID immediately. Once crypto is sent, it's difficult to recover, but documenting this information is important for reporting and investigation.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you sent a wire or bank transfer</h3>
            <p className="mt-2 text-slate-700">
              Call your bank's fraud line immediately. Provide the transaction reference number, the recipient's name and account, and the wire amount. Your bank may be able to recall the funds if the receiving bank is also cooperative.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you shared personal information</h3>
            <p className="mt-2 text-slate-700">
              If you provided your Social Security number, driver's license, passport, or other identity documents, place a fraud alert with the credit bureaus and consider freezing your credit.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Step 2: Document Everything (Within 24 Hours)</h2>
          <p className="text-slate-700 leading-relaxed">
            Gather and preserve evidence for official reports and investigations:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Save screenshots and records</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>All messages (text, email, social media, dating app)</li>
              <li>Fake profiles or impersonation accounts</li>
              <li>Financial transfers or bank records</li>
              <li>Cryptocurrency transaction details</li>
              <li>Website or app screenshots showing fake offers</li>
              <li>Phone call logs and voicemails</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Create a timeline</h3>
            <p className="mt-2 text-slate-700">
              Write down chronologically when you met the scammer, how they contacted you, what they promised, when payments were made, and what you've learned since discovering the scam.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Collect financial information</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Amount of money sent and dates</li>
              <li>Payment methods used (gift cards, wire, cryptocurrency, etc.)</li>
              <li>Bank reference numbers or confirmation codes</li>
              <li>Addresses where money was sent</li>
              <li>Phone numbers, email addresses, usernames</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Document all contacts</h3>
            <p className="mt-2 text-slate-700">
              Write down any names (real or fake), phone numbers, email addresses, social media handles, dating app usernames, and any identifying information about the scammer. This helps authorities and other victims recognize patterns.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Step 3: Report to Authorities</h2>
          <p className="text-slate-700 leading-relaxed">
            Multiple agencies need to hear about your scam. Reporting creates an official record and helps law enforcement identify patterns:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Federal Trade Commission (FTC) - ReportFraud.ftc.gov</h3>
            <p className="mt-2 text-slate-700">
              This is the primary federal agency for consumer fraud. Report any online scam here, including romance scams, investment fraud, and crypto scams. The FTC shares information with law enforcement agencies.
            </p>
            <p className="mt-2 text-sm font-medium text-slate-600">Online: reportfraud.ftc.gov</p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">FBI Internet Crime Complaint Center (IC3) - IC3.gov</h3>
            <p className="mt-2 text-slate-700">
              Report any internet-facilitated crime here, especially if significant money was lost. The IC3 is part of the FBI and investigates cybercrime patterns.
            </p>
            <p className="mt-2 text-sm font-medium text-slate-600">Online: ic3.gov</p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Local police department</h3>
            <p className="mt-2 text-slate-700">
              File a police report with your local police department. Provide them with all documentation. You'll receive a case number, which may be needed for financial claims or credit disputes.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Your financial institution</h3>
            <p className="mt-2 text-slate-700">
              Report fraud to your bank, credit card company, or payment service. They have fraud departments and may be able to dispute transactions or prevent further unauthorized activity.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Cryptocurrency exchange or wallet provider</h3>
            <p className="mt-2 text-slate-700">
              If you sent cryptocurrency, report it to the exchange or wallet service. While recovery is difficult, they may freeze suspicious accounts or assist law enforcement.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">AVASC - avasc.org</h3>
            <p className="mt-2 text-slate-700">
              Report your scam to AVASC. Your structured report helps us identify patterns, maintain a searchable database, and connect victims with targeted resources.
            </p>
            <Link href="/report" className="mt-3 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Report to AVASC
            </Link>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Dating platform or social media</h3>
            <p className="mt-2 text-slate-700">
              Report the fake profile or scammer account. They may have multiple targets. Include all documentation. These platforms sometimes cooperate with law enforcement.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Step 4: Protect Your Identity and Credit</h2>
          <p className="text-slate-700 leading-relaxed">
            Take steps to prevent identity theft and credit fraud:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor your credit report</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Get a free credit report from annualcreditreport.com</li>
              <li>Check for accounts you didn't open</li>
              <li>Monitor for unauthorized inquiries</li>
              <li>Sign up for free credit monitoring services</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Place a fraud alert</h3>
            <p className="mt-2 text-slate-700">
              Contact the three credit bureaus (Equifax, Experian, TransUnion) and request a fraud alert. This makes it harder for someone to open accounts in your name. You can place an initial alert by contacting any one of them.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Consider a credit freeze</h3>
            <p className="mt-2 text-slate-700">
              A credit freeze prevents new accounts from being opened in your name. It's free and can be placed with all three bureaus. You can lift it temporarily if you need to apply for credit.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check your email and phone accounts</h3>
            <p className="mt-2 text-slate-700">
              Review login activity in your email and phone accounts. Look at connected devices and apps. Remove anything unauthorized. These accounts are gateways to all your other accounts.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Step 5: Emotional Support and Recovery</h2>
          <p className="text-slate-700 leading-relaxed">
            Being scammed carries emotional weight. Shame, embarrassment, anger, and anxiety are normal. You deserve support:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Acknowledge your feelings</h3>
            <p className="mt-2 text-slate-700">
              Shame is part of scammers' toolkit—they exploit trust and compassion. Being fooled doesn't mean you're stupid or weak. Intelligent, kind people get scammed every day.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Talk to someone you trust</h3>
            <p className="mt-2 text-slate-700">
              Tell a friend, family member, or therapist what happened. Isolation feeds shame. Honest conversation often reveals that others have experienced similar situations.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Seek professional support</h3>
            <p className="mt-2 text-slate-700">
              A therapist, counselor, or financial advisor can help you process trauma, make recovery decisions, and rebuild. Many offer sliding scale fees or online options.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Join a support community</h3>
            <p className="mt-2 text-slate-700">
              Online communities and support groups for scam victims exist. Connecting with people who understand what you're going through can reduce isolation and provide practical advice.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Step 6: Beware of Recovery Scams</h2>
          <p className="text-slate-700 leading-relaxed">
            After you've been scammed, you're vulnerable to recovery scams. These are extremely common:
          </p>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">Major red flags</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>Unsolicited contact offering to recover your money</li>
              <li>Requests for an upfront fee (gift cards, crypto, wire transfer)</li>
              <li>Claims of special government programs for scam victims</li>
              <li>Promises of guaranteed recovery</li>
              <li>Pressure to move quickly and keep it secret</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to protect yourself</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Never pay anyone for help recovering funds</li>
              <li>Real recovery is handled by law enforcement, not private services</li>
              <li>If someone contacts you with recovery help, they're probably scammers</li>
              <li>Trust legitimate agencies (FBI, FTC, your bank)</li>
            </ul>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Recovery is possible</h2>
          <p className="mt-3 text-amber-950/90">
            Financial recovery depends on the type and speed of response, but emotional and psychological recovery is entirely within your control. By taking these steps, you're regaining agency and moving forward. Many victims find that their willingness to help others—by sharing their story, reporting to AVASC, or speaking up in their community—helps them heal.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Additional Resources</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Recovery Center</h3>
            <p className="mt-2 text-sm text-slate-600">Scam-specific recovery guidance and checklists.</p>
          </Link>

          <Link
            href="/guides/how-to-identify-a-scam"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">How to Identify a Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Learn warning signs to prevent future scams.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            You can also{" "}
            <Link href="/report" className="font-medium text-slate-900 underline underline-offset-2">
              report your scam to AVASC
            </Link>{" "}
            directly. Our team will help ensure your case is documented and patterns are identified.
          </p>
        </div>
      </div>
    </div>
  );
}
