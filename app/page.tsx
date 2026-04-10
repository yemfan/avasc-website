import { HomepageAlertsPanel } from "@/components/marketing/HomepageAlertsPanel";
import { HomepageHero } from "@/components/marketing/HomepageHero";
import { HomepageMissionHighlights } from "@/components/marketing/HomepageMissionHighlights";
import { getHomepageAlertSectionData } from "@/lib/alerts/avasc-alert-section-api-and-loader";

/** Prisma-backed alert section; do not prerender without DB. */
export const dynamic = "force-dynamic";

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
