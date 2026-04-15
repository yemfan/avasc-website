import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Investment Scam Red Flags: How to Spot Fraudulent Schemes | AVASC",
  description:
    "Learn to identify Ponzi schemes, unregistered investments, pressure-based tactics, and guaranteed return promises. Protect your money from investment fraud.",
  openGraph: {
    title: "Investment Scam Red Flags: How to Spot Fraudulent Schemes | AVASC",
    description:
      "Learn to identify Ponzi schemes, unregistered investments, pressure-based tactics, and guaranteed return promises. Protect your money from investment fraud.",
    type: "article",
    url: "https://avasc.org/guides/investment-scam-red-flags",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/investment-scam-red-flags",
  },
};

export default function InvestmentScamPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Investment Scam Red Flags: How to Spot Fraudulent Schemes",
    description:
      "Learn to identify Ponzi schemes, unregistered investments, pressure-based tactics, and guaranteed return promises.",
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
        name: "Investment Scam Red Flags",
        item: "https://avasc.org/guides/investment-scam-red-flags",
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
          Investment Scam Red Flags: How to Spot Fraudulent Schemes
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Investment scams prey on your desire to build wealth. Scammers promise returns that seem too good to resist, create false urgency, and use sophisticated deception. Learning to spot these schemes is your best defense.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Universal Red Flags</h2>
          <p className="text-slate-700 leading-relaxed">
            These warning signs appear across nearly every investment scam:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Guaranteed returns</h3>
            <p className="mt-2 text-slate-700">
              "Guaranteed 10% monthly returns," "You can't lose money," or "We've never had a losing year." No legitimate investment can guarantee returns. Markets fluctuate, and all investments carry risk.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unrealistic returns</h3>
            <p className="mt-2 text-slate-700">
              Returns of 20%, 50%, or 100%+ per year. For context, the S&P 500 averages about 10% annually. If an investment promises to consistently beat the market by 5-10x, something is wrong.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Pressure to invest quickly</h3>
            <p className="mt-2 text-slate-700">
              "Limited spots available," "Closing to new investors next week," "You need to decide today." Legitimate investments don't require immediate decisions. This artificial urgency prevents you from thinking clearly.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Vague explanations of how it works</h3>
            <p className="mt-2 text-slate-700">
              When you ask how the investment generates returns, you get unclear answers, jargon, or promises to explain later. Legitimate investments have clear, understandable mechanics.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unregistered investments</h3>
            <p className="mt-2 text-slate-700">
              Before investing, verify the company and investment are registered with the SEC (sec.gov) or FINRA (finra.org). Scammers often operate unregistered investments specifically to avoid regulatory oversight.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Difficulty getting documentation</h3>
            <p className="mt-2 text-slate-700">
              You ask for written materials, prospectuses, or financial statements, but they're not available or are vague. Real investments have clear, comprehensive documentation.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Pressure to recruit others</h3>
            <p className="mt-2 text-slate-700">
              You're encouraged to bring friends or family into the investment, often with promises of commission or returns. This is a hallmark of pyramid schemes and multi-level marketing fraud.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">No clear conflict of interest disclosures</h3>
            <p className="mt-2 text-slate-700">
              The person promoting the investment doesn't disclose how they benefit from your investment. Real financial advisors clearly explain fees and conflicts of interest.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Specific Types of Investment Scams</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Ponzi Schemes</h3>
            <p className="mt-2 text-slate-700">
              The most famous investment scam structure. Early investors receive their promised returns using money from new investors, not from actual investment profits. Eventually, there aren't enough new investors, the scheme collapses, and most people lose money.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">Warning signs:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Consistent returns regardless of market conditions</li>
                <li>Small, steady profits (not large ones that attract scrutiny)</li>
                <li>Emphasis on recruiting new members</li>
                <li>Limited transparency about actual investments</li>
                <li>Difficulty withdrawing funds without investing more</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Affinity Scams</h3>
            <p className="mt-2 text-slate-700">
              Scammers target specific communities (religious groups, ethnic groups, professional associations) because people are more trusting within their community.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">Warning signs:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Investment is promoted through your church, club, or association</li>
                <li>Shared religious or cultural identity used to build trust</li>
                <li>Testimonials from people you know and trust (who may be deceived too)</li>
                <li>Promises that returns will benefit your community</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Pump and Dump (Penny Stock Scams)</h3>
            <p className="mt-2 text-slate-700">
              Scammers promote obscure, low-price stocks ("penny stocks") with false information, driving up the price. Once the price rises, they sell their shares at a profit, crashing the value and leaving regular investors with losses.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">Warning signs:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Unsolicited emails or calls promoting a "hot stock"</li>
                <li>Stock is little-known with minimal trading history</li>
                <li>Unrealistic promises about potential gains</li>
                <li>Pressure to buy before the price rises</li>
                <li>Stock suddenly becomes hard to sell</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Forex and Binary Options Scams</h3>
            <p className="mt-2 text-slate-700">
              Scammers promise profits from currency trading (forex) or binary options (predicting if an asset price will go up or down). Most people lose money, and the platforms are often fraudulent.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">Warning signs:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Claims of "high probability" or guaranteed profits</li>
                <li>Exotic investment terminology designed to confuse</li>
                <li>Aggressive marketing and recruitment pressure</li>
                <li>Platform withdrawal issues or refusal to return funds</li>
                <li>Unregistered brokers or platforms</li>
              </ul>
            </div>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Real Estate Investment Scams</h3>
            <p className="mt-2 text-slate-700">
              Scammers sell partnerships in real estate deals or promise returns from property flipping or rentals. The properties don't exist or the returns never materialize.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium">Warning signs:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Deals promising unusually high rental yields</li>
                <li>Overseas property "opportunities" you can't easily verify</li>
                <li>Difficulty getting property documents or viewing the property</li>
                <li>Pressure to invest quickly or risk losing the deal</li>
                <li>Promised returns don't match market reality</li>
              </ul>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Questions to Ask Before Investing</h2>
          <p className="text-slate-700 leading-relaxed">
            These are critical questions that legitimate investments can answer clearly:
          </p>

          <ul className="space-y-3 text-slate-700">
            <li>
              <span className="font-medium">How exactly does this investment make money?</span> Be able to explain it in simple terms. If you can't understand it, you shouldn't invest in it.
            </li>
            <li>
              <span className="font-medium">Is the investment registered with the SEC or FINRA?</span> Check finra.org or sec.gov. Legitimate investments are registered.
            </li>
            <li>
              <span className="font-medium">Who is managing the money, and are they credentialed?</span> Verify their licenses and background. Check FINRA's BrokerCheck.
            </li>
            <li>
              <span className="font-medium">What are all the fees?</span> Legitimate advisors disclose all fees clearly. Hidden fees are a red flag.
            </li>
            <li>
              <span className="font-medium">What are the historical returns?</span> Ask for audited financial statements, not testimonials. Real returns are documented.
            </li>
            <li>
              <span className="font-medium">Can I easily withdraw my money?</span> If there are long lockup periods or restrictions, understand why. Be skeptical of investments that make withdrawal difficult.
            </li>
            <li>
              <span className="font-medium">What are the risks?</span> Legitimate investments clearly outline potential losses. Anyone saying there's no risk is lying.
            </li>
            <li>
              <span className="font-medium">Can I get this in writing?</span> Legitimate investments provide prospectuses and written agreements. Verbal promises alone are not sufficient.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Verify Investment Companies</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check FINRA BrokerCheck</h3>
            <p className="mt-2 text-slate-700">
              Go to brokercheck.finra.org and search for the advisor or broker. This shows their registration, credentials, disciplinary history, and any complaints. Avoid anyone not registered or with disciplinary records.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check SEC EDGAR database</h3>
            <p className="mt-2 text-slate-700">
              Visit sec.gov and search the EDGAR database for the company's filings. Legitimate public companies file regular reports. Private companies offering investments should have disclosure documents available.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify business addresses</h3>
            <p className="mt-2 text-slate-700">
              Look up the company's physical address. Be suspicious of virtual offices, mail drops, or addresses that don't match their online presence. Call the main office independently to verify.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Research online reviews and complaints</h3>
            <p className="mt-2 text-slate-700">
              Search the company name on complaint databases like the Better Business Bureau, state attorney generals' offices, and online reviews. Look for patterns of complaints.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Talk to an independent financial advisor</h3>
            <p className="mt-2 text-slate-700">
              Before investing, discuss the opportunity with a fee-only financial advisor who has no stake in whether you invest. They can review the offer and give you professional perspective.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Special Consideration: High-Pressure Sales Tactics</h2>
          <p className="text-slate-700 leading-relaxed">
            Investment scammers use specific pressure tactics to overcome your hesitation:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Creating fear of missing out (FOMO)</h3>
            <p className="mt-2 text-slate-700">
              "This opportunity is closing," "Only 5 spots left," "I can only hold this price for 48 hours." These artificial deadlines prevent thoughtful decision-making. Real investments don't disappear overnight.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Social proof manipulation</h3>
            <p className="mt-2 text-slate-700">
              "Everyone's investing in this," "My clients have made 50% returns," or testimonials from people claiming success. These may be fabricated or reflect only successful investors (not the many who lost money).
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Exclusivity</h3>
            <p className="mt-2 text-slate-700">
              "This is only available to select investors," "I'm showing you this because I like you," "This isn't open to the public." Making something seem exclusive makes you feel special and important.
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">The best response to pressure: Always take time to think</h3>
            <p className="mt-3 text-red-950/90">
              If someone pressures you to decide immediately, that's a red flag. Legitimate investments will still be available tomorrow. Take time to research, ask questions, and sleep on the decision. If the pressure increases, that's confirmation it's likely a scam.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            If an investment opportunity triggers any of these red flags, walk away. There are countless legitimate, safe investments available through established brokers and financial advisors. You don't need exotic opportunities with unrealistic returns. Your financial security is more important than the fear of missing out.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Report and Protect Others</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if an investment or company is known to scam.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report Investment Fraud</h3>
            <p className="mt-2 text-sm text-slate-600">Document your experience and help protect other investors.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            If you've lost money to an investment scam, visit our{" "}
            <Link href="/recovery" className="font-medium text-slate-900 underline underline-offset-2">
              recovery resources
            </Link>{" "}
            for guidance on reporting to authorities and potential recovery options.
          </p>
        </div>
      </div>
    </div>
  );
}
