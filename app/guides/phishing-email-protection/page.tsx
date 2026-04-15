import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How to Protect Yourself from Phishing Emails and Fake Websites | AVASC",
  description:
    "Learn to spot phishing emails, verify senders, check URLs, and secure your accounts with two-factor authentication. Protect yourself from credential theft.",
  openGraph: {
    title: "How to Protect Yourself from Phishing Emails and Fake Websites | AVASC",
    description:
      "Learn to spot phishing emails, verify senders, check URLs, and secure your accounts with two-factor authentication. Protect yourself from credential theft.",
    type: "article",
    url: "https://avasc.org/guides/phishing-email-protection",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/phishing-email-protection",
  },
};

export default function PhishingProtectionPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Protect Yourself from Phishing Emails and Fake Websites",
    description:
      "Learn to spot phishing emails, verify senders, check URLs, and secure your accounts with two-factor authentication.",
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
        name: "How to Protect Yourself from Phishing Emails and Fake Websites",
        item: "https://avasc.org/guides/phishing-email-protection",
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
          How to Protect Yourself from Phishing Emails and Fake Websites
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Phishing is one of the most common ways scammers steal credentials, drain bank accounts, and gain access to sensitive information. The good news: you can learn to recognize and avoid phishing attacks.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What Is Phishing?</h2>
          <p className="text-slate-700 leading-relaxed">
            Phishing is a scam where attackers impersonate legitimate organizations (banks, PayPal, Microsoft, Apple, etc.) to trick you into revealing passwords, credit card numbers, or other sensitive information. Most phishing happens via email, but it also occurs via text messages (smishing), phone calls (vishing), and fake websites.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Why phishing is so effective</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Fake emails look nearly identical to real ones</li>
              <li>Attackers create artificial urgency ("Your account will be closed," "Suspicious activity detected")</li>
              <li>People often don't check URLs carefully</li>
              <li>Most people receive thousands of legitimate emails, making it easier to miss a fake one</li>
              <li>Legitimate companies occasionally send similar emails, which confuses people</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Spot Phishing Emails</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check the sender's email address</h3>
            <p className="mt-2 text-slate-700">
              This is one of the most important checks. Legitimate companies email from their official domain. A fake from "paypa1.com" (with a 1 instead of l) or "secure-verification@banking.service" is not real.
            </p>
            <p className="mt-3 text-sm font-medium text-slate-600">Pro tip:</p>
            <p className="mt-1 text-sm text-slate-600">
              Hover over the sender's name in your email to reveal the actual email address. Some email clients hide the real address by default.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Suspicious greeting</h3>
            <p className="mt-2 text-slate-700">
              Phishing emails often use generic greetings like "Dear Customer," "Dear User," or "Dear Valued Member" rather than your actual name. Legitimate companies know your name because they have your account information.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Artificial urgency or threats</h3>
            <p className="mt-2 text-slate-700">
              "Your account will be closed in 24 hours," "Unusual activity detected," "Confirm your information now," "Your card has been compromised." These create panic that prevents careful thinking.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Requests for sensitive information</h3>
            <p className="mt-2 text-slate-700">
              Legitimate companies will NEVER ask you to verify passwords, credit card numbers, Social Security numbers, or other sensitive information via email. Period. If an email asks for this, it's a phishing attempt.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Links that don't match the text</h3>
            <p className="mt-2 text-slate-700">
              Hover over any link in the email (don't click). Look at the URL at the bottom of your screen. If the link text says "Click here to verify your account" but the actual URL is "malicious-site.com," it's phishing.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Spelling, grammar, or formatting errors</h3>
            <p className="mt-2 text-slate-700">
              Professional companies proofread their communications. Emails with misspellings, awkward phrasing, or poor formatting are often phishing attempts. However, some phishing emails are well-written, so don't rely on this alone.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unexpected attachments</h3>
            <p className="mt-2 text-slate-700">
              Legitimate companies usually don't send unsolicited attachments. Be especially suspicious of Excel files, PDFs, or software downloads you didn't request. These often contain malware.
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">RED FLAG: "Click here to confirm" or "Verify now"</h3>
            <p className="mt-3 text-red-950/90">
              Any email asking you to click a link to "confirm," "verify," "update," or "validate" your account is likely phishing. Legitimate companies may ask you to log in, but they'll direct you to their official website, not via email links.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Verify URLs</h2>
          <p className="text-slate-700 leading-relaxed">
            URLs are easy to fake. Here's how to check if a website is legitimate:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check the domain (the main part of the URL)</h3>
            <p className="mt-2 text-slate-700">
              The real Coinbase URL is coinbase.com. Fake sites might use:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>coibase.com (1 instead of i)</li>
              <li>coinbase-secure.com (adding words)</li>
              <li>coinbase.net or coinbase.co (different extension)</li>
              <li>mycoinbase.com (adding a prefix)</li>
            </ul>
            <p className="mt-3 text-slate-700">
              Type the URL directly into your browser from memory or a trusted source. Never click links from emails or messages.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Look for the padlock (HTTPS)</h3>
            <p className="mt-2 text-slate-700">
              Legitimate websites use HTTPS (secure connection). Look for a padlock icon in your browser's address bar. While HTTPS is standard, some phishing sites use it too, so this is helpful but not sufficient alone.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Verify the SSL certificate</h3>
            <p className="mt-2 text-slate-700">
              Click the padlock to view the SSL certificate. It should show the legitimate company's name. If it shows a different name or a generic certificate provider, it's likely fake.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Go directly to the official website</h3>
            <p className="mt-2 text-slate-700">
              Don't click email links. Instead, type the company's website into your browser or use a bookmark. This ensures you're visiting the real site. If there's an issue with your account, you'll see it when you log in directly.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use browser security tools</h3>
            <p className="mt-2 text-slate-700">
              Modern browsers (Chrome, Firefox, Safari, Edge) have built-in phishing detection. They may warn you if you're about to visit a known phishing site. Pay attention to these warnings.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Protecting Your Accounts</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Enable two-factor authentication (2FA)</h3>
            <p className="mt-2 text-slate-700">
              Even if a scammer gets your password through phishing, they can't log in without a second factor (usually a code from your phone). Enable 2FA on:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Email accounts</li>
              <li>Banking and financial accounts</li>
              <li>Social media accounts</li>
              <li>Password managers</li>
              <li>Any account with sensitive information</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Use authenticator apps (Google Authenticator, Authy) rather than SMS when possible, as SMS can be intercepted.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use unique, strong passwords</h3>
            <p className="mt-2 text-slate-700">
              Use a password manager (1Password, Bitwarden, LastPass) to generate and store unique passwords for each account. If one password is compromised through phishing, the others remain secure.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Never enter passwords on email links</h3>
            <p className="mt-2 text-slate-700">
              Even if an email looks legitimate and asks you to "confirm your password," don't click the link. Log in directly to the website (type the URL yourself) to check if anything is wrong.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check your accounts regularly</h3>
            <p className="mt-2 text-slate-700">
              Monitor bank, credit card, and email accounts for suspicious activity. Many breaches go unnoticed for months. Early detection can prevent significant loss.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You Click a Phishing Link</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">You clicked the link but didn't enter information</h3>
            <p className="mt-2 text-slate-700">
              You're likely fine. Just close the page immediately. Don't stay on the fake website. Monitor your email and accounts for unusual activity, but no sensitive information was compromised.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">You entered your password</h3>
            <p className="mt-2 text-slate-700">
              Change your password immediately on the real website (not by clicking email links). Use a strong, unique password. Enable 2FA if you haven't already. Monitor your account for unauthorized activity.
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">You entered credit card, bank, or personal information</h3>
            <p className="mt-3 text-red-950/90 space-y-3">
              <p>Contact your bank and credit card company immediately. Report the fraud. They can:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Monitor your accounts for suspicious transactions</li>
                <li>Dispute fraudulent charges</li>
                <li>Issue new cards if necessary</li>
              </ul>
              <p className="mt-2">Also freeze your credit to prevent identity theft. Contact the three credit bureaus (Equifax, Experian, TransUnion).</p>
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Report Phishing</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to the company being impersonated</h3>
            <p className="mt-2 text-slate-700">
              Most companies have a phishing reporting email (usually phishing@companyname.com). Forward the phishing email to them (include the full headers if possible). They can take down fake websites and warn other customers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to your email provider</h3>
            <p className="mt-2 text-slate-700">
              Gmail, Outlook, and other email services have report buttons. Marking phishing emails as "phishing" helps improve their detection systems.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to the FTC</h3>
            <p className="mt-2 text-slate-700">
              Report phishing and credential theft to reportfraud.ftc.gov. This creates an official record and helps law enforcement identify patterns.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report phishing URLs</h3>
            <p className="mt-2 text-slate-700">
              Submit phishing websites to abuse databases like PhishTank.com. This helps browsers and security providers block the sites.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Remember: Legitimate Companies Never Ask for Passwords via Email</h2>
          <p className="mt-3 text-amber-950/90">
            This is the golden rule. Your bank, email provider, PayPal, Amazon, or any legitimate organization will never ask you to verify your password, Social Security number, or credit card via email. If they need to contact you about your account, they'll direct you to log in directly on their secure website, not through email links.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Take Action</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report Phishing or Fraud</h3>
            <p className="mt-2 text-sm text-slate-600">Document your experience and help protect others from the same scam.</p>
          </Link>

          <Link
            href="/guides/how-to-identify-a-scam"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">How to Identify a Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Learn other warning signs and manipulation tactics.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
