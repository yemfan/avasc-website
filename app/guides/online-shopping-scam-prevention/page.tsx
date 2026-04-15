import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Online Shopping Scam Prevention: How to Shop Safely Online | AVASC",
  description:
    "Learn to identify fake websites, counterfeit products, and unsafe payment methods. Shop safely with tips for verifying sellers and protecting your financial information.",
  openGraph: {
    title: "Online Shopping Scam Prevention: How to Shop Safely Online | AVASC",
    description:
      "Learn to identify fake websites, counterfeit products, and unsafe payment methods. Shop safely with tips for verifying sellers and protecting your financial information.",
    type: "article",
    url: "https://avasc.org/guides/online-shopping-scam-prevention",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/online-shopping-scam-prevention",
  },
};

export default function OnlineShoppingScamPreventionPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Online Shopping Scam Prevention: How to Shop Safely Online",
    description:
      "Learn to identify fake websites, counterfeit products, and unsafe payment methods.",
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
        name: "Online Shopping Scam Prevention",
        item: "https://avasc.org/guides/online-shopping-scam-prevention",
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
          Online Shopping Scam Prevention: How to Shop Safely Online
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Online shopping offers convenience, but it also creates opportunities for fraud. From fake websites that look identical to legitimate ones to counterfeit products and payment theft, scammers have become experts at deception. Learning to shop safely protects your money, your personal information, and your peace of mind.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common Online Shopping Scams</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake websites that mimic legitimate retailers</h3>
            <p className="mt-2 text-slate-700">
              Scammers create websites that look nearly identical to major retailers (Amazon, Target, Apple, etc.). The URL is slightly different (amaz0n.com instead of amazon.com), and the site collects payment information but never delivers products.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Counterfeit products on legitimate marketplaces</h3>
            <p className="mt-2 text-slate-700">
              Fake sellers list counterfeit products on Amazon, eBay, and other marketplaces. You think you're buying a genuine branded item but receive a cheap imitation. Sometimes they don't send anything at all.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Too-good-to-be-true deals</h3>
            <p className="mt-2 text-slate-700">
              Someone posts luxury items (iPhones, designer handbags, electronics) at 50-80% off the regular price. They ask you to pay via bank transfer or cryptocurrency. You send money but never receive the product.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Payment method interception</h3>
            <p className="mt-2 text-slate-700">
              You enter your credit card or bank information on a fake checkout page. Scammers capture this data and use it to make fraudulent charges. Your information may be sold on the dark web.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Phishing for account credentials</h3>
            <p className="mt-2 text-slate-700">
              Scammers send emails appearing to be from Amazon or another retailer, asking you to "verify your account" or "confirm payment information." Links lead to fake login pages where your username and password are captured.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Marketplace seller fraud</h3>
            <p className="mt-2 text-slate-700">
              A marketplace seller receives your payment but ships nothing, ships the wrong item, or claims the package was "delivered" when you never received it. Some scammers disappear after opening shop and collecting deposits.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Social media shopping scams</h3>
            <p className="mt-2 text-slate-700">
              You see an ad on Facebook or Instagram for products you like. The website looks professional, but it's a scam. After you pay, communication stops and you receive nothing.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Identify Unsafe Websites</h2>
          <p className="text-slate-700 leading-relaxed">
            Before entering payment information, verify the website is legitimate:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check the URL carefully</h3>
            <p className="mt-2 text-slate-700">
              Fake websites have URLs that are slightly misspelled (amz0n.com, amazom.com, amazone.com). Copy the official URL directly from Google or your browser bookmarks rather than clicking links from emails or ads.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Look for the security lock and HTTPS</h3>
            <p className="mt-2 text-slate-700">
              Legitimate shopping sites have a padlock icon in the address bar and URLs starting with "https://" (the 's' means secure). This indicates encryption is protecting your data. If you see "http://" without the 's' on a checkout page, it's not secure.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check for poor website design and grammar</h3>
            <p className="mt-2 text-slate-700">
              Legitimate retailers invest in professional websites. If a site has poor grammar, spelling errors, low-quality images, outdated design, or inconsistent branding, it's likely a scam.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify contact information</h3>
            <p className="mt-2 text-slate-700">
              Legitimate businesses provide clear contact information (address, phone number, email). Scroll to the bottom of the website. If there's no way to contact the company or the phone number is a VOIP service, it's suspicious.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Look for customer reviews</h3>
            <p className="mt-2 text-slate-700">
              Check independent review sites like Trustpilot, Sitejabber, or Consumer Reports. Be skeptical if a website has no reviews or only 5-star reviews (fake sites often use fake positive reviews). Read negative reviews to understand problems.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify seller information on marketplaces</h3>
            <p className="mt-2 text-slate-700">
              On Amazon, eBay, or other platforms, click the seller's profile. How long have they been selling? What's their rating? Do they have extensive history? New sellers with limited feedback and no history are riskier.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Be wary of unrealistic prices</h3>
            <p className="mt-2 text-slate-700">
              If an item costs significantly less than everywhere else, it's a red flag. Search the item's price on multiple legitimate retailers. Major discounts of 50%+ are often scams.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Safe Shopping Practices</h2>
          <p className="text-slate-700 leading-relaxed">
            These practices significantly reduce your risk of being scammed:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use credit cards or payment protection services</h3>
            <p className="mt-2 text-slate-700">
              Credit cards offer better fraud protection than debit cards or bank transfers. Services like PayPal, Apple Pay, and Google Pay add an extra layer of security by not sharing your card directly with merchants.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Never use wire transfers or cryptocurrency</h3>
            <p className="mt-2 text-slate-700">
              These payment methods are irreversible and untraceable. Once scammers have your money, there's no way to get it back. Use these only for people and organizations you completely trust.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Shop through trusted retailers</h3>
            <p className="mt-2 text-slate-700">
              Stick with established retailers and marketplaces (Amazon, Target, Walmart, Best Buy, Apple, etc.). These companies have reputation and legal liability, making them less likely to scam you. They also offer buyer protection.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Enable two-factor authentication</h3>
            <p className="mt-2 text-slate-700">
              Turn on two-factor authentication for your shopping accounts. Even if scammers get your password, they can't access your account without the second verification.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify seller ratings and return policies</h3>
            <p className="mt-2 text-slate-700">
              Before buying from a marketplace seller, check their ratings and read recent reviews. Legitimate sellers have clear return policies. If there's no way to return items, it's risky.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Keep records of all transactions</h3>
            <p className="mt-2 text-slate-700">
              Save confirmation emails, receipts, and order numbers. If there's a problem, you'll have documentation. For major purchases, take screenshots of product descriptions and seller information.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You've Been Scammed</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Contact your credit card company or bank immediately</h3>
            <p className="mt-2 text-slate-700">
              Dispute fraudulent charges as soon as possible. Most credit cards have 30-60 days to report fraud. The sooner you act, the better your chances of recovery.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">File a complaint with the retailer or marketplace</h3>
            <p className="mt-2 text-slate-700">
              If you bought through Amazon, eBay, or another marketplace, file a dispute. These platforms often side with buyers and can reverse fraudulent transactions or ban the seller.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to the FTC</h3>
            <p className="mt-2 text-slate-700">
              File a report at reportfraud.ftc.gov. The FTC collects data on fraud to identify patterns and pursue scammers. Your report helps protect others.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Change your passwords</h3>
            <p className="mt-2 text-slate-700">
              If you entered your shopping account password on a fake site, change it immediately. Use a strong, unique password. Also change passwords for email and other important accounts if they use the same password.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Online shopping can be safe if you stay vigilant. Before making a purchase, slow down and verify the seller and website. If something feels off—unusual prices, poor website design, no contact information—trust your instincts. The convenience of online shopping isn't worth the risk of identity theft or financial loss.
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
            <p className="mt-2 text-sm text-slate-600">Check if a seller or website is known to scam.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Report fraudulent sellers and fake websites to protect others.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Scammed online? Visit our{" "}
            <Link href="/recovery" className="font-medium text-slate-900 underline underline-offset-2">
              recovery resources
            </Link>{" "}
            for immediate steps to take and protect your financial accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
