import { useTranslations } from "next-intl";
import { ArrowRight, BookOpen, Search } from "lucide-react";

import { Link } from "@/i18n/navigation";

/** slug → its title key in the `guidesIndex` namespace (reused from the index). */
const GUIDE_TITLE_KEY: Record<string, string> = {
  "how-to-identify-a-scam": "guide_identify_title",
  "what-to-do-if-youve-been-scammed": "guide_recovery_title",
  "romance-scam-warning-signs": "guide_romance_title",
  "cryptocurrency-scam-types": "guide_crypto_title",
  "investment-scam-red-flags": "guide_investment_title",
  "phishing-email-protection": "guide_phishing_title",
  "elder-fraud-prevention": "guide_elder_title",
  "social-media-scams": "guide_social_title",
  "job-scam-warning-signs": "guide_job_title",
  "tech-support-scam-protection": "guide_tech_title",
  "online-shopping-scam-prevention": "guide_shopping_title",
  "identity-theft-protection": "guide_identity_title",
  "money-mule-awareness": "guide_mule_title",
  "charity-scam-verification": "guide_charity_title",
  "business-email-compromise": "guide_bec_title",
  "sextortion-and-blackmail-scams": "guide_sextortion_title",
};

/** Curated topical adjacency (4 related per guide) for relevant internal links. */
const RELATED: Record<string, string[]> = {
  "how-to-identify-a-scam": ["what-to-do-if-youve-been-scammed", "phishing-email-protection", "social-media-scams", "investment-scam-red-flags"],
  "what-to-do-if-youve-been-scammed": ["how-to-identify-a-scam", "identity-theft-protection", "money-mule-awareness", "romance-scam-warning-signs"],
  "romance-scam-warning-signs": ["cryptocurrency-scam-types", "investment-scam-red-flags", "social-media-scams", "what-to-do-if-youve-been-scammed"],
  "cryptocurrency-scam-types": ["investment-scam-red-flags", "romance-scam-warning-signs", "money-mule-awareness", "how-to-identify-a-scam"],
  "investment-scam-red-flags": ["cryptocurrency-scam-types", "romance-scam-warning-signs", "money-mule-awareness", "how-to-identify-a-scam"],
  "phishing-email-protection": ["business-email-compromise", "identity-theft-protection", "tech-support-scam-protection", "how-to-identify-a-scam"],
  "elder-fraud-prevention": ["tech-support-scam-protection", "romance-scam-warning-signs", "how-to-identify-a-scam", "what-to-do-if-youve-been-scammed"],
  "social-media-scams": ["romance-scam-warning-signs", "online-shopping-scam-prevention", "how-to-identify-a-scam", "investment-scam-red-flags"],
  "job-scam-warning-signs": ["money-mule-awareness", "online-shopping-scam-prevention", "how-to-identify-a-scam", "what-to-do-if-youve-been-scammed"],
  "tech-support-scam-protection": ["phishing-email-protection", "elder-fraud-prevention", "identity-theft-protection", "how-to-identify-a-scam"],
  "online-shopping-scam-prevention": ["social-media-scams", "job-scam-warning-signs", "how-to-identify-a-scam", "phishing-email-protection"],
  "identity-theft-protection": ["phishing-email-protection", "what-to-do-if-youve-been-scammed", "tech-support-scam-protection", "money-mule-awareness"],
  "money-mule-awareness": ["job-scam-warning-signs", "investment-scam-red-flags", "romance-scam-warning-signs", "what-to-do-if-youve-been-scammed"],
  "charity-scam-verification": ["how-to-identify-a-scam", "online-shopping-scam-prevention", "social-media-scams", "what-to-do-if-youve-been-scammed"],
  "business-email-compromise": ["phishing-email-protection", "identity-theft-protection", "tech-support-scam-protection", "how-to-identify-a-scam"],
  "sextortion-and-blackmail-scams": ["social-media-scams", "romance-scam-warning-signs", "how-to-identify-a-scam", "what-to-do-if-youve-been-scammed"],
};

const FALLBACK = ["how-to-identify-a-scam", "what-to-do-if-youve-been-scammed", "romance-scam-warning-signs", "phishing-email-protection"];

/**
 * "Related guides" footer for guide articles — cross-links each guide to 4
 * topically-related guides + the guides index + the scam database. Improves
 * internal linking so Google crawls and prioritizes the deep pages.
 */
export function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("related");
  const g = useTranslations("guidesIndex");
  const related = (RELATED[currentSlug] ?? FALLBACK)
    .filter((s) => s !== currentSlug && GUIDE_TITLE_KEY[s])
    .slice(0, 4);

  return (
    <section className="mt-12 border-t border-[var(--avasc-border)] pt-8">
      <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((slug) => (
          <Link
            key={slug}
            href={`/guides/${slug}`}
            className="group flex items-center gap-3 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-4 transition-colors hover:border-[var(--avasc-gold-light)]"
          >
            <BookOpen className="h-4 w-4 shrink-0 text-[var(--avasc-gold-light)]" aria-hidden />
            <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{g(GUIDE_TITLE_KEY[slug])}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--avasc-text-muted)] transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/guides" className="inline-flex items-center gap-1.5 font-medium text-[var(--avasc-gold-light)] hover:text-[var(--avasc-gold)]">
          <BookOpen className="h-4 w-4" aria-hidden />
          {t("allGuides")}
        </Link>
        <Link href="/database" className="inline-flex items-center gap-1.5 font-medium text-[var(--avasc-gold-light)] hover:text-[var(--avasc-gold)]">
          <Search className="h-4 w-4" aria-hidden />
          {t("database")}
        </Link>
      </div>
    </section>
  );
}
