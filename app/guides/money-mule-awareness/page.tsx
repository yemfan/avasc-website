import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Money Mule Scams: How Criminals Use Innocent People to Move Money | AVASC",
  description:
    "Learn what money mule scams are, how people get recruited, the legal consequences, and what to do if you've become involved in money laundering without realizing it.",
  openGraph: {
    title: "Money Mule Scams: How Criminals Use Innocent People to Move Money | AVASC",
    description:
      "Learn what money mule scams are, how people get recruited, the legal consequences, and what to do if you've become involved.",
    type: "article",
    url: "https://avasc.org/guides/money-mule-awareness",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/money-mule-awareness",
  },
};

export default function MoneyMuleAwarenessPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Money Mule Scams: How Criminals Use Innocent People to Move Money",
    description:
      "Learn what money mule scams are and how to avoid becoming involved in money laundering.",
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
        name: "Money Mule Awareness",
        item: "https://avasc.org/guides/money-mule-awareness",
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
          Money Mule Scams: How Criminals Use Innocent People to Move Money
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Money mule scams turn ordinary people into unwitting participants in money laundering. Criminals recruit individuals to move stolen money, often by promising them work-from-home jobs or refunds. What many don't realize is that becoming a money mule can lead to serious legal consequences, even if you didn't know the money was stolen.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What Is a Money Mule?</h2>
          <p className="text-slate-700 leading-relaxed">
            A money mule is someone who moves money on behalf of criminals, often without fully understanding they're breaking the law. Money mules use their bank accounts to receive stolen funds and then transfer them to other accounts, usually for a small commission. They're part of the criminal money laundering chain.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The money laundering process</h3>
            <p className="mt-2 text-slate-700">
              Criminals steal money through fraud, ransomware, or theft. Moving stolen money directly is dangerous because banks and law enforcement track it. Instead, criminals recruit money mules to create distance between themselves and the money. The mule receives the stolen funds, takes a cut, and forwards the rest. By the time law enforcement investigates, the criminals are gone, but the mule is left with a bank account used for money laundering.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">How People Get Recruited</h2>
          <p className="text-slate-700 leading-relaxed">
            Money mule recruitment happens in multiple ways, often targeting vulnerable people:
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake job offers</h3>
            <p className="mt-2 text-slate-700">
              You see an ad for a work-from-home job that pays well and requires minimal work. The "employer" asks you to open a bank account (or use your existing one) to receive "payments from clients." Once set up, you receive money and wire it to another account, keeping a small commission. Unknown to you, the initial deposit is stolen money.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Fake refund schemes</h3>
            <p className="mt-2 text-slate-700">
              A scammer claims you're owed a refund from a company or government agency but the payment system is "down." They ask for your bank account details to "deposit the refund." You then receive deposits and are asked to wire back a portion for "processing fees." Again, the initial deposit is stolen.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Romance scams and catfishing</h3>
            <p className="mt-2 text-slate-700">
              A romantic interest you've been chatting with asks you to help them with a financial emergency. They ask you to receive money into your account and forward it to them. The money is stolen from fraud victims, and you've become part of the laundering operation.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Mystery shopper recruitment</h3>
            <p className="mt-2 text-slate-700">
              You're hired as a mystery shopper and asked to deposit funds into your account to make purchases. You keep a commission and wire the rest back. The initial deposit is stolen money.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Social media job postings</h3>
            <p className="mt-2 text-slate-700">
              Instagram, Facebook, or TikTok ads target young people with promises of easy money for "financial transfer services" or "payment processing." These are money mule operations from the start.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Warning Signs You're Being Recruited as a Money Mule</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Job offers with suspicious details</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>High pay for minimal work</li>
              <li>No real interview or training</li>
              <li>Work involves "receiving payments" and transferring money</li>
              <li>Emphasis on using your personal bank account</li>
              <li>Rapid hiring with no background check</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">The money transfer process feels off</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>You receive deposits and are immediately asked to wire funds out</li>
              <li>You're told to keep commission and forward the rest</li>
              <li>No clear explanation of who the money is from or going to</li>
              <li>You're asked to use services that can't be reversed (wire transfers, cryptocurrency)</li>
              <li>Communication is casual and vague about the actual business</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Pressure and secrecy</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>You're told not to discuss this with friends or family</li>
              <li>Time pressure to set up accounts and receive/send money quickly</li>
              <li>Vague answers when you ask questions about the business</li>
              <li>You're told this is "normal" or "how business works"</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Legal Consequences</h2>
          <p className="text-slate-700 leading-relaxed">
            This is critical: becoming a money mule is illegal, even if you didn't know the money was stolen. The law holds you responsible for what flows through your account.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Money laundering charges</h3>
            <p className="mt-2 text-slate-700">
              If you knowingly or unknowingly receive stolen money and transfer it, you can be charged with money laundering. This is a serious federal crime with penalties including 5-20 years in prison and fines up to $500,000.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Wire fraud charges</h3>
            <p className="mt-2 text-slate-700">
              Transferring stolen money via wire transfer is wire fraud, a federal crime punishable by up to 20 years in prison and fines up to $250,000.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Bank fraud charges</h3>
            <p className="mt-2 text-slate-700">
              Using your bank account to launder money is bank fraud, punishable by up to 30 years in prison and fines up to $1 million.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Civil liability</h3>
            <p className="mt-2 text-slate-700">
              Your bank may freeze or close your account. The victims of the original fraud may sue you for losses. You may face asset seizure.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Employment consequences</h3>
            <p className="mt-2 text-slate-700">
              A conviction makes it extremely difficult to find employment, get loans, rent housing, or pursue education. The felony record follows you for life.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">What to Do If You've Become a Money Mule</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Stop immediately</h3>
            <p className="mt-2 text-slate-700">
              If you suspect the money is stolen or the operation isn't legitimate, stop participating immediately. Don't transfer any more money. Don't answer calls from the recruiter.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Consult with a lawyer</h3>
            <p className="mt-2 text-slate-700">
              Before reporting or taking action, contact a criminal defense attorney. An attorney can advise you on your specific situation and how to minimize legal exposure. Some jurisdictions offer cooperation agreements where you report and cooperate with authorities in exchange for reduced charges.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to law enforcement</h3>
            <p className="mt-2 text-slate-700">
              Contact the FBI, local police, or the Secret Service. Reporting the crime and cooperating with authorities may reduce your legal exposure. Be honest about what you did and why.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report to your bank</h3>
            <p className="mt-2 text-slate-700">
              Inform your bank that you believe fraudulent activity occurred in your account. Your cooperation with the bank and authorities strengthens your case.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Document everything</h3>
            <p className="mt-2 text-slate-700">
              Save all communications (emails, texts, chats) from the recruiter. Document dates, amounts, and descriptions of what you were told and did. This evidence helps establish that you may have been deceived.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Protecting Yourself from Money Mule Recruitment</h2>

          <ul className="space-y-2 text-slate-700">
            <li>• Be skeptical of job offers that involve receiving and transferring money</li>
            <li>• Real jobs never ask you to use your personal bank account for company transactions</li>
            <li>• Legitimate employers conduct interviews and don't hire via social media ads</li>
            <li>• If an offer promises easy money for minimal work, it's likely a scam</li>
            <li>• Never accept money into your account from strangers</li>
            <li>• Be suspicious of anyone asking you to keep financial arrangements secret</li>
            <li>• Don't trust romantic interests who quickly ask for financial help or money transfers</li>
            <li>• Research any company before accepting employment (check BBB, reviews, official website)</li>
            <li>• When in doubt, ask trusted friends, family, or a financial advisor</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway</h2>
          <p className="mt-3 text-amber-950/90">
            Money mule scams target vulnerable people with promises of easy money. They're designed to make you an unwitting participant in serious crime. Even if you were deceived, participating in money laundering carries severe legal consequences. If you've become involved, consult an attorney immediately. If you're being recruited, recognize the warning signs and refuse. Your account is your responsibility, and law enforcement holds you accountable for what flows through it.
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
            <p className="mt-2 text-sm text-slate-600">Report money mule recruitment if you've encountered it.</p>
          </Link>

          <Link
            href="/recovery"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Recovery Resources</h3>
            <p className="mt-2 text-sm text-slate-600">Get support and guidance if you've been involved in money laundering.</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            If you're facing legal issues, consult with a criminal defense attorney. They can provide legal advice specific to your situation and potentially help reduce your liability.
          </p>
        </div>
      </div>
    </div>
  );
}
