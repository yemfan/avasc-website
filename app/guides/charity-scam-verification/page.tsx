import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How to Verify a Charity and Avoid Donation Scams | AVASC",
  description:
    "Learn to identify fake charities, verify 501(c)(3) status, check Charity Navigator, and avoid being scammed by fraudulent organizations after disasters.",
  openGraph: {
    title: "How to Verify a Charity and Avoid Donation Scams | AVASC",
    description:
      "Learn to identify fake charities and verify legitimate organizations before donating.",
    type: "article",
    url: "https://avasc.org/guides/charity-scam-verification",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/charity-scam-verification",
  },
};

export default function CharityScamVerificationPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Verify a Charity and Avoid Donation Scams",
    description:
      "Learn to identify legitimate charities and avoid fraudulent organizations.",
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
        name: "Charity Scam Verification",
        item: "https://avasc.org/guides/charity-scam-verification",
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
          How to Verify a Charity and Avoid Donation Scams
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Charitable giving is meaningful—when your money actually helps people. Scammers exploit generosity by creating fake charities, especially after disasters when people want to help quickly. Learning to verify charities ensures your donations reach people who need them.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common Charity Scams</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake charities with similar names</h3>
            <p className="mt-2 text-slate-700">
              Scammers create organizations with names nearly identical to legitimate ones: "American Heart Association" becomes "American Heart Fund," or "Red Cross" becomes "National Red Cross." Donors think they're supporting a well-known organization but are actually funding scammers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Disaster relief scams</h3>
            <p className="mt-2 text-slate-700">
              After hurricanes, earthquakes, wildfires, or other disasters, scammers create fake charities claiming to help victims. Emotional appeals and urgency lead people to donate quickly without verifying the organization's legitimacy.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Cold-calling charities</h3>
            <p className="mt-2 text-slate-700">
              Someone calls requesting donations for a "charity" with a similar name to a well-known organization. Legitimate charities rarely cold-call for donations. These calls are scams designed to collect credit card information or bank details.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Email phishing from fake charities</h3>
            <p className="mt-2 text-slate-700">
              Phishing emails appear to be from legitimate charities requesting donations or asking you to verify donation information. Links lead to fake websites that steal personal and financial information.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Crowdfunding scams</h3>
            <p className="mt-2 text-slate-700">
              Fake fundraisers on platforms like GoFundMe claim to help individuals or causes. The scammer collects money and disappears, leaving supporters with no way to verify the funds helped anyone.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Charity pressure tactics</h3>
            <p className="mt-2 text-slate-700">
              Scammers use high-pressure sales tactics: "Donate now to help us meet our goal today," "This is our last chance to help," or "Your donation needs to be matched." This artificial urgency prevents you from verifying the charity's legitimacy.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Verify a Charity</h2>
          <p className="text-slate-700 leading-relaxed">
            Before donating, take a few minutes to verify the charity is legitimate:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check 501(c)(3) status</h3>
            <p className="mt-2 text-slate-700">
              Legitimate charities are recognized by the IRS as 501(c)(3) nonprofits. Search the IRS Tax Exempt Organization Search at irs.gov or the Charity Check tool. Verify the exact legal name of the organization and confirm it matches the charity contacting you.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use Charity Navigator</h3>
            <p className="mt-2 text-slate-700">
              Charity Navigator (charitynavigator.org) rates charities on financial health and accountability. Look for organizations with high ratings and transparency. The site also flags problematic charities and scams.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check with the Better Business Bureau</h3>
            <p className="mt-2 text-slate-700">
              The BBB Wise Giving Alliance (give.org) has information on thousands of charities, including their financial practices and governance. They rate charities as "accredited" or flag those with concerns.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Search for independent reviews</h3>
            <p className="mt-2 text-slate-700">
              Search the charity's name on Google along with "reviews," "scam," or "complaints." Read what others say. Check sites like Trustpilot, Glassdoor (if they have employees), and news coverage.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify direct contact</h3>
            <p className="mt-2 text-slate-700">
              Don't call a number provided in an unsolicited call or email. Look up the charity's official website independently and find contact information there. Call them to verify they're fundraising and ask about their programs.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check financial accountability</h3>
            <p className="mt-2 text-slate-700">
              Legitimate charities publish annual reports showing where money comes from and how it's spent. Look for charities that spend 75%+ on programs (not administrative costs). Transparency is a sign of legitimacy.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify the website</h3>
            <p className="mt-2 text-slate-700">
              Check the domain name carefully. Fake charities use slightly misspelled domains or similar names. Look for secure websites (https://), professional design, and clear contact information. Scam sites often have outdated design or poor grammar.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Red Flags for Fake Charities</h2>

          <ul className="space-y-2 text-slate-700">
            <li>• Pressure to donate immediately or make large donations</li>
            <li>• No clear explanation of how money will be used</li>
            <li>• High-pressure telemarketing or unsolicited calls/emails</li>
            <li>• Names similar to well-known charities but not identical</li>
            <li>• Guarantees of tax benefits or returns on donations</li>
            <li>• Requests to donate via wire transfer, cryptocurrency, or gift cards</li>
            <li>• No physical address or contact information available</li>
            <li>• Unwilling to provide financial statements or reports</li>
            <li>• Vague mission or goals</li>
            <li>• Claims that all donations go directly to recipients (legitimate charities have overhead)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Safe Donation Practices</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Donate through established platforms</h3>
            <p className="mt-2 text-slate-700">
              Use trusted fundraising platforms (GiveWell, GlobalGiving, Network for Good) that vet charities. Your donation goes through a verified channel, reducing fraud risk.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use credit cards or payment services</h3>
            <p className="mt-2 text-slate-700">
              Donate with a credit card or through services like PayPal, which offer fraud protection. Avoid wire transfers, bank transfers, or cash, which are irreversible.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Keep donation records</h3>
            <p className="mt-2 text-slate-700">
              Save donation confirmations, receipts, and thank-you letters. These help verify the charity's legitimacy and are valuable for tax deductions.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify tax-deductibility</h3>
            <p className="mt-2 text-slate-700">
              Only donations to recognized 501(c)(3) charities are tax-deductible. If you're concerned, verify the organization's status with the IRS before donating.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Be cautious after disasters</h3>
            <p className="mt-2 text-slate-700">
              After major disasters, scammers create fake relief organizations. Wait a day or two and donate to established charities with proven disaster response records (Red Cross, Salvation Army, established local organizations).
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You've Donated to a Fake Charity</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Stop further donations</h3>
            <p className="mt-2 text-slate-700">
              Cancel any recurring donations immediately. Contact your bank or credit card company and request they block future transactions to that organization.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Dispute the charge</h3>
            <p className="mt-2 text-slate-700">
              Contact your credit card company or bank and report the fraudulent donation. Explain that you donated to what you believed was a legitimate charity. Many will reverse the charge.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to authorities</h3>
            <p className="mt-2 text-slate-700">
              Report the fake charity to the FTC (reportfraud.ftc.gov), your state's attorney general, and the BBB. These agencies investigate charity fraud and can shut down fraudulent organizations.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor your accounts</h3>
            <p className="mt-2 text-slate-700">
              Watch your credit card and bank statements for unauthorized charges. If you provided banking information, monitor accounts closely for fraud.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Generous giving is a virtue, but scammers exploit that generosity. Taking a few minutes to verify a charity before donating ensures your money actually helps people. Legitimate charities are transparent, verifiable, and never use high-pressure tactics. When in doubt, donate to established organizations you know and trust.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">What's Next?</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/donate"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Support AVASC</h3>
            <p className="mt-2 text-sm text-slate-600">Donate to a verified anti-scam nonprofit to help others avoid fraud.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report Charity Fraud</h3>
            <p className="mt-2 text-sm text-slate-600">Report fake charities to help protect other donors.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Want to verify where legitimate charities get their funding? Check Charity Navigator, GiveWell, or the BBB Wise Giving Alliance for detailed financial reports.
          </p>
        </div>
      </div>
    </div>
  );
}
