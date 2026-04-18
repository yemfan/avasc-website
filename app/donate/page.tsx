import type { Metadata } from "next";
import {
  DonateForm,
  DonateHero,
  DonationOptionCard,
  FAQItem,
  FinalDonateCTA,
  ImpactCard,
  MissionStoryBlock,
  TrustStrip,
  WhyDonateCard,
} from "@/components/donate";

export const metadata: Metadata = {
  title: "Support AVASC | Donate",
  description:
    "Support AVASC's mission to help scam victims, expand scam awareness, and build tools that prevent future fraud.",
  openGraph: {
    title: "Support AVASC | Donate",
    description:
      "Support AVASC's mission to help scam victims, expand scam awareness, and build tools that prevent future fraud.",
    type: "website",
    url: "https://avasc.org/donate",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/donate",
  },
};

const STRIPE_DONATE_URL = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL || "";
const STRIPE_MONTHLY_URL = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL || "";
const PAYPAL_DONATE_URL = process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL || "";

type DonatePageProps = {
  searchParams: Promise<{ thanks?: string | string[] }>;
};

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const sp = await searchParams;
  const thanksRaw = sp?.thanks;
  const showThanks =
    thanksRaw === "1" || (Array.isArray(thanksRaw) && thanksRaw[0] === "1");

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
        name: "Donate",
        item: "https://avasc.org/donate",
      },
    ],
  };

  return (
    <div className="min-h-0 space-y-0 pb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DonateHero
        title="Support Scam Victims. Help Stop the Next Scam."
        subtitle="Your donation helps AVASC support victims, build scam intelligence tools, and expand public awareness."
        monthlyUrl={STRIPE_MONTHLY_URL || undefined}
        oneTimeUrl={STRIPE_DONATE_URL || undefined}
      />

      <TrustStrip items={["Secure donation options", "Victim-centered mission", "Privacy and dignity first"]} />

      <section className="mx-auto max-w-2xl py-12 sm:py-14">
        <h2 className="font-display text-2xl font-medium tracking-tight text-white">Custom amount</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
          Choose one-time or monthly, then continue to our secure payment provider.
        </p>
        <div className="mt-8">
          <DonateForm showThanks={showThanks} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Your support creates real impact
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">
            Every contribution helps AVASC build better tools, support victims, and turn reported scam experiences into
            public protection.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ImpactCard amount="$25" text="Helps expand victim support resources" />
          <ImpactCard amount="$50" text="Helps review and organize scam reports" />
          <ImpactCard amount="$100" text="Helps improve scam pattern tracking" />
          <ImpactCard amount="$250" text="Helps support outreach and scam awareness efforts" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-10 sm:py-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Why donate to AVASC
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">
            Your support helps us do three things well: assist victims, organize scam intelligence, and prevent future
            harm.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <WhyDonateCard
            title="Support victims"
            text="Help people facing fraud access guidance, resources, and practical next steps."
          />
          <WhyDonateCard
            title="Build scam intelligence"
            text="Strengthen a structured database that helps people compare scam patterns and recognize warning signs."
          />
          <WhyDonateCard
            title="Prevent future harm"
            text="Turn reported experiences into education, awareness, and protection for others."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Choose how you want to give
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">
            Monthly support helps AVASC grow more steadily, while one-time gifts help fund immediate work.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <DonationOptionCard
            title="Monthly Giving"
            description="Provide steady support that helps AVASC plan, build, and assist more victims over time."
            buttonLabel="Become a Monthly Supporter"
            href={STRIPE_MONTHLY_URL || undefined}
            featured
          />
          <DonationOptionCard
            title="One-Time Donation"
            description="Make a direct contribution to support platform development and victim resources."
            buttonLabel="Donate Once"
            href={STRIPE_DONATE_URL || undefined}
          />
          <DonationOptionCard
            title="Donate with PayPal"
            description="Use PayPal if that is your preferred way to give."
            buttonLabel="Donate with PayPal"
            href={PAYPAL_DONATE_URL || undefined}
          />
        </div>
      </section>

      <MissionStoryBlock />

      <section className="mx-auto max-w-4xl py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">A few quick answers before you donate.</p>
        </div>

        <div className="space-y-4">
          <FAQItem
            question="Where does my donation go?"
            answer="Donations support AVASC’s platform development, victim support resources, scam awareness, and outreach."
          />
          <FAQItem
            question="Is my payment secure?"
            answer="Yes. Donations are processed through trusted payment providers such as Stripe and PayPal."
          />
          {/* TOM CR-003: previous answer was a dev instruction
              ("Please display the appropriate tax language based on your
              nonprofit registration and tax status") visible to donors.
              Replaced with an honest, accurate status — AVASC's 501(c)(3)
              application is pending, which means donations are NOT currently
              tax-deductible. Update this copy the moment the IRS
              determination letter arrives. */}
          <FAQItem
            question="Are donations tax-deductible?"
            answer="AVASC is a California nonprofit currently applying for IRS 501(c)(3) tax-exempt status. Until the IRS issues a determination letter, donations are not tax-deductible for federal income-tax purposes. We will update this page the moment our 501(c)(3) status is confirmed. If tax deductibility is important to you, please wait to contribute, or email give@avasc.org for the current status."
          />
          <FAQItem
            question="Does AVASC guarantee recovery?"
            answer="No. AVASC is not a law firm and does not guarantee recovery."
          />
          <FAQItem
            question="Can I give monthly?"
            answer="Yes. Monthly giving is one of the most helpful ways to support AVASC’s mission."
          />
        </div>
      </section>

      <FinalDonateCTA
        title="Help us turn pain into protection."
        subtitle="Too many scam victims face fraud alone. Your support helps build a better response."
        monthlyUrl={STRIPE_MONTHLY_URL || null}
        oneTimeUrl={STRIPE_DONATE_URL || null}
      />

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl py-8 text-sm leading-relaxed text-[var(--avasc-text-muted)]">
          Donations support AVASC’s platform development, scam awareness, victim support resources, and outreach. AVASC
          is not a law firm and does not guarantee recovery.
        </div>
      </section>
    </div>
  );
}
