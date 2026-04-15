import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Identity Theft Protection: How to Safeguard Your Personal Information | AVASC",
  description:
    "Learn how to protect your Social Security number, monitor credit, freeze your credit, detect data breaches, and monitor the dark web. Essential identity theft prevention.",
  openGraph: {
    title: "Identity Theft Protection: How to Safeguard Your Personal Information | AVASC",
    description:
      "Learn how to protect your Social Security number, monitor credit, freeze your credit, detect data breaches, and monitor the dark web.",
    type: "article",
    url: "https://avasc.org/guides/identity-theft-protection",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/identity-theft-protection",
  },
};

export default function IdentityTheftProtectionPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Identity Theft Protection: How to Safeguard Your Personal Information",
    description:
      "Learn how to protect your personal information and detect identity theft early.",
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
        name: "Identity Theft Protection",
        item: "https://avasc.org/guides/identity-theft-protection",
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
          Identity Theft Protection: How to Safeguard Your Personal Information
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Identity theft can take years to recover from and costs victims thousands of dollars. But identity theft doesn't happen by chance—it happens because your personal information was exposed or stolen. Learning to protect your information and detect theft early is your best defense.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How Identity Theft Happens</h2>
          <p className="text-slate-700 leading-relaxed">
            Identity thieves use multiple methods to steal personal information:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Data breaches</h3>
            <p className="mt-2 text-slate-700">
              Hackers infiltrate companies' databases and steal millions of customer records. If you've been a customer at any major company in the past decade, your information may have been exposed. These breaches often aren't publicized until months later.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Phishing and social engineering</h3>
            <p className="mt-2 text-slate-700">
              Scammers pose as legitimate organizations to trick you into revealing personal information. They may call claiming to be from your bank, send emails requesting account verification, or create fake websites to capture credentials.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Physical document theft</h3>
            <p className="mt-2 text-slate-700">
              Identity thieves steal mail, rummage through trash, break into homes, or steal wallets and purses to get documents containing Social Security numbers, account numbers, and identification.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unsafe online behavior</h3>
            <p className="mt-2 text-slate-700">
              Using the same password across sites, connecting to unsecured WiFi networks, not updating software, and downloading malware can expose your information to thieves.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Public records and databases</h3>
            <p className="mt-2 text-slate-700">
              Information is available in public records (voter registration, court documents, property records). Scammers compile this data and sell it or use it to commit fraud.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Dark web sales</h3>
            <p className="mt-2 text-slate-700">
              Once stolen, personal information is bought and sold on the dark web. Criminals purchase your data from previous breaches and other thieves to commit fraud.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Protecting Your Most Sensitive Information</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Your Social Security number (SSN)</h3>
            <p className="mt-2 text-slate-700">
              Your SSN is the most valuable piece of personal information. Never share it unless absolutely necessary (employers, banks, credit agencies). Don't carry your Social Security card in your wallet. Be suspicious of anyone requesting it over the phone or online.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Government-issued IDs</h3>
            <p className="mt-2 text-slate-700">
              Protect your driver's license, passport, and state ID. Don't take photos of them or email copies unless absolutely necessary. Don't share photos on social media. Never give these numbers to unsolicited callers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Financial account numbers</h3>
            <p className="mt-2 text-slate-700">
              Never share bank account numbers, credit card numbers, or investment account numbers via email, text, or phone. Only enter this information on secure websites (look for the lock icon and "https").
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Passwords and security answers</h3>
            <p className="mt-2 text-slate-700">
              Use unique, strong passwords for every account. Use a password manager to generate and store them. Never share passwords, even with family or friends. Be careful with security questions—scammers can find answers on social media.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Medical and insurance information</h3>
            <p className="mt-2 text-slate-700">
              This information can be used to open fraudulent accounts or file false insurance claims. Only share with medical providers directly. Don't post health information on social media.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Monitoring Your Credit and Accounts</h2>
          <p className="text-slate-700 leading-relaxed">
            Early detection is key. The sooner you discover identity theft, the sooner you can stop it:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check your credit reports</h3>
            <p className="mt-2 text-slate-700">
              You're entitled to one free credit report per year from each of the three credit bureaus (Equifax, Experian, TransUnion) at annualcreditreport.com. Review them carefully for accounts you don't recognize, suspicious inquiries, or incorrect information. Get a fresh report every 4 months from each bureau.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor your credit score</h3>
            <p className="mt-2 text-slate-700">
              Watch your credit score through free services like Credit Karma or your bank's monitoring tools. A sudden drop can indicate fraud. Check your score monthly.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Set credit alerts</h3>
            <p className="mt-2 text-slate-700">
              Place fraud alerts with all three credit bureaus to be notified if anyone tries to open accounts in your name. These are free. You can renew them every year.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Freeze your credit</h3>
            <p className="mt-2 text-slate-700">
              A credit freeze prevents anyone (including thieves) from opening new accounts in your name. You can still access your own credit. Freezes are free and easy to set up with all three bureaus. Temporarily unfreeze when you're applying for credit.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor your bank and credit card statements</h3>
            <p className="mt-2 text-slate-700">
              Review statements monthly (or more frequently) for unauthorized transactions. Enable account alerts for large or unusual transactions. Report fraudulent charges immediately to your financial institution.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor your email and account access</h3>
            <p className="mt-2 text-slate-700">
              Watch for unexpected password reset emails, account confirmation requests, or login alerts from accounts you didn't access. These indicate someone may be trying to compromise your accounts.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Protecting Your Information Online</h2>

          <ul className="space-y-2 text-slate-700">
            <li>• Use strong, unique passwords for every account (12+ characters, mix of letters, numbers, symbols)</li>
            <li>• Enable two-factor authentication on important accounts (email, banking, social media)</li>
            <li>• Don't use the same password across multiple sites</li>
            <li>• Use a password manager to generate and store secure passwords</li>
            <li>• Don't click links in unsolicited emails or texts</li>
            <li>• Don't connect to public WiFi for banking or sensitive transactions</li>
            <li>• Keep your operating system and software updated with security patches</li>
            <li>• Use antivirus and antimalware software</li>
            <li>• Be cautious with public WiFi—use a VPN if you must connect</li>
            <li>• Don't overshare on social media (birthday, hometown, pet names, etc. can be security answers)</li>
            <li>• Verify website security before entering personal information (look for lock icon and HTTPS)</li>
            <li>• Use your browser's password manager securely or a dedicated password manager</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You've Been Affected by a Data Breach</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Change your passwords</h3>
            <p className="mt-2 text-slate-700">
              If a company you use has been breached, change your password immediately. If you've used the same password elsewhere, change it on all accounts.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Place a fraud alert</h3>
            <p className="mt-2 text-slate-700">
              Contact one of the three credit bureaus and request a fraud alert. They'll notify the other two automatically.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor your credit closely</h3>
            <p className="mt-2 text-slate-700">
              Check your credit reports immediately and then regularly for the next few years. Many identity theft attempts happen months after a breach.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Consider credit monitoring services</h3>
            <p className="mt-2 text-slate-700">
              After a significant breach, identity theft protection services may be offered for free. They monitor your credit and alert you to suspicious activity.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Identity theft is a serious crime with long-lasting effects. The good news is that many preventive steps are free and simple. Protecting your most sensitive information, monitoring your credit, using strong passwords, and staying alert are your best defenses. If you suspect identity theft, act immediately—the faster you respond, the less damage occurs.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">What's Next?</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Recovery Resources</h3>
            <p className="mt-2 text-sm text-slate-600">Steps to take if you've been victimized by identity theft.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Report identity theft to law enforcement and authorities.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Learn about other types of fraud in our guide on{" "}
            <Link href="/guides/how-to-identify-a-scam" className="font-medium text-slate-900 underline underline-offset-2">
              how to identify a scam
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
