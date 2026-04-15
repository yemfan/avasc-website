import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Scam Prevention & Education Guides | AVASC",
  description:
    "Learn how to identify scams, protect yourself, and recover with AVASC's comprehensive educational guides on romance scams, cryptocurrency fraud, investment schemes, and more.",
  openGraph: {
    title: "Scam Prevention & Education Guides | AVASC",
    description:
      "Learn how to identify scams, protect yourself, and recover with AVASC's comprehensive educational guides on romance scams, cryptocurrency fraud, investment schemes, and more.",
    type: "website",
    url: "https://avasc.org/guides",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides",
  },
};

const guides = [
  {
    slug: "how-to-identify-a-scam",
    title: "How to Identify a Scam: Warning Signs Everyone Should Know",
    description: "Learn the most common red flags and pressure tactics scammers use to manipulate victims.",
    color: "bg-blue-50 border-blue-200",
  },
  {
    slug: "what-to-do-if-youve-been-scammed",
    title: "What to Do If You've Been Scammed: Step-by-Step Recovery Guide",
    description: "Immediate actions to take, reporting procedures, and resources for emotional support.",
    color: "bg-amber-50 border-amber-200",
  },
  {
    slug: "romance-scam-warning-signs",
    title: "Romance Scam Warning Signs: How to Protect Yourself Online",
    description: "Recognize catfishing tactics, love bombing, and financial manipulation in online relationships.",
    color: "bg-rose-50 border-rose-200",
  },
  {
    slug: "cryptocurrency-scam-types",
    title: "Common Cryptocurrency Scam Types and How to Avoid Them",
    description: "Understand pig butchering, fake exchanges, and cryptocurrency investment fraud.",
    color: "bg-orange-50 border-orange-200",
  },
  {
    slug: "investment-scam-red-flags",
    title: "Investment Scam Red Flags: How to Spot Fraudulent Schemes",
    description: "Learn to identify Ponzi schemes, unregistered investments, and pressure-based tactics.",
    color: "bg-green-50 border-green-200",
  },
  {
    slug: "phishing-email-protection",
    title: "How to Protect Yourself from Phishing Emails and Fake Websites",
    description: "Spot fake emails, verify senders, and secure your accounts against digital fraud.",
    color: "bg-cyan-50 border-cyan-200",
  },
  {
    slug: "elder-fraud-prevention",
    title: "Elder Fraud Prevention: Protecting Seniors from Scams",
    description: "Understand scams targeting seniors and safeguards for protecting older adults.",
    color: "bg-purple-50 border-purple-200",
  },
  {
    slug: "social-media-scams",
    title: "Social Media Scams: How to Stay Safe on Facebook, Instagram, and TikTok",
    description: "Recognize fake giveaways, impersonation accounts, and marketplace fraud.",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    slug: "job-scam-warning-signs",
    title: "Job Scam Warning Signs: How to Spot Fake Employment Offers",
    description: "Learn to recognize fake job postings, work-from-home scams, and upfront fee requests.",
    color: "bg-fuchsia-50 border-fuchsia-200",
  },
  {
    slug: "tech-support-scam-protection",
    title: "Tech Support Scam Protection: Don't Fall for Fake Computer Warnings",
    description: "Identify fake virus popups, cold calls claiming to be Microsoft or Apple, and remote access tricks.",
    color: "bg-teal-50 border-teal-200",
  },
  {
    slug: "online-shopping-scam-prevention",
    title: "Online Shopping Scam Prevention: How to Shop Safely Online",
    description: "Learn to identify fake websites, counterfeit products, and unsafe payment methods.",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    slug: "identity-theft-protection",
    title: "Identity Theft Protection: How to Safeguard Your Personal Information",
    description: "Protect your SSN, monitor credit, freeze accounts, and detect data breaches early.",
    color: "bg-violet-50 border-violet-200",
  },
  {
    slug: "money-mule-awareness",
    title: "Money Mule Scams: How Criminals Use Innocent People to Move Money",
    description: "Learn how people get recruited, the legal consequences, and what to do if involved.",
    color: "bg-pink-50 border-pink-200",
  },
  {
    slug: "charity-scam-verification",
    title: "How to Verify a Charity and Avoid Donation Scams",
    description: "Verify 501(c)(3) status, check Charity Navigator, and avoid fake charities after disasters.",
    color: "bg-sky-50 border-sky-200",
  },
  {
    slug: "business-email-compromise",
    title: "Business Email Compromise (BEC): How Scammers Target Companies",
    description: "Learn about CEO fraud, invoice manipulation, vendor impersonation, and prevention policies.",
    color: "bg-lime-50 border-lime-200",
  },
  {
    slug: "sextortion-and-blackmail-scams",
    title: "Sextortion and Online Blackmail: What to Do and How to Get Help",
    description: "Learn what sextortion is, why you shouldn't pay, how to report, and where to find support.",
    color: "bg-red-50 border-red-200",
  },
];

export default function GuidesPage() {
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
    ],
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Scam Prevention Guides</h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">
          Knowledge is your best defense against fraud. Explore our comprehensive guides to learn how to identify common scams, protect yourself, and recover if you've been victimized. Each guide provides actionable insights based on real scam patterns.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={`group rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300 ${guide.color}`}
          >
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{guide.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
              Read guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Still have questions?</h2>
        <p className="mt-3 text-sm text-slate-600">
          If you think you've been scammed or need additional support, our team is here to help.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/report"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Report a scam
          </Link>
          <Link
            href="/recovery"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Recovery resources
          </Link>
        </div>
      </div>
    </div>
  );
}
