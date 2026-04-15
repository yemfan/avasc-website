import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tech Support Scam Protection: Don't Fall for Fake Computer Warnings | AVASC",
  description:
    "Learn to identify fake virus popups, scam phone calls claiming to be Microsoft or Apple, and remote access tricks. Protect your devices and data.",
  openGraph: {
    title: "Tech Support Scam Protection: Don't Fall for Fake Computer Warnings | AVASC",
    description:
      "Learn to identify fake virus popups, scam phone calls claiming to be Microsoft or Apple, and remote access tricks. Protect your devices and data.",
    type: "article",
    url: "https://avasc.org/guides/tech-support-scam-protection",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/tech-support-scam-protection",
  },
};

export default function TechSupportScamProtectionPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tech Support Scam Protection: Don't Fall for Fake Computer Warnings",
    description:
      "Learn to identify fake virus popups, scam phone calls, and remote access tricks targeting your devices.",
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
        name: "Tech Support Scam Protection",
        item: "https://avasc.org/guides/tech-support-scam-protection",
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
          Tech Support Scam Protection: Don't Fall for Fake Computer Warnings
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Tech support scams are some of the most convincing and profitable scams in operation. Scammers create urgent-looking warnings that your computer is infected, then pressure you to call a fake support line or download remote access software. Understanding these tactics can save your device and your money.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Anatomy of a Tech Support Scam</h2>
          <p className="text-slate-700 leading-relaxed">
            Tech support scams work through a combination of fake warnings and psychological pressure. Here's how they typically unfold:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The fake warning popup</h3>
            <p className="mt-2 text-slate-700">
              You're browsing the web when a full-screen warning appears: "WARNING: Your computer has been infected with a virus!" The popup looks professional, often mimicking Windows or Apple warnings. It may play alarming sounds and prevent you from closing it easily.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The call-to-action button</h3>
            <p className="mt-2 text-slate-700">
              The popup displays a phone number to call for "immediate support" or a button to download "antivirus software." Both lead to scammers. The phone number connects you to a fake support center; the download installs malware.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The urgent tone</h3>
            <p className="mt-2 text-slate-700">
              Everything about the fake warning screams urgency. "ACT NOW!" "Your data is at risk!" "Call immediately!" This panic is intentional—scared people make poor decisions.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The follow-up pressure</h3>
            <p className="mt-2 text-slate-700">
              If you call the number, a scammer pretending to be tech support will verify the "infection," use remote access software to show you fake problems on your screen, then demand payment ($300-500 typical) to "fix" everything.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common Tech Support Scam Types</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake virus warning popups</h3>
            <p className="mt-2 text-slate-700">
              These appear while you're browsing websites (especially free content sites). They claim your device has viruses, spyware, or security threats. Apple and Microsoft never pop up warnings telling you to call a number—they provide warnings within their built-in security settings only.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Cold calls claiming to be Microsoft or Apple</h3>
            <p className="mt-2 text-slate-700">
              A scammer calls claiming to be from Microsoft or Apple's support team, saying they've detected a virus on your computer. They ask you to give them remote access to "fix" it. Real companies never call unsolicited about viruses detected on your device.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake antivirus software</h3>
            <p className="mt-2 text-slate-700">
              You download what appears to be antivirus software (often from an ad or fake warning), but it's actually malware. The fake antivirus then displays endless fake warnings to pressure you into paying for the "full version."
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Remote access software exploitation</h3>
            <p className="mt-2 text-slate-700">
              Scammers convince you to download remote access software (TeamViewer, AnyDesk, etc.) to "fix" your computer. Once installed, they have access to your files, passwords, and banking information. They may lock you out of your own computer.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake refund scams</h3>
            <p className="mt-2 text-slate-700">
              After "fixing" your computer and charging you, the scammer offers a "refund" but asks for bank account access to process it. They're actually stealing your banking information.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Scare tactics about your browser</h3>
            <p className="mt-2 text-slate-700">
              Popups claim your browser has "outdated plugins," "malicious extensions," or is "compromised." They pressure you to click links that either install malware or collect personal information.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Identify Fake Tech Support Warnings</h2>
          <p className="text-slate-700 leading-relaxed">
            Legitimate security warnings have specific characteristics. Fake ones are designed to scare:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Real vs. fake warnings</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li><strong>Real warnings:</strong> Come from your operating system (Windows, Mac) or apps directly, not from web popups</li>
              <li><strong>Real warnings:</strong> Don't include phone numbers to call or links to download software</li>
              <li><strong>Real warnings:</strong> Use your operating system's native interface, not flashy graphical designs</li>
              <li><strong>Fake warnings:</strong> Use alarming language and sounds to create panic</li>
              <li><strong>Fake warnings:</strong> Display phone numbers prominently ("Call now!")</li>
              <li><strong>Fake warnings:</strong> Can't be closed easily or keep reappearing</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unsolicited calls from tech support</h3>
            <p className="mt-2 text-slate-700">
              Microsoft, Apple, and other legitimate companies do NOT call people unsolicited to alert them about viruses. If someone calls claiming to be tech support, it's a scam. Hang up immediately.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Request for remote access</h3>
            <p className="mt-2 text-slate-700">
              Be extremely suspicious if someone asks for remote access to your computer. Once granted, they can access all your files, passwords, banking information, and emails. Never grant remote access to unsolicited callers.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Payment request</h3>
            <p className="mt-2 text-slate-700">
              Legitimate tech support may have a fee for professional help, but unsolicited tech support calls that demand immediate payment are always scams. Real companies don't pressure you to pay immediately via gift card or wire transfer.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You've Encountered a Tech Support Scam</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you see a fake warning popup</h3>
            <p className="mt-2 text-slate-700">
              Don't click anything on the popup. Force-quit your browser: Press Ctrl+Alt+Delete (Windows) or Command+Option+Escape (Mac), select your browser, and click End Task/Force Quit. Restart your browser and check your security settings.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you received a suspicious phone call</h3>
            <p className="mt-2 text-slate-700">
              Hang up immediately. Do not give them remote access or any personal information. Block the number. Run a security scan on your computer to ensure no malware was installed during the call.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you already gave remote access</h3>
            <p className="mt-2 text-slate-700">
              Disconnect your computer from the internet immediately. Contact a trusted tech professional to scan your computer for malware. Change your passwords for all important accounts (email, banking, social media). Consider placing a fraud alert on your credit report.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">If you paid the scammers</h3>
            <p className="mt-2 text-slate-700">
              Contact your bank or credit card company immediately to dispute the charge. Report the scam to the FTC at reportfraud.ftc.gov. Follow our recovery resources for additional support and steps to take.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Protecting Your Devices from Tech Scams</h2>
          <p className="text-slate-700 leading-relaxed">
            Prevention is always better than recovery. Take these steps to protect yourself:
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• Install legitimate antivirus/antimalware software (Windows Defender, macOS Security, Norton, Bitdefender)</li>
            <li>• Keep your operating system and software updated with the latest security patches</li>
            <li>• Use strong, unique passwords for important accounts</li>
            <li>• Enable two-factor authentication on critical accounts (email, banking, social media)</li>
            <li>• Be cautious on websites offering free content (movies, software, tools)—they often have malware</li>
            <li>• Don't click links in unsolicited emails or texts, even if they appear to be from legitimate companies</li>
            <li>• Use a password manager to secure your passwords</li>
            <li>• Disable pop-ups in your browser settings</li>
            <li>• Use browser extensions that block malicious websites</li>
            <li>• Remember: legitimate tech companies never cold-call about viruses</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Tech support scammers succeed because they create panic and urgency. If something on your computer makes you anxious, take a breath. Close any popups without clicking them. If someone calls, hang up. Contact tech support yourself—look up official numbers independently. Trust your instincts, and remember that real tech support companies don't use scare tactics or unsolicited cold calls.
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
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Report tech support scams to help protect your community.</p>
          </Link>

          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Recovery Resources</h3>
            <p className="mt-2 text-sm text-slate-600">If you've been scammed, immediate action can limit damage.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Have questions about keeping your devices safe? Check out our guide on{" "}
            <Link href="/guides/how-to-identify-a-scam" className="font-medium text-slate-900 underline underline-offset-2">
              how to identify a scam
            </Link>{" "}
            for more warning signs to watch for.
          </p>
        </div>
      </div>
    </div>
  );
}
