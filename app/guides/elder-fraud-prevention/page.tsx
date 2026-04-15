import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Elder Fraud Prevention: Protecting Seniors from Scams | AVASC",
  description:
    "Learn about scams targeting seniors, tech support fraud, Medicare fraud, the grandparent scam, and safeguards for protecting older adults.",
  openGraph: {
    title: "Elder Fraud Prevention: Protecting Seniors from Scams | AVASC",
    description:
      "Learn about scams targeting seniors, tech support fraud, Medicare fraud, the grandparent scam, and safeguards for protecting older adults.",
    type: "article",
    url: "https://avasc.org/guides/elder-fraud-prevention",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/elder-fraud-prevention",
  },
};

export default function ElderFraudPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Elder Fraud Prevention: Protecting Seniors from Scams",
    description:
      "Learn about scams targeting seniors, tech support fraud, Medicare fraud, the grandparent scam, and safeguards for protecting older adults.",
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
        name: "Elder Fraud Prevention",
        item: "https://avasc.org/guides/elder-fraud-prevention",
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
          Elder Fraud Prevention: Protecting Seniors from Scams
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Older adults are disproportionately targeted by scammers. Whether you're a senior yourself or protecting an aging parent, understanding these scams is essential for safeguarding finances and wellbeing.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Why Seniors Are Targeted</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers specifically target older adults for several reasons:
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• <span className="font-medium">Accumulated wealth:</span> Seniors often have savings, retirement accounts, and home equity.</li>
            <li>• <span className="font-medium">Social politeness:</span> Older generations were raised to be trusting and to respect authority, making them less likely to question or hang up on suspicious callers.</li>
            <li>• <span className="font-medium">Cognitive changes:</span> Memory issues, difficulty with technology, or hearing loss can make some seniors more vulnerable to manipulation.</li>
            <li>• <span className="font-medium">Isolation:</span> Lonely seniors may be more susceptible to relationship-building scams (romance scams, fake grandchild calls).</li>
            <li>• <span className="font-medium">Lower reporting:</span> Seniors may feel embarrassed and not report scams, making it harder for law enforcement to track patterns.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common Scams Targeting Seniors</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The Grandparent Scam</h3>
            <p className="mt-2 text-slate-700">
              A scammer calls pretending to be a grandchild in crisis. "Grandma, it's me. I've been arrested/in an accident/need money for school. I need $5,000 by tonight. Don't tell mom and dad—I'm embarrassed."
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">Red flags:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Pressure not to tell family members</li>
                <li>Requests for immediate payment</li>
                <li>Emotional manipulation or crisis language</li>
                <li>Caller asks not to verify with grandchild's parent</li>
                <li>Payment requested via wire transfer, gift card, or cryptocurrency</li>
              </ul>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">How to prevent:</p>
            <p className="mt-1 text-sm text-slate-600">
              Have a family code word. If someone calls claiming to be a grandchild, ask for the code word before sending money. Verify through other family members before sending any money.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Tech Support Scams</h3>
            <p className="mt-2 text-slate-700">
              Pop-ups appear on the screen claiming the computer has a virus or security problem. A number to call appears. When the senior calls, scammers claim to be from Microsoft, Apple, or another tech company and request remote access to "fix" the problem.
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">Red flags:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Pop-ups claiming immediate security threats</li>
                <li>Phone numbers in pop-ups or emails</li>
                <li>Requests for remote access or payment</li>
                <li>Caller claims to be from Microsoft/Apple (these companies don't call)</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">IRS / Tax Scams</h3>
            <p className="mt-2 text-slate-700">
              Phone calls or emails claiming to be from the IRS threatening legal action, arrest, or liens unless immediate payment is made. Often targets seniors around tax time.
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">Red flags:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Claims of unpaid taxes or penalties</li>
                <li>Threat of arrest or legal action</li>
                <li>Demands for immediate payment</li>
                <li>Requests for gift cards or wire transfers</li>
                <li>IRS will NEVER call you; they send letters</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Medicare / Health Insurance Fraud</h3>
            <p className="mt-2 text-slate-700">
              Calls or letters claiming to be from Medicare or health insurance asking to "verify" Social Security numbers or Medicare numbers, claiming errors in records, or offering special health services.
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">Red flags:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Requests for personal health information</li>
                <li>Claims of issues with Medicare or insurance coverage</li>
                <li>Offers of free health services or equipment</li>
                <li>Medicare won't call asking for personal information</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Lottery / Prize Scams</h3>
            <p className="mt-2 text-slate-700">
              Notifications that the person has won a lottery they didn't enter or a prize, but must pay taxes or fees to claim it.
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">Red flags:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Winning a lottery you didn't enter</li>
                <li>Requirement to pay "taxes" or "fees" first</li>
                <li>Legitimate lotteries don't require upfront payment</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Romance Scams</h3>
            <p className="mt-2 text-slate-700">
              A lonely senior meets someone online who quickly becomes romantic and then requests money for an emergency, travel, or investment opportunity. These can target isolated seniors of any age.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Home / Charity Repair Scams</h3>
            <p className="mt-2 text-slate-700">
              Door-to-door solicitors claiming to offer discounted home repairs or work for charities, then disappearing after payment or doing substandard work.
            </p>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="font-medium">Red flags:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Unsolicited door-to-door offers</li>
                <li>Pressure to sign contracts immediately</li>
                <li>Requests for cash or upfront deposits</li>
                <li>Legitimate contractors have references and licenses you can verify</li>
              </ul>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Protect Seniors</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Have open conversations about scams</h3>
            <p className="mt-2 text-slate-700">
              Talk to older family members about common scams. Approach the conversation with respect—many seniors don't appreciate being talked down to. Frame it as "these are tricks that fool even smart people."
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Establish a "verification code"</h3>
            <p className="mt-2 text-slate-700">
              Create a family code word that grandchildren, close friends, and trusted people use when calling in an emergency. If someone calls claiming to be a grandchild without using the code, it's likely a scam.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Create a "do not call" list</h3>
            <p className="mt-2 text-slate-700">
              Register phone numbers on the National Do Not Call Registry (donotcall.gov). While not perfect, it reduces unwanted sales calls that are often fronts for scams.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Help with financial oversight</h3>
            <p className="mt-2 text-slate-700">
              If appropriate, offer to help review financial accounts, check bank statements, and monitor for unusual transactions. Watch for large unexpected transfers or wire transfers to unknown people.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use scam alert apps and services</h3>
            <p className="mt-2 text-slate-700">
              Apps like RoboKiller or Nomorobo can block many scam calls. Many phone companies offer call screening services. Consider setting up a feature that requires unknown callers to identify themselves.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Keep contact information current</h3>
            <p className="mt-2 text-slate-700">
              Ensure seniors have direct contact numbers for family members so they can verify information if someone calls claiming to be a relative. A simple callback to a known number can prevent the grandparent scam.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Help with technology security</h3>
            <p className="mt-2 text-slate-700">
              Help seniors update software, use password managers, and understand email verification. Tech support scams thrive on seniors' uncertainty with technology.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Legal Safeguards for Elder Protection</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Power of Attorney</h3>
            <p className="mt-2 text-slate-700">
              A legal document granting someone trusted (usually a family member) authority to manage financial or healthcare decisions. This allows a trusted person to monitor accounts and prevent scams. Should be set up while the senior is mentally competent.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Guardianship or Conservatorship</h3>
            <p className="mt-2 text-slate-700">
              A court-appointed arrangement where a guardian manages the legal and financial affairs of someone who can no longer manage their own. Used when someone is cognitively impaired. More restrictive and requires court involvement.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Joint accounts</h3>
            <p className="mt-2 text-slate-700">
              Adding a trusted family member as a joint account holder allows oversight of spending and transactions, and prevents scammers from easily draining accounts. Discuss the implications carefully, as it affects both parties' assets.
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">Important: Financial safeguards require honest family involvement</h3>
            <p className="mt-3 text-red-950/90">
              While these tools protect from external scammers, unfortunately elder fraud is sometimes committed by family members. Safeguards should include oversight from multiple family members or trusted advisors when possible.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">If a Senior Has Been Scammed</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Take emotional support seriously</h3>
            <p className="mt-2 text-slate-700">
              Seniors often experience profound shame and embarrassment after being scammed. Reassure them that they're not alone and that intelligent people get scammed. Don't express anger or blame—they're already suffering.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report immediately</h3>
            <p className="mt-2 text-slate-700">
              The faster you report, the better chance of recovering funds or preventing further loss. Report to:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>The senior's bank or financial institution</li>
              <li>Local police (get a case number)</li>
              <li>FBI Internet Crime Complaint Center (ic3.gov)</li>
              <li>Federal Trade Commission (reportfraud.ftc.gov)</li>
              <li>AVASC (avasc.org)</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor for follow-up scams</h3>
            <p className="mt-2 text-slate-700">
              Scammers sometimes sell lead lists to other scammers. The senior may receive increased scam attempts. Warn them about this and increase monitoring.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Seek professional help if needed</h3>
            <p className="mt-2 text-slate-700">
              A therapist or counselor can help process trauma. Many seniors experience depression or anxiety after being scammed. Professional support is valuable.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway: Prevention and Trust</h2>
          <p className="mt-3 text-amber-950/90">
            Protecting seniors from scams requires balance. You want to help protect them from fraud without infantilizing them or damaging family relationships. Open communication, specific safeguards (like code words), and respectful oversight are more effective than control. Build trust with older family members about sharing concerns, and maintain that trust by involving them in protection decisions.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Resources and Support</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report Elder Fraud</h3>
            <p className="mt-2 text-sm text-slate-600">Document and report scams targeting seniors.</p>
          </Link>

          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Recovery Resources</h3>
            <p className="mt-2 text-sm text-slate-600">Guidance for seniors or families recovering from fraud.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <p className="text-sm font-medium text-slate-900">Additional resources:</p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• National Adult Protective Services Association: www.napsa-now.org</li>
            <li>• Eldercare Locator: www.eldercare.acl.gov (find local elder services)</li>
            <li>• Consumer Financial Protection Bureau Senior Resources: www.consumerfinance.gov</li>
            <li>• National Center on Elder Abuse: ncea.acl.gov</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
