import type { Metadata } from "next";
import { HomepageAlertsPanel } from "@/components/marketing/HomepageAlertsPanel";
import { HomepageHero } from "@/components/marketing/HomepageHero";
import { HomepageMissionHighlights } from "@/components/marketing/HomepageMissionHighlights";
import { getHomepageAlertSectionData } from "@/lib/alerts/avasc-alert-section-api-and-loader";

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
    url: "https://avasc.org",
    siteName: "AVASC",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const { realtimeAlerts, dailyAlerts } = await getHomepageAlertSectionData();

  return (
    <div className="space-y-10 pb-8 pt-2 sm:space-y-14 sm:pb-12 sm:pt-4">
      <HomepageHero realtimeAlerts={realtimeAlerts} dailyAlerts={dailyAlerts} />
      <HomepageAlertsPanel>
        <HomepageMissionHighlights />
      </HomepageAlertsPanel>
    </div>
  );
}
