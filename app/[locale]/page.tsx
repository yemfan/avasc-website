import type { Metadata } from "next";
import { HomepageAlertsPanel } from "@/components/marketing/HomepageAlertsPanel";
import { HomepageHero } from "@/components/marketing/HomepageHero";
import { HomepageMissionHighlights } from "@/components/marketing/HomepageMissionHighlights";
import { ScamCheck } from "@/components/scam-check/ScamCheck";
import { getHomepageAlertSectionData } from "@/lib/alerts/avasc-alert-section-api-and-loader";
import { localeAlternates } from "@/lib/i18n/alternates";

/** Prisma-backed alert section; do not prerender without DB. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AVASC — Anti-scam support & reporting",
  description:
    "Association of Victims Against Cyber-Scams (AVASC): report scams, search indicators, compare patterns, and find recovery guidance — privacy-first.",
  openGraph: {
    title: "AVASC — Anti-scam support & reporting",
    description:
      "Report scams, search indicators, compare patterns, and find recovery guidance — privacy-first.",
    url: "https://www.avasc.org",
    siteName: "AVASC",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  alternates: localeAlternates("/"),
};

export default async function HomePage() {
  const { realtimeAlerts, dailyAlerts } = await getHomepageAlertSectionData();

  return (
    <div className="space-y-10 pb-8 pt-2 sm:space-y-14 sm:pb-12 sm:pt-4">
      <ScamCheck />
      <HomepageHero realtimeAlerts={realtimeAlerts} dailyAlerts={dailyAlerts} />
      <HomepageAlertsPanel>
        <HomepageMissionHighlights />
      </HomepageAlertsPanel>
    </div>
  );
}
