import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How to Identify a Scam: Warning Signs Everyone Should Know | AVASC",
  description:
    "Learn the common red flags, pressure tactics, and suspicious offers that indicate you may be targeted by scammers. Essential knowledge to protect yourself.",
  openGraph: {
    title: "How to Identify a Scam: Warning Signs Everyone Should Know | AVASC",
    description:
      "Learn the common red flags, pressure tactics, and suspicious offers that indicate you may be targeted by scammers. Essential knowledge to protect yourself.",
    type: "article",
    url: "https://avasc.org/guides/how-to-identify-a-scam",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/how-to-identify-a-scam",
  },
};

export default function HowToIdentifyScamPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Identify a Scam: Warning Signs Everyone Should Know",
    description:
      "Learn the common red flags, pressure tactics, and suspicious offers that indicate you may be targeted by scammers.",
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
        name: "How to Identify a Scam",
        item: "https://avasc.org/guides/how-to-identify-a-scam",
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
          How to Identify a Scam: Warning Signs Everyone Should Know
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Scammers are skilled manipulators who study human psychology. They're patient, persistent, and increasingly sophisticated. But they share common tactics. Learning to recognize these patterns is your strongest defense.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Universal Warning Signs</h2>
          <p className="text-slate-700 leading-relaxed">
            These red flags appear across almost every scam type. If you notice one or more of these, stop and verify before proceeding:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">1. Unsolicited contact</h3>
            <p className="mt-2 text-slate-700">
              A stranger reaches out via email, text, social media, phone, or a dating app offering an opportunity you didn't ask for. Legitimate businesses rarely contact you unsolicited with financial opportunities.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">2. Requests for unusual payment methods</h3>
            <p className="mt-2 text-slate-700">
              They ask you to pay via gift cards, cryptocurrency, wire transfer, or peer-to-peer payment apps. These are irreversible payments that scammers love because they can't be disputed once sent.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">3. Pressure to act fast</h3>
            <p className="mt-2 text-slate-700">
              "This offer expires today," "limited spots available," "act now before it closes." Artificial urgency prevents you from thinking clearly. Legitimate opportunities rarely demand immediate decisions.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">4. Too good to be true</h3>
            <p className="mt-2 text-slate-700">
              Guaranteed returns on investments, easy money for minimal work, free money you don't qualify for. If it sounds too good to be true, it is. Scammers hook you with the promise, then deepen the manipulation.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">5. Requests to keep it secret</h3>
            <p className="mt-2 text-slate-700">
              "Don't tell anyone," "keep this between us," "your employer/family shouldn't know about this opportunity." Secrecy isolates you from people who could warn you.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">6. Mismatched communication</h3>
            <p className="mt-2 text-slate-700">
              Poor grammar, spelling errors, unusual phrasing, or communication that doesn't match the organization's usual style. Scammers often operate from outside your country.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Pressure Tactics Scammers Use</h2>
          <p className="text-slate-700 leading-relaxed">
            Beyond initial red flags, watch for these psychological manipulation techniques:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Building false trust</h3>
            <p className="mt-2 text-slate-700">
              They may spend weeks building rapport, asking about your life, showing interest in your family. This creates emotional connection before the scam deepens. The longer it lasts, the harder it feels to admit you've been fooled.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Escalating requests</h3>
            <p className="mt-2 text-slate-700">
              They start small ("send $500 to verify your account") then increase ("you need to invest $5,000 for the next tier"). Each small step feels manageable until you've committed significant money.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Creating false emergencies</h3>
            <p className="mt-2 text-slate-700">
              "Your account was compromised," "your taxes are in trouble," "your loved one is in danger." Panic prevents clear thinking and makes you more likely to send money without verification.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Authority impersonation</h3>
            <p className="mt-2 text-slate-700">
              Pretending to be from your bank, the IRS, law enforcement, or a government agency. They use official-sounding language and may spoof phone numbers or email addresses.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Flattery and targeting vulnerabilities</h3>
            <p className="mt-2 text-slate-700">
              "You're so smart, you'd be perfect for this investment," or targeting people who are lonely, grieving, or in financial difficulty. They identify emotional needs and exploit them.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Red Flags by Scam Type</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Investment scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Guaranteed returns regardless of market conditions</li>
              <li>High returns with "minimal risk"</li>
              <li>Pressure to invest quickly in "exclusive" opportunities</li>
              <li>Unregistered investments not listed on official financial registries</li>
              <li>Promises of secrecy or tax advantages</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Romance scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Rapid declarations of love and commitment</li>
              <li>Reluctance to video chat or meet in person</li>
              <li>Story of personal crisis requiring financial help</li>
              <li>Requests to move communication off the dating platform</li>
              <li>Asking to transfer money "for their travel" or "business emergency"</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Cryptocurrency scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Promises of huge returns through crypto trading or mining</li>
              <li>Pressure to send crypto to a "secure wallet"</li>
              <li>Fake crypto exchange interfaces that look legitimate</li>
              <li>Offers of "free" crypto in exchange for personal information</li>
              <li>Celebrity or public figure endorsements of crypto schemes</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Tech support scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Pop-up warnings claiming your device is infected</li>
              <li>Unsolicited calls saying they're from Microsoft or Apple</li>
              <li>Instructions to give them remote access to your computer</li>
              <li>Requests to purchase gift cards to "resolve" issues</li>
              <li>Fake security software installation</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Job offer scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Job offers requiring payment for "training" or "materials"</li>
              <li>Remote work opportunities with guaranteed high income</li>
              <li>Requests for personal information before an interview</li>
              <li>Job offers from companies you didn't apply to</li>
              <li>Offers to buy and resell items as part of the job</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Trust Your Instincts</h2>
          <p className="text-slate-700 leading-relaxed">
            Your gut feeling exists for a reason. If something feels off—even if you can't identify exactly why—pause and verify. Some warning signs are subtle:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li>• A person who seems perfect for you very quickly</li>
            <li>• An opportunity that arrived at exactly the right time</li>
            <li>• Communication that feels slightly unusual for the organization</li>
            <li>• Someone who avoids direct questions</li>
            <li>• Stories that shift or change slightly over time</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Verify</h2>
          <p className="text-slate-700 leading-relaxed">
            When something triggers a warning flag, here's how to verify:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Independent verification</h3>
            <p className="mt-2 text-slate-700">
              Don't use contact information the person provided. Look up the official number or website independently. Call your bank directly (using the number on your card), visit the official government website, or contact the company through their main channel.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Consult a trusted person</h3>
            <p className="mt-2 text-slate-700">
              If someone told you to keep something secret, that's a sign to tell someone. Share the situation with a trusted friend, family member, or advisor who isn't emotionally involved.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Research the claim</h3>
            <p className="mt-2 text-slate-700">
              Search for legitimate reviews, regulatory information, or complaints about the company or opportunity. Check if the investment is registered with the SEC or appropriate regulatory body.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Never pay to receive money</h3>
            <p className="mt-2 text-slate-700">
              If you have to pay anything upfront to receive a job, inheritance, lottery winnings, or investment returns, it's a scam. Legitimate situations never require payment before you receive your money.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Scammers rely on your trust, your desire to help, your financial hopes, and your fear. They're skilled at what they do. Recognizing these warning signs isn't about being suspicious of everyone—it's about being thoughtful with money, relationships, and personal information. If something triggers a red flag, pausing to verify is always the right choice.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">What's Next?</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/guides/what-to-do-if-youve-been-scammed"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">What to Do If You've Been Scammed</h3>
            <p className="mt-2 text-sm text-slate-600">Step-by-step recovery guidance and reporting resources.</p>
          </Link>

          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if a person, number, or company is known to scam.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            If you believe you've been scammed, please{" "}
            <Link href="/report" className="font-medium text-slate-900 underline underline-offset-2">
              report it to AVASC
            </Link>
            . Your information helps us identify patterns and protect others.
          </p>
        </div>
      </div>
    </div>
  );
}
