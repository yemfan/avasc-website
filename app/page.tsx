import { HomepageAlertSignup } from "@/components/marketing/HomepageAlertSignup";
import { HomepageFooterSignup } from "@/components/marketing/HomepageFooterSignup";
import { AvascAlertSection } from "@/components/alerts/avasc-alert-section-components";
import { getHomepageAlertSectionData } from "@/lib/alerts/avasc-alert-section-api-and-loader";

/** Prisma-backed alert section; do not prerender without DB. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { realtimeAlerts, dailyAlerts } = await getHomepageAlertSectionData();

  return (
    <main className="min-h-screen bg-[var(--avasc-bg)] text-[var(--avasc-text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[var(--avasc-bg-soft)] to-[var(--avasc-blue)] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Association of Victims Against Cyber-Scams
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--avasc-text-secondary)]">
            Search scam patterns, report matching cases, follow active scam profiles, and stay protected with AVASC
            alerts.
          </p>
        </section>

        <div className="mt-8">
          <AvascAlertSection
            realtimeAlerts={realtimeAlerts}
            dailyAlerts={dailyAlerts}
          />
        </div>

        <div className="mt-8">
          <HomepageAlertSignup />
        </div>

        {/* other homepage sections */}

        <div className="mt-12">
          <HomepageFooterSignup />
        </div>
      </div>
    </main>
  );
}
