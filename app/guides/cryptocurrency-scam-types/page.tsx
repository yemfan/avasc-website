import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Common Cryptocurrency Scam Types and How to Avoid Them | AVASC",
  description:
    "Learn about pig butchering, fake exchanges, pump and dump schemes, and cryptocurrency investment fraud. Protect your crypto assets.",
  openGraph: {
    title: "Common Cryptocurrency Scam Types and How to Avoid Them | AVASC",
    description:
      "Learn about pig butchering, fake exchanges, pump and dump schemes, and cryptocurrency investment fraud. Protect your crypto assets.",
    type: "article",
    url: "https://avasc.org/guides/cryptocurrency-scam-types",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/cryptocurrency-scam-types",
  },
};

export default function CryptoScamPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Common Cryptocurrency Scam Types and How to Avoid Them",
    description:
      "Learn about pig butchering, fake exchanges, pump and dump schemes, and cryptocurrency investment fraud.",
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
        name: "Cryptocurrency Scam Types",
        item: "https://avasc.org/guides/cryptocurrency-scam-types",
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
          Common Cryptocurrency Scam Types and How to Avoid Them
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Cryptocurrency fraud is sophisticated, fast-moving, and often irreversible. Understanding the tactics—and how they differ from legitimate crypto—is essential for protecting your assets.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Why Cryptocurrencies Are Targeted by Scammers</h2>
          <p className="text-slate-700 leading-relaxed">
            Cryptocurrencies have become primary targets for fraud because they offer scammers significant advantages:
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• <span className="font-medium">Irreversible transfers:</span> Unlike credit cards or bank transfers, crypto transactions can't be reversed or disputed.</li>
            <li>• <span className="font-medium">Pseudonymity:</span> Transactions are difficult to trace, making it hard to identify or recover from scammers.</li>
            <li>• <span className="font-medium">No regulatory oversight:</span> Crypto is less regulated than traditional finance, giving scammers more room to operate.</li>
            <li>• <span className="font-medium">Global reach:</span> A scammer in one country can easily target victims worldwide.</li>
            <li>• <span className="font-medium">Speed:</span> Transactions happen in minutes, giving victims no time to pause and verify.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Pig Butchering (The Most Sophisticated Crypto Scam)</h2>
          <p className="text-slate-700 leading-relaxed">
            "Pig butchering" is an elaborate, long-game scam that can last weeks or months. The name refers to the process: raising a pig (building trust with the victim) then slaughtering it (stealing all their money).
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How it works</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-700">
              <li><span className="font-medium">Initial contact:</span> Scammer reaches out via dating app, text, or social media, posing as an attractive person interested in dating or friendship.</li>
              <li><span className="font-medium">Trust building:</span> Over weeks, they build emotional connection, sharing personal stories and showing genuine interest in your life.</li>
              <li><span className="font-medium">Investment introduction:</span> They mention their "side business" of cryptocurrency trading or investment. They may show fabricated returns or profits.</li>
              <li><span className="font-medium">Invitation:</span> They ask you to join the investment opportunity, offering to help or guide you through the process.</li>
              <li><span className="font-medium">Deposit phase:</span> You're directed to a fake cryptocurrency exchange or trading platform. You deposit money, which scammers accept.</li>
              <li><span className="font-medium">False growth:</span> The platform shows fake returns on your investment. Your balance grows in the app, but it's all fabricated.</li>
              <li><span className="font-medium">The slaughter:</span> When you try to withdraw funds, you're told you need to pay fees, taxes, or make a larger deposit to "unlock" your returns. When you refuse, you realize the money is gone.</li>
            </ol>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">Warning signs of pig butchering</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>Someone you met romantically suddenly mentions crypto investments</li>
              <li>Offers to help you invest or guides you to a platform</li>
              <li>Shows you screenshots of large profits from small deposits</li>
              <li>Platform shows growing balance but you can't withdraw</li>
              <li>They pressure you to deposit more to "unlock" returns</li>
              <li>They claim fees or taxes are preventing your withdrawal</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Fake Cryptocurrency Exchanges</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers create fake websites and apps that look nearly identical to legitimate exchanges. They're designed to steal your money or credentials.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">What they look like</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Professional-looking websites with branding similar to real exchanges</li>
              <li>Apps that mimic Coinbase, Kraken, Binance, or other legitimate platforms</li>
              <li>Slightly different URLs (coibase.com instead of coinbase.com)</li>
              <li>Charts showing fake market data and prices</li>
              <li>Login screens that steal your credentials</li>
              <li>Deposit functions that accept crypto but never reflect in your account</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to verify an exchange is real</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Always type the URL directly into your browser; never click links from emails, texts, or messages</li>
              <li>Check that the URL matches exactly (Coinbase is coinbase.com, not coibase.com)</li>
              <li>Verify the domain has an SSL certificate (look for the padlock icon)</li>
              <li>Download apps directly from the official app store, not from links in messages</li>
              <li>Look up the exchange's official support contact and call them to verify</li>
              <li>Check if the exchange is registered and regulated in your jurisdiction</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Pump and Dump Schemes</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers promote obscure or newly created cryptocurrencies to drive up the price (pump), then sell their holdings for profit (dump), leaving regular investors with worthless coins.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How pump and dump works</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-700">
              <li><span className="font-medium">Promotion:</span> Scammers promote a worthless coin on social media, crypto forums, or Discord communities. They may pose as insiders, developers, or influencers.</li>
              <li><span className="font-medium">The pump:</span> New investors buy the coin based on hype, driving the price up dramatically.</li>
              <li><span className="font-medium">The dump:</span> The original scammers sell their coins at the inflated price, crashing the value.</li>
              <li><span className="font-medium">The collapse:</span> Late-arriving investors are left holding coins worth a fraction of what they paid.</li>
            </ol>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">Red flags for pump and dump</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>Promises of "guaranteed" returns from a new coin</li>
              <li>Pressure to invest quickly before the price rises further</li>
              <li>Celebrity or influencer endorsements (often fake)</li>
              <li>Coin suddenly appears in private groups or Discord chats</li>
              <li>"Insider information" about upcoming developments</li>
              <li>Coin with no clear use case or technology</li>
              <li>Rapid, unsustainable price increases</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Phishing and Wallet Theft</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers use phishing emails, fake websites, and malware to steal your crypto wallet credentials or recovery phrases.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common phishing tactics</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Fake emails from Coinbase, MetaMask, or Ledger asking you to "verify" your account</li>
              <li>Links to fake wallet sites that steal your seed phrase or private key</li>
              <li>USB drives or downloads containing malware that monitors your wallet</li>
              <li>Social engineering to trick you into revealing recovery phrases</li>
              <li>Fake wallet apps that steal your credentials when you log in</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to protect your wallet</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Never share your seed phrase (recovery phrase) with anyone, ever</li>
              <li>Never enter your seed phrase on any website, even if it looks official</li>
              <li>Use hardware wallets (Ledger, Trezor) for large amounts of crypto</li>
              <li>Enable all security features on your wallet (2FA, biometric lock)</li>
              <li>Only download wallets from official app stores or websites</li>
              <li>Never click links in emails about your wallet—go to the official site directly</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Fake Investment Platforms and "Trading Bots"</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers promise to grow your crypto through automated trading, AI bots, or exclusive investment programs. The platform accepts deposits but the "trading" is fictitious.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Red flags for fake investment platforms</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Guaranteed or unrealistic returns (20%, 50%, 100%+ per month)</li>
              <li>Pressure to invest large amounts quickly</li>
              <li>Minimal or vague information about how the platform works</li>
              <li>Fake testimonials from "traders" showing large profits</li>
              <li>Requests to recruit others (pyramid structure)</li>
              <li>Difficulty withdrawing funds or excessive withdrawal requirements</li>
              <li>No regulatory oversight or licensing information</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">What legitimate crypto investment looks like</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Clear, realistic returns (2-5% annually is more realistic)</li>
              <li>Transparent about fees and costs</li>
              <li>Regulated by financial authorities</li>
              <li>Easy withdrawal of funds</li>
              <li>Conservative marketing without pressure</li>
              <li>Clear explanation of how returns are generated</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">NFT and Metaverse Scams</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers create fake NFTs or metaverse projects that are worthless or stolen artwork. Victims often lose significant amounts paying for assets that have no value.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common NFT scam tactics</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Fake "collection drops" with copied artwork or stolen images</li>
              <li>Stealing NFTs directly from wallets using malicious smart contracts</li>
              <li>Impersonating legitimate projects (fake Discord or Twitter)</li>
              <li>Rug pulls: new projects that take investors' money and disappear</li>
              <li>Fake metaverse land with no actual utility or value</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Essential Crypto Security Practices</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Never invest in anything you don't understand</h3>
            <p className="mt-2 text-slate-700">
              If you can't explain how an investment makes money, or the explanation doesn't make sense, it's likely a scam. Take time to research before investing.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use established, regulated platforms</h3>
            <p className="mt-2 text-slate-700">
              For buying and trading crypto, use major exchanges like Coinbase, Kraken, or Gemini that are registered with financial regulators. For holding crypto, use established wallets like MetaMask, Ledger, or hardware wallets.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Be skeptical of "opportunities"</h3>
            <p className="mt-2 text-slate-700">
              If someone is actively recruiting you into an investment or platform, especially through personal connections, it's likely a scam. Legitimate investments don't rely on recruitment.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Keep your private keys private</h3>
            <p className="mt-2 text-slate-700">
              Your private keys and seed phrases are like passwords to your bank account. Never share them with anyone, type them online, or enter them on websites.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Start small, verify everything</h3>
            <p className="mt-2 text-slate-700">
              If you're testing a new platform or investment, start with a small amount you can afford to lose. Verify that withdrawals work before depositing more.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Enable two-factor authentication (2FA)</h3>
            <p className="mt-2 text-slate-700">
              On all cryptocurrency platforms and wallets, enable 2FA using an authenticator app (not SMS when possible, as SMS can be compromised).
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">If You've Lost Crypto to a Scam</h2>
          <p className="mt-3 text-amber-950/90">
            Unfortunately, cryptocurrency transactions are typically irreversible. However, you should still report the scam to law enforcement and AVASC. Documenting the fraud helps authorities identify patterns and protect others. Some specialized recovery services may be able to assist with certain types of theft, but be careful—many "recovery services" are themselves scams.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Next Steps</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if a crypto platform, person, or address is known to scam.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a Crypto Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Document your experience and help protect other crypto users.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            If you've lost money to a cryptocurrency scam, visit our{" "}
            <Link href="/recovery" className="font-medium text-slate-900 underline underline-offset-2">
              recovery resources
            </Link>{" "}
            for guidance on next steps.
          </p>
        </div>
      </div>
    </div>
  );
}
