"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AvascAlertSection } from "@/components/marketing/AvascAlertSection";
import { HomepageAlertSignup } from "@/components/marketing/HomepageAlertSignup";
import type { AlertItem } from "@/components/marketing/AvascAlertSection";

type HomepageAlertsPanelProps = {
  realtimeAlerts: AlertItem[];
  dailyAlerts: AlertItem[];
};

/**
 * Homepage-only: one card with realtime ticker + daily alert cards, and a single
 * subscribe control that reveals the full signup form on demand.
 */
export function HomepageAlertsPanel({ realtimeAlerts, dailyAlerts }: HomepageAlertsPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const formRegionId = useId();

  return (
    <section
      id="alerts-news"
      className="relative overflow-hidden scroll-mt-24 rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,var(--avasc-bg-soft)_0%,#0a1628_40%,var(--avasc-blue)_100%)] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] sm:p-8 lg:p-10"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(201, 148, 60, 0.12), transparent 55%)",
        }}
      />

      <div className="relative space-y-8">
        <AvascAlertSection
          realtimeAlerts={realtimeAlerts}
          dailyAlerts={dailyAlerts}
          hideSubscribeCta
          title="Realtime alerts & daily news"
          subtitle="Critical warnings as they surface, plus staff-reviewed daily highlights. Indicators are public-safe; follow links for full profiles."
        />

        <div className="border-t border-white/[0.08] pt-8">
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              aria-expanded={formOpen}
              aria-controls={formRegionId}
              onClick={() => setFormOpen((o) => !o)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-6 py-3.5 text-sm font-semibold text-[#050A14] shadow-[0_12px_40px_-12px_rgba(201,148,60,0.5)] transition hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]"
            >
              {formOpen ? "Hide subscription form" : "Subscribe to alerts & daily news"}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${formOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            {formOpen ? (
              <div id={formRegionId} className="w-full max-w-3xl">
                <p className="mb-4 text-center text-sm text-[var(--avasc-text-secondary)]">
                  SMS for critical alerts; email for daily or weekly digests. Unsubscribe anytime.
                </p>
                <HomepageAlertSignup embedded />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
