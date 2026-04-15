import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Job Scam Warning Signs: How to Spot Fake Employment Offers | AVASC",
  description:
    "Learn to recognize fake job postings, work-from-home scams, and employment fraud. Protect yourself from upfront fee requests, check-cashing schemes, and reshipping scams.",
  openGraph: {
    title: "Job Scam Warning Signs: How to Spot Fake Employment Offers | AVASC",
    description:
      "Learn to recognize fake job postings, work-from-home scams, and employment fraud. Protect yourself from upfront fee requests, check-cashing schemes, and reshipping scams.",
    type: "article",
    url: "https://avasc.org/guides/job-scam-warning-signs",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/job-scam-warning-signs",
  },
};

export default function JobScamWarningSignsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Job Scam Warning Signs: How to Spot Fake Employment Offers",
    description:
      "Learn to recognize fake job postings, work-from-home scams, and employment fraud.",
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
        name: "Job Scam Warning Signs",
        item: "https://avasc.org/guides/job-scam-warning-signs",
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
          Job Scam Warning Signs: How to Spot Fake Employment Offers
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          The job market is competitive, and scammers exploit people's desperation to find work. They post fake job listings, offer unrealistic work-from-home positions, and request upfront payments for "training" or "materials." Learning to spot these red flags can save you money, time, and emotional distress.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Most Common Job Scam Warning Signs</h2>
          <p className="text-slate-700 leading-relaxed">
            Job scammers use similar tactics across platforms. Watch for these immediate red flags:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Requesting payment upfront</h3>
            <p className="mt-2 text-slate-700">
              The biggest red flag. Legitimate employers never ask you to pay for training, materials, background checks, or "processing fees" before hiring you. If a job opportunity requires money before you start working, it's a scam.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Vague job descriptions</h3>
            <p className="mt-2 text-slate-700">
              Legitimate job postings clearly describe responsibilities, required qualifications, and reporting structure. Scam postings are deliberately vague—"easy money," "work when you want," "no experience needed"—to appeal to desperate job seekers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unrealistic salary offers</h3>
            <p className="mt-2 text-slate-700">
              "Make $10,000 a month working from home part-time!" is a classic scam pitch. If the salary is significantly higher than what similar jobs pay in your area, it's likely a scam designed to hook desperate job seekers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">No formal interview process</h3>
            <p className="mt-2 text-slate-700">
              Legitimate employers conduct interviews to evaluate candidates. If you receive an immediate job offer without an interview, phone call, or video chat, it's a warning sign. Scammers skip interviews to avoid detection.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Communication only through informal channels</h3>
            <p className="mt-2 text-slate-700">
              If a company contacts you only via personal email, text message, or messaging apps instead of official company email or phone, be suspicious. Legitimate employers use professional communication channels.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Poor grammar and spelling in job postings</h3>
            <p className="mt-2 text-slate-700">
              Professional companies proofread their job listings. Multiple spelling errors, awkward phrasing, and grammatical mistakes are often signs of a scam, especially if the job is supposed to be in English-speaking roles.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Posting on informal platforms only</h3>
            <p className="mt-2 text-slate-700">
              If a major company is only advertising on classified sites, social media, or messaging apps rather than their official website or legitimate job boards, it's likely not a real position.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Requesting personal financial information</h3>
            <p className="mt-2 text-slate-700">
              Employers need your Social Security number for tax purposes, but only after you're hired. If they ask for banking details, Social Security number, or credit card information before you're officially employed, it's a scam.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common Job Scam Types</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Work-from-home scams</h3>
            <p className="mt-2 text-slate-700">
              These prey on people seeking flexible work. The "job" might be stuffing envelopes, assembling products, or other tasks requiring startup fees. Once you pay, communication stops. Legitimate work-from-home jobs exist, but they're with established companies using official hiring processes.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check-cashing scams</h3>
            <p className="mt-2 text-slate-700">
              The "employer" sends you a check for supplies, equipment, or training. You deposit it and wire part of the money back as requested. Days later, the check bounces, and you're liable for the full amount. This is one of the most damaging job scams.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Reshipping scams</h3>
            <p className="mt-2 text-slate-700">
              You're hired to "receive packages and forward them." You receive items (often purchased with stolen credit cards), then send them elsewhere. You become part of the fraud chain and could face legal consequences.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Mystery shopper scams</h3>
            <p className="mt-2 text-slate-700">
              You're hired to evaluate stores or restaurants. After you pay an upfront fee or complete a fake assignment, the company disappears. Real mystery shopper jobs don't require upfront payments.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake job interview fee scams</h3>
            <p className="mt-2 text-slate-700">
              You're offered a position but asked to pay a "processing fee" or "background check fee" before receiving official paperwork. Once paid, communication stops and you never hear from them again.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Impersonation of legitimate companies</h3>
            <p className="mt-2 text-slate-700">
              Scammers create fake websites or email addresses that look like they're from major companies (Amazon, Google, Apple, etc.). They post jobs on legitimate job boards using these fake identities to collect personal information.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Verify a Job Opportunity</h2>
          <p className="text-slate-700 leading-relaxed">
            Before applying or providing any information, verify the job is legitimate:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check the company's official website</h3>
            <p className="mt-2 text-slate-700">
              Go directly to the company's official website (not a link provided in the job posting) and look for their careers page. If the job isn't listed there, it's likely fake. Be careful of fake websites that look similar to real ones.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Call the company directly</h3>
            <p className="mt-2 text-slate-700">
              Look up the company's main phone number independently (not from the job posting). Call and ask if they're hiring for the position described. This is the fastest way to verify legitimacy.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Research on trusted job boards</h3>
            <p className="mt-2 text-slate-700">
              Use established job sites like LinkedIn, Indeed, Glassdoor, or ZipRecruiter. Research the company on these platforms. Read employee reviews. Scammers sometimes post on these sites, but they're more likely to be caught and removed.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Look for the company on social media</h3>
            <p className="mt-2 text-slate-700">
              Check the company's official social media accounts (LinkedIn, Twitter, Facebook). See if they post about job openings there. Legitimate companies have verified, active social media presences with many followers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify the sender's email address</h3>
            <p className="mt-2 text-slate-700">
              Real company emails come from company domains (like @companyname.com). Scammers use free email services (Gmail, Yahoo) or near-identical addresses (like @companynamee.com). Check carefully.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Search for reviews and complaints</h3>
            <p className="mt-2 text-slate-700">
              Search the company name plus "scam" or "complaints" online. Check sites like BBB (Better Business Bureau), ScamAdvisor, and Trustpilot. If many people report it as a scam, avoid it.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Never pay upfront—ever</h3>
            <p className="mt-2 text-slate-700">
              This cannot be overstated: legitimate employers never charge job applicants for anything. Not for training, background checks, equipment, supplies, or processing fees. If money is requested before employment, it's a scam.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Red Flags During the Interview Process</h2>
          <p className="text-slate-700 leading-relaxed">
            Even if the job posting looks legitimate, be alert during the interview:
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• Interviewer avoids video calls or phone calls, communicating only by email or text</li>
            <li>• Interview is extremely brief and doesn't ask substantive questions about your qualifications</li>
            <li>• Immediate job offer without discussing salary, benefits, or job responsibilities</li>
            <li>• Request to send money before official paperwork is provided</li>
            <li>• Vague answers when you ask specific questions about the role or company</li>
            <li>• Request to work on a "trial project" and submit personal information or banking details</li>
            <li>• Instructions to keep the job opportunity secret from others</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Job hunting is stressful, and scammers exploit that vulnerability. Remember: legitimate employers want to hire you, not take your money. If a job opportunity requires payment before employment, promises unrealistic income, or feels rushed and informal, trust your instincts and move on. The right job will come through proper channels without upfront costs.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">What's Next?</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if a person, number, or company is known to scam.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Report a job scam to help protect others in your community.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            If you've already paid money to a scammer, don't give up. Visit our{" "}
            <Link href="/recovery" className="font-medium text-slate-900 underline underline-offset-2">
              recovery resources
            </Link>{" "}
            for immediate steps to take.
          </p>
        </div>
      </div>
    </div>
  );
}
