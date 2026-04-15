import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Romance Scam Warning Signs: How to Protect Yourself Online | AVASC",
  description:
    "Learn to recognize catfishing, love bombing, and financial manipulation in online dating. Protect yourself from romance scammers.",
  openGraph: {
    title: "Romance Scam Warning Signs: How to Protect Yourself Online | AVASC",
    description:
      "Learn to recognize catfishing, love bombing, and financial manipulation in online dating. Protect yourself from romance scammers.",
    type: "article",
    url: "https://avasc.org/guides/romance-scam-warning-signs",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/romance-scam-warning-signs",
  },
};

export default function RomanceScamPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Romance Scam Warning Signs: How to Protect Yourself Online",
    description: "Learn to recognize catfishing, love bombing, and financial manipulation in online dating.",
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
        name: "Romance Scam Warning Signs",
        item: "https://avasc.org/guides/romance-scam-warning-signs",
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
          Romance Scam Warning Signs: How to Protect Yourself Online
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Romance scammers are masters of emotional manipulation. They study human psychology, exploit loneliness, and weaponize genuine emotion. Knowing what to watch for can save you heartbreak—and money.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Early Red Flags</h2>
          <p className="text-slate-700 leading-relaxed">
            Romance scammers move fast. In legitimate relationships, trust builds slowly. In scams, it happens at lightning speed:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Unusually quick declarations of love</h3>
            <p className="mt-2 text-slate-700">
              "I've never felt this way before," "You're my soulmate," "I love you" within days of matching. Genuine relationships develop feelings gradually. Immediate declarations are a manipulation tactic.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Overly perfect profile or personality</h3>
            <p className="mt-2 text-slate-700">
              They match every interest you mention, have all the qualities you value, and seem designed specifically for you. Real people have quirks and contradictions. A profile that's too perfect is often stolen or entirely fabricated.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Reluctance to video chat</h3>
            <p className="mt-2 text-slate-700">
              They always have excuses: "My camera is broken," "I'm deployed overseas," "My company blocks video," "Bad internet connection." Video calls are the simplest way to verify someone's identity. Genuine people want to see you.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Inconsistent personal details</h3>
            <p className="mt-2 text-slate-700">
              Their job, location, family details, or background shift in subtle ways over time. They claim to be in one country then mention being in another. They forget details they told you before.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Moving conversation off the platform quickly</h3>
            <p className="mt-2 text-slate-700">
              Within days, they suggest moving to WhatsApp, Facebook Messenger, or email. Dating platforms have fraud detection and payment systems. Moving off-platform removes oversight.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Excessive flattery and attention</h3>
            <p className="mt-2 text-slate-700">
              They constantly compliment you, make you feel special, and seem obsessed with getting to know you. While attention feels good, this level of focus is often calculated to deepen emotional investment.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Love Bombing and Emotional Manipulation</h2>
          <p className="text-slate-700 leading-relaxed">
            Romance scammers use a specific psychological tactic called "love bombing"—overwhelming you with attention, affection, and promises to create deep emotional dependence:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">What love bombing looks like</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Constant messaging and contact throughout the day</li>
              <li>Rapid escalation of intimacy and commitment language</li>
              <li>Promises of a future together (marriage, travel, shared home)</li>
              <li>Using pet names and intimate language very quickly</li>
              <li>Making you feel like you're the center of their world</li>
              <li>Sharing personal stories (often fabricated) to deepen trust</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The purpose of love bombing</h3>
            <p className="mt-2 text-slate-700">
              By making you feel uniquely loved and valued, the scammer creates emotional debt. You feel obligated to help them. When they later request money, saying no feels like rejecting the relationship. The stronger the emotional bond, the harder it is to refuse.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Red flag: Sudden vulnerability</h3>
            <p className="mt-2 text-slate-700">
              After building deep emotional connection, they suddenly confess a crisis: "I'm stuck overseas and need money to get home," "My business has an emergency," or "I need help paying for my mother's surgery." The crisis feels urgent and personal.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Financial Manipulation Phase</h2>
          <p className="text-slate-700 leading-relaxed">
            Once emotional investment is deep, scammers introduce financial requests. These often escalate:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common financial requests</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Money to cover travel to see you ("I can't get home to visit")</li>
              <li>Emergency medical expenses</li>
              <li>Business investment ("Help me start a business, then we can be together")</li>
              <li>Legal fees for a custody battle</li>
              <li>"Proof" of love in the form of gifts or cash transfers</li>
              <li>Money for cryptocurrency investments</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to recognize escalation</h3>
            <p className="mt-2 text-slate-700">
              The first request is small. You send it. Then there's another. Each time you help, the next crisis seems slightly larger. The scammer has learned you'll send money, so the requests grow more aggressive.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Resistance tactics</h3>
            <p className="mt-2 text-slate-700">
              When you hesitate to send more money, they may become emotional ("You don't really love me if you won't help"), disappear for a few days ("I'm upset and need space"), or introduce new "helpers" ("My lawyer/doctor/friend will explain").
            </p>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">Critical warning: Multiple parties requesting money</h3>
            <p className="mt-2 text-red-950/90">
              If the original person introduces lawyers, doctors, or "investment advisors" who also ask for money, this is almost always a scam. Legitimate professionals don't ask personal contacts for payment via wire or gift card.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Common Scam Profiles and Personas</h2>
          <p className="text-slate-700 leading-relaxed">
            Romance scammers often use specific personas because these backgrounds create plausible reasons for being unavailable or needing money:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The overseas professional</h3>
            <p className="mt-2 text-slate-700">
              Military personnel, oil rig workers, or international business professionals. The scammer uses this to explain why they can't meet in person, have poor internet, or need money sent internationally.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The successful entrepreneur</h3>
            <p className="mt-2 text-slate-700">
              A wealthy business owner looking for love. The irony: they're always having cash flow problems and need "quick loans." If they're truly wealthy, why would they ask you for money?
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The widowed parent</h3>
            <p className="mt-2 text-slate-700">
              Single parent grieving a lost spouse. This creates sympathy and a reason why they're vulnerable and need support. Real widows and widowers don't immediately pursue new relationships with money requests.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The young, attractive professional</h3>
            <p className="mt-2 text-slate-700">
              Their photos are often stolen from social media or modeling sites. If their profile photos look professionally done or too perfect, do a reverse image search.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How to Verify Someone's Identity</h2>
          <p className="text-slate-700 leading-relaxed">
            If you're uncertain about someone you've met online, here's how to verify they're real:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Request a video call</h3>
            <p className="mt-2 text-slate-700">
              Ask for a video call, not just a photo. Real people can do this. If they consistently refuse, they're not who they claim to be. When you video call, ask them to do something simple (like hold up an ID or move their hand) to prove it's live.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Reverse image search</h3>
            <p className="mt-2 text-slate-700">
              Right-click their profile photo and select "Search Image with Google" or use tineye.com. If the photos are stolen, you'll often find them on modeling sites, stock photo sites, or other people's social media.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Check their social media</h3>
            <p className="mt-2 text-slate-700">
              Ask for their Facebook, Instagram, or LinkedIn. Real people have consistent online presence. Check the profile's history, posts, and whether they have real friends and interactions. New profiles or profiles with few followers are suspicious.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Listen for inconsistencies</h3>
            <p className="mt-2 text-slate-700">
              Keep notes on what they tell you about their life. Do their stories change? Do details contradict? Do they forget what they said before? Real people's stories remain consistent.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Never send money before meeting in person</h3>
            <p className="mt-2 text-slate-700">
              This is the most important rule. If someone asks for money before you've met face-to-face, they're not interested in a genuine relationship. Full stop.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">If You Suspect You're Being Scammed</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Trust your gut, not your heart</h3>
            <p className="mt-2 text-slate-700">
              When facts and feelings conflict, believe the facts. A pattern of red flags matters more than what they say they feel. Your safety and financial security come first.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Talk to someone you trust</h3>
            <p className="mt-2 text-slate-700">
              Share the situation with a friend or family member. Scammers often tell you not to. If someone is consistently telling you to keep secrets from people who love you, that's a major red flag.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Stop the financial requests</h3>
            <p className="mt-2 text-slate-700">
              If someone you've never met in person is asking for money, stop sending it immediately. It doesn't matter if they get upset, disappear, or threaten to end the relationship. Protecting yourself is more important.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report and block</h3>
            <p className="mt-2 text-slate-700">
              Report the profile to the dating platform. Block the person on all platforms. Document evidence and file a report with the FTC (reportfraud.ftc.gov) and local police.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Important: You are not alone, and you are not stupid</h2>
          <p className="mt-3 text-amber-950/90">
            Romance scammers target kind, trusting people who are looking for genuine connection. This is not a character flaw. The shame is on the scammer, not on you. If you've been victimized, please reach out for support and report what happened.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Take Action</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if a name, photo, or username is known to scam.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report a Romance Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Document your experience and help protect others.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            If you're recovering from a romance scam, our{" "}
            <Link href="/recovery" className="font-medium text-slate-900 underline underline-offset-2">
              recovery resources
            </Link>{" "}
            can help you navigate next steps.
          </p>
        </div>
      </div>
    </div>
  );
}
