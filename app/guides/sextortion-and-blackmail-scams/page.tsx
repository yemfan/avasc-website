import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sextortion and Online Blackmail: What to Do and How to Get Help | AVASC",
  description:
    "Learn about sextortion scams, why you shouldn't pay, how to report, and where to find emotional support. Guidance for victims and those protecting minors.",
  openGraph: {
    title: "Sextortion and Online Blackmail: What to Do and How to Get Help | AVASC",
    description:
      "Learn about sextortion scams, how to report them, and where to find support.",
    type: "article",
    url: "https://avasc.org/guides/sextortion-and-blackmail-scams",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/sextortion-and-blackmail-scams",
  },
};

export default function SextortionAndBlackmailScamsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sextortion and Online Blackmail: What to Do and How to Get Help",
    description:
      "Learn about sextortion scams and how to respond if you've been targeted.",
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
        name: "Sextortion and Blackmail Scams",
        item: "https://avasc.org/guides/sextortion-and-blackmail-scams",
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
          Sextortion and Online Blackmail: What to Do and How to Get Help
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Sextortion is an extraordinarily distressing scam that uses shame and fear as weapons. If you or someone you know is targeted, know this: the shame belongs to the scammer, not to you. There is help available, and you don't have to pay. This guide provides straightforward information about what to do.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What Is Sextortion?</h2>
          <p className="text-slate-700 leading-relaxed">
            Sextortion is a form of blackmail where scammers threaten to expose intimate images or compromising information unless you pay them. The scammers claim to have recorded explicit video of you, hacked your webcam, or obtained explicit photos. They threaten to send this content to your contacts, publish it online, or alert your employer.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">An important truth</h3>
            <p className="mt-2 text-slate-700">
              In the vast majority of sextortion cases, the scammers do NOT actually have videos or photos of you. This is a bluff designed to create panic. They send generic threats, often obtained from data breaches (your email appears in the message to make it seem credible). Even if they have your actual photos, paying them won't stop them, and it signals you'll pay more demands later.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How Sextortion Scams Work</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Mass threats via email</h3>
            <p className="mt-2 text-slate-700">
              The most common form: You receive an email claiming the sender has compromising video or photos of you. The email includes your email address or password (obtained from a data breach) to seem credible. It demands payment (usually $1,000-$5,000 in cryptocurrency) or threatens to send the content to your contacts. These emails are sent to millions of people.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Social media extortion</h3>
            <p className="mt-2 text-slate-700">
              Someone adds you on social media, builds a relationship, then asks for intimate photos. Once you send them, they threaten to post them publicly or send them to your friends unless you pay. This is particularly common with attractive profiles used as lures.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Dating app sextortion</h3>
            <p className="mt-2 text-slate-700">
              A match on a dating app moves conversation to a private platform quickly, then asks you to video chat. During the chat, they claim to record you in compromising moments. They then demand payment or threaten to post on social media or send to your contacts.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Direct messaging sextortion</h3>
            <p className="mt-2 text-slate-700">
              A scammer messages you on Instagram, Facebook, or other platforms claiming to have video of you. They may reference real details about your life (job, location, interests) found through social media stalking to seem credible.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Why You Should NEVER Pay</h2>
          <p className="text-slate-700 leading-relaxed">
            This is critical: paying will not help you. Here's why:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">They'll ask for more money</h3>
            <p className="mt-2 text-slate-700">
              Paying once proves you'll pay again. Scammers will continue demanding more money, threatening you repeatedly. Each payment escalates the demands. You'll be trapped in a cycle of extortion.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Scammers typically don't have evidence</h3>
            <p className="mt-2 text-slate-700">
              In most cases, they're bluffing. They use generic threats sent to millions of people. The inclusion of your email or a password from an old breach doesn't mean they have compromising content—it just means you're in a data leak. They're betting you'll panic and pay.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-latex-700">Even if they have something, payment won't stop it</h3>
            <p className="mt-2 text-slate-700">
              If they do have intimate content, paying them won't guarantee they delete it or stop using it. You have no control and no recourse. Paying just makes you a victim of continued exploitation.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-700">You're funding criminal operations</h3>
            <p className="mt-2 text-slate-700">
              Paying supports organized crime networks that victimize thousands of people. The money funds further scams and exploitation.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You've Been Targeted</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">1. Don't pay</h3>
            <p className="mt-2 text-slate-700">
              This is the most important step. Do not transfer money, buy gift cards, or send cryptocurrency. Paying will make things worse, not better.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">2. Stop communicating with the scammer</h3>
            <p className="mt-2 text-slate-700">
              Don't respond to messages, don't negotiate, don't ask them to delete content. Communication signals that the account is active and might lead to more demands. Block the sender immediately.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">3. Report to the platform</h3>
            <p className="mt-2 text-slate-700">
              If the extortion came via email, report it as phishing/extortion. If via social media, report the profile. If via dating app, report and block. Most platforms have teams that investigate and remove scam profiles.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">4. Save the evidence</h3>
            <p className="mt-2 text-slate-700">
              Take screenshots of the threatening messages, the sender's profile, and any demands. Save these before reporting (reporting may delete the messages).
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">5. Report to law enforcement</h3>
            <p className="mt-2 text-slate-700">
              File a report with your local police department and the FBI's Internet Crime Complaint Center (IC3) at ic3.gov. Include the screenshots, sender information, and any other details. Law enforcement is taking sextortion seriously and actively investigating.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">6. Secure your accounts</h3>
            <p className="mt-2 text-slate-700">
              Change passwords on compromised accounts, especially email. Enable two-factor authentication. Check account activity for unauthorized access. If your password was in a breach, update it everywhere you've used it.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">7. Consider telling a trusted person</h3>
            <p className="mt-2 text-slate-700">
              Telling someone—a friend, family member, counselor, or therapist—can reduce the shame and anxiety. They can provide support and help you see the situation clearly. Scammers rely on your silence and shame. Breaking that silence reduces their power.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Special Guidance for Minors and Parents</h2>
          <p className="text-slate-700 leading-relaxed">
            If you're a minor being sextorted, or a parent concerned about a minor:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">For minors</h3>
            <p className="mt-2 text-slate-700">
              You are not in trouble. This is not your fault, even if you sent intimate photos willingly. The scammer is committing a crime by threatening you. Tell a trusted adult—a parent, counselor, teacher, or call a helpline. You deserve support, and adults who care about you won't blame you.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">For parents</h3>
            <p className="mt-2 text-slate-700">
              If your child is being sextorted, respond with compassion, not anger. They're victims of a serious crime. Listen without judgment, reassure them they're not in trouble, and help them take the steps above. Report to law enforcement and consider involving a counselor. Organizations like the National Center for Missing & Exploited Children (NCMEC) provide resources for minors being exploited.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Resources for minors</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>CyberTipline: cybertipline.org (report exploitation)</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Thorn: thorn.org (specialized in child exploitation)</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Emotional Support and Recovery</h2>
          <p className="text-slate-700 leading-relaxed">
            Sextortion is psychologically devastating. Victims often experience shame, anxiety, depression, and feel isolated. Professional support can help:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Therapy and counseling</h3>
            <p className="mt-2 text-slate-700">
              A therapist experienced in trauma or online abuse can help you process the experience and recover. Many therapists offer online sessions, making it accessible. Your insurance may cover mental health care.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Support hotlines</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>National Sexual Assault Hotline: 1-800-656-4673 (confidential)</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Cybercivil Rights Initiative: cybercivilrights.org</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Online support communities</h3>
            <p className="mt-2 text-slate-700">
              Many online communities connect sextortion victims who understand the experience and can provide mutual support. Knowing you're not alone can be powerful.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Remember: This is not your fault</h3>
            <p className="mt-2 text-slate-700">
              Whether you were deceived, coerced, or your information was stolen, the blame belongs to the scammer. Victims of sextortion are not responsible for the criminal's actions. You deserve compassion—especially from yourself.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Protecting Yourself from Sextortion</h2>

          <ul className="space-y-2 text-slate-700">
            <li>• Be cautious about sharing intimate photos or videos with anyone, even people you trust</li>
            <li>• Be skeptical of attractive profiles that move quickly to intimate conversations</li>
            <li>• Never video chat with people you've just met online, especially if they ask you to remove clothing</li>
            <li>• Use strong, unique passwords for all accounts</li>
            <li>• Enable two-factor authentication on social media and email</li>
            <li>• Limit what personal information is visible on your social media profiles</li>
            <li>• Don't click links from unknown senders</li>
            <li>• Be cautious of "romance scammers" who build relationships quickly online</li>
            <li>• If something feels off, it probably is—trust your instincts</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            If you're being sextorted, know this: you are not alone, you are not at fault, and you don't have to pay. The shame belongs to the scammer, not to you. Report to law enforcement, block the scammer, and reach out for support. Professional help is available, and recovery is possible. You will get through this.
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
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report to AVASC</h3>
            <p className="mt-2 text-sm text-slate-600">Report sextortion and help protect others.</p>
          </Link>

          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Recovery Resources</h3>
            <p className="mt-2 text-sm text-slate-600">Access support and guidance for recovery.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <p className="text-sm text-slate-600">
            <strong>Crisis support (if you're in immediate distress):</strong>
          </p>
          <p className="text-sm text-slate-600">
            Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong><br />
            National Suicide Prevention Lifeline: <strong>988</strong><br />
            These services are free, confidential, and available 24/7.
          </p>
        </div>
      </div>
    </div>
  );
}
