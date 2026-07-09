import type { Metadata } from "next";
import { SubscriptionForm } from "@/components/alerts/SubscriptionForm";

export const metadata: Metadata = {
  title: "Subscribe to alerts",
  description:
    "Subscribe to AVASC realtime scam alerts by SMS and daily or weekly scam intelligence digests by email.",
};

export default function AlertSubscribePage() {
  return (
    <div className="min-h-screen bg-[var(--avasc-bg)] text-[var(--avasc-text-primary)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[var(--avasc-bg-soft)] to-[var(--avasc-blue)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
          <div className="inline-flex rounded-full border border-[rgba(197,139,43,0.35)] bg-[rgba(197,139,43,0.08)] px-3 py-1 text-xs font-semibold text-[var(--avasc-gold-light)]">
            AVASC Alert Network
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay Protected in Real Time
          </h1>

          <p className="mt-4 text-base leading-7 text-[var(--avasc-text-secondary)]">
            Subscribe to AVASC realtime scam alerts by text message, and receive daily or weekly scam intelligence
            digests by email.
          </p>
        </section>

        <div className="mt-8">
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
}
