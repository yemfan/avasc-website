import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/alternates";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("donate");
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://www.avasc.org/donate",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
    alternates: localeAlternates("/donate"),
  };
}

const STRIPE_DONATE_URL = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL || "";
const STRIPE_MONTHLY_URL = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL || "";
const PAYPAL_DONATE_URL = process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL || "";

type DonatePageProps = {
  searchParams: Promise<{ thanks?: string | string[] }>;
};

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const t = await getTranslations("donate");
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
        item: "https://www.avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Donate",
        item: "https://www.avasc.org/donate",
      },
    ],
  };

  return (
    <div className="min-h-0 space-y-0 pb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DonateHero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        monthlyUrl={STRIPE_MONTHLY_URL || undefined}
      />

      <TrustStrip items={[t("trust1"), t("trust2"), t("trust3")]} />

      <section id="donate-form" className="mx-auto max-w-2xl scroll-mt-24 py-12 sm:py-14">
        <h2 className="font-display text-2xl font-medium tracking-tight text-white">{t("customAmountTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
          {t("customAmountBody")}
        </p>
        <div className="mt-8">
          <DonateForm showThanks={showThanks} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t("impactTitle")}
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">
            {t("impactBody")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ImpactCard amount="$25" text={t("impact25")} />
          <ImpactCard amount="$50" text={t("impact50")} />
          <ImpactCard amount="$100" text={t("impact100")} />
          <ImpactCard amount="$250" text={t("impact250")} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-10 sm:py-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t("whyTitle")}
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">
            {t("whyBody")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <WhyDonateCard
            title={t("why1Title")}
            text={t("why1Body")}
          />
          <WhyDonateCard
            title={t("why2Title")}
            text={t("why2Body")}
          />
          <WhyDonateCard
            title={t("why3Title")}
            text={t("why3Body")}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t("chooseTitle")}
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">
            {t("chooseBody")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <DonationOptionCard
            title={t("optMonthlyTitle")}
            description={t("optMonthlyBody")}
            buttonLabel={t("optMonthlyCta")}
            href={STRIPE_MONTHLY_URL || undefined}
            featured
          />
          <DonationOptionCard
            title={t("optOneTimeTitle")}
            description={t("optOneTimeBody")}
            buttonLabel={t("optOneTimeCta")}
            href={STRIPE_DONATE_URL || "#donate-form"}
          />
          <DonationOptionCard
            title={t("optPaypalTitle")}
            description={t("optPaypalBody")}
            buttonLabel={t("optPaypalCta")}
            href={PAYPAL_DONATE_URL || undefined}
          />
        </div>
      </section>

      <MissionStoryBlock />

      <section className="mx-auto max-w-4xl py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t("faqTitle")}
          </h2>
          <p className="mt-3 text-[var(--avasc-text-secondary)]">{t("faqBody")}</p>
        </div>

        <div className="space-y-4">
          <FAQItem
            question={t("faq1Q")}
            answer={t("faq1A")}
          />
          <FAQItem
            question={t("faq2Q")}
            answer={t("faq2A")}
          />
          {/* TOM CR-003: previous answer was a dev instruction
              ("Please display the appropriate tax language based on your
              nonprofit registration and tax status") visible to donors.
              Replaced with an honest, accurate status — AVASC's 501(c)(3)
              application is pending, which means donations are NOT currently
              tax-deductible. Update this copy the moment the IRS
              determination letter arrives. */}
          <FAQItem
            question={t("faq3Q")}
            answer={t("faq3A")}
          />
          <FAQItem
            question={t("faq4Q")}
            answer={t("faq4A")}
          />
          <FAQItem
            question={t("faq5Q")}
            answer={t("faq5A")}
          />
        </div>
      </section>

      <FinalDonateCTA
        title={t("finalCtaTitle")}
        subtitle={t("finalCtaSubtitle")}
        monthlyUrl={STRIPE_MONTHLY_URL || null}
        oneTimeUrl={STRIPE_DONATE_URL || "#donate-form"}
      />

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl py-8 text-sm leading-relaxed text-[var(--avasc-text-muted)]">
          {t("disclaimer")}
        </div>
      </section>
    </div>
  );
}
