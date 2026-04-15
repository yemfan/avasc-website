import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Business Email Compromise (BEC): How Scammers Target Companies | AVASC",
  description:
    "Learn about CEO fraud, invoice manipulation, vendor impersonation, and W-2 phishing. Understand prevention policies and how to protect your organization.",
  openGraph: {
    title: "Business Email Compromise (BEC): How Scammers Target Companies | AVASC",
    description:
      "Learn how scammers use email to commit CEO fraud, invoice fraud, and other business crimes.",
    type: "article",
    url: "https://avasc.org/guides/business-email-compromise",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/business-email-compromise",
  },
};

export default function BusinessEmailCompromisePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Business Email Compromise (BEC): How Scammers Target Companies",
    description:
      "Learn about CEO fraud and how to protect your organization from business email compromise.",
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
        name: "Business Email Compromise",
        item: "https://avasc.org/guides/business-email-compromise",
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
          Business Email Compromise (BEC): How Scammers Target Companies
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Business Email Compromise (BEC) is one of the most costly fraud types, causing billions of dollars in losses annually. Scammers impersonate executives, manipulate employees, and exploit company relationships to steal money and data. Understanding these tactics helps your organization defend against them.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What Is Business Email Compromise?</h2>
          <p className="text-slate-700 leading-relaxed">
            Business Email Compromise is a sophisticated fraud attack where criminals send emails appearing to be from company executives, trusted vendors, or business partners. These emails request urgent money transfers, sensitive data, or credential changes. The requests seem legitimate and come from "inside" the company, making employees less suspicious.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How BEC differs from phishing</h3>
            <p className="mt-2 text-slate-700">
              Standard phishing attacks use mass emails with obvious red flags (poor grammar, generic greetings). BEC attacks are highly targeted and sophisticated. Scammers research company structure, understand business relationships, and craft emails that perfectly mimic an executive's communication style.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common BEC Attack Types</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">CEO fraud (whaling)</h3>
            <p className="mt-2 text-slate-700">
              An email appears to be from the CEO or executive requesting an urgent wire transfer. The email cites time sensitivity: "Complete this before end of business," "Needed for acquisition," or "Confidential—don't discuss with others." Employees comply quickly without verifying through normal channels.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Invoice manipulation</h3>
            <p className="mt-2 text-slate-700">
              Scammers intercept or impersonate a vendor and send fraudulent invoices requesting payment. The invoice looks legitimate, includes company logos, and matches the vendor's format. Accounting departments pay invoices without additional verification.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Vendor impersonation</h3>
            <p className="mt-2 text-slate-700">
              Scammers send emails appearing to be from a trusted vendor requesting payment for invoices. They create email addresses nearly identical to the real vendor (vemdor.com instead of vendor.com). Employees pay invoices that never existed.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">W-2 phishing</h3>
            <p className="mt-2 text-slate-700">
              An email appears to be from HR or the CEO requesting W-2 information (Social Security numbers, salary information) for all employees. Scammers use this information to file fraudulent tax returns or commit identity theft.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Wire transfer fraud</h3>
            <p className="mt-2 text-slate-700">
              Emails request urgent wire transfers to new accounts or foreign banks. The urgency and authority (appearing from an executive) pressure employees to bypass verification procedures.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Credential harvesting</h3>
            <p className="mt-2 text-slate-700">
              An email appears to be from IT or a service provider requesting account credentials for "system updates" or "security verification." Once obtained, scammers access company systems, steal data, or commit further fraud.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Account takeover</h3>
            <p className="mt-2 text-slate-700">
              Scammers compromise an employee's or executive's email account through phishing or password attacks. Once inside, they send fraudulent emails to colleagues, vendors, and partners that appear completely legitimate.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How Scammers Research Your Organization</h2>
          <p className="text-slate-700 leading-relaxed">
            BEC attackers are thorough. They research your company extensively before attacking:
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• Review your website for company structure, executives, and departments</li>
            <li>• Check LinkedIn for employee information and organizational hierarchy</li>
            <li>• Monitor social media for executive announcements and company news</li>
            <li>• Research your vendors and business partners</li>
            <li>• Review public financial documents and SEC filings</li>
            <li>• Monitor press releases for mergers, acquisitions, and partnerships</li>
            <li>• Check email directories and leaked password databases</li>
            <li>• Study executive communication patterns from emails leaked online</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Red Flags for BEC Emails</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Sender address anomalies</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Email from an external domain instead of company email</li>
              <li>Similar but slightly different spelling (ceo-name@company-name.com instead of @company.com)</li>
              <li>Free email addresses (Gmail, Yahoo) used by "executives"</li>
              <li>Spoofed emails appearing to be from known contacts</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Message content red flags</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Unusual urgency or time pressure</li>
              <li>Requests for secrecy: "Don't mention this," "Keep between us"</li>
              <li>Unusual requests from normally routine transactions</li>
              <li>Wire transfer requests to unfamiliar bank accounts</li>
              <li>Requests for sensitive information (passwords, credentials, W-2 data)</li>
              <li>Executive tone different from their usual style</li>
              <li>Poor grammar or spelling (though sophisticated BEC attacks avoid this)</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Process red flags</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Request bypasses normal approval processes</li>
              <li>Requests to skip vendor verification procedures</li>
              <li>Instructions to process payment immediately without review</li>
              <li>Request to use unusual payment methods</li>
              <li>New account information for a known vendor</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Prevention Policies and Best Practices</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Implement multi-factor authentication (MFA)</h3>
            <p className="mt-2 text-slate-700">
              Require MFA for all email accounts, especially for executives and finance staff. This prevents attackers from accessing accounts even with stolen passwords.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Establish verification procedures</h3>
            <p className="mt-2 text-slate-700">
              For any financial requests, always verify by calling the requester back using a known phone number (not from the email). Never use contact information from the email itself. For vendor payments, verify new account information through a separate communication channel.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Segregate financial duties</h3>
            <p className="mt-2 text-slate-700">
              Never allow one person to approve and process payments. Require at least two people: one to approve, one to execute. This prevents a single compromised employee from causing damage.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use email authentication protocols</h3>
            <p className="mt-2 text-slate-700">
              Implement SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), and DMARC (Domain-based Message Authentication) to prevent email spoofing. These make it harder for attackers to impersonate your company.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Train employees on BEC threats</h3>
            <p className="mt-2 text-slate-700">
              Regular security training helps employees recognize BEC attacks. Educate staff about the specific risks they face and the verification procedures your company uses.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Create a fraud reporting system</h3>
            <p className="mt-2 text-slate-700">
              Establish a simple process for employees to report suspected fraud. Make reporting safe and anonymous so employees feel comfortable alerting leadership to threats.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Monitor email for red flags</h3>
            <p className="mt-2 text-slate-700">
              Use email filtering software to flag suspicious emails (spoofed addresses, external senders requesting payments, etc.). This catches many attacks automatically.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Implement account restrictions</h3>
            <p className="mt-2 text-slate-700">
              Limit what compromised accounts can do. For example, temporarily restrict email forwarding rules, disable automatic replies, and flag unusual account activity.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You Suspect a BEC Attack</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Stop and verify</h3>
            <p className="mt-2 text-slate-700">
              If you receive a suspicious email requesting payment, credentials, or sensitive information, stop immediately. Call the person at a number you know is correct (from the company directory or website, not from the email) and verify the request.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to IT and security</h3>
            <p className="mt-2 text-slate-700">
              Alert your IT department and security team immediately. If an account has been compromised, they need to secure it. If wire transfers were made, they need to contact the bank immediately to try to recover funds.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Reset compromised accounts</h3>
            <p className="mt-2 text-slate-700">
              If an employee's account has been compromised, reset their password immediately and force them to log out from all sessions. Require them to change passwords on other accounts that share the same password.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-latex-700">Contact your bank immediately</h3>
            <p className="mt-2 text-slate-700">
              If funds have been transferred, contact your bank or financial institution immediately. Many fraudulent transfers can be stopped or reversed if reported quickly enough.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-700">Report to law enforcement</h3>
            <p className="mt-2 text-slate-700">
              Report BEC attacks to the FBI's Internet Crime Complaint Center (IC3) at ic3.gov. Provide details about the attack, any funds lost, and the email addresses/accounts used.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Business Email Compromise is sophisticated and targeted. Your best defense is a combination of technical controls (MFA, email authentication, filtering) and human awareness (verification procedures, employee training). When unusual financial or sensitive data requests arrive via email, slow down and verify through an alternative communication channel. The few minutes spent verifying can save your organization hundreds of thousands of dollars.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">What's Next?</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a BEC Attack</h3>
            <p className="mt-2 text-sm text-slate-600">Report suspected BEC attacks to help law enforcement.</p>
          </Link>

          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if an email address or company has been used in BEC attacks.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            For detailed organizational security guidance, consult with a cybersecurity professional or contact the FBI's Cyber Division.
          </p>
        </div>
      </div>
    </div>
  );
}
