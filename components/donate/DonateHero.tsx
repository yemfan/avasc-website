import { DonateLinkButton } from "./DonateLinkButton";

type DonateHeroProps = {
  title: string;
  subtitle: string;
  monthlyUrl?: string;
  oneTimeUrl?: string;
};

export function DonateHero({ title, subtitle, monthlyUrl, oneTimeUrl }: DonateHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[linear-gradient(165deg,var(--avasc-bg-soft)_0%,#0a1628_40%,var(--avasc-blue)_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(201, 148, 60, 0.14), transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="inline-flex rounded-full border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.08] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--avasc-gold-light)]">
          Support AVASC
        </p>
        <h1 className="font-display mx-auto mt-6 max-w-4xl text-[2rem] font-medium leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.08]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--avasc-text-secondary)] sm:text-lg sm:leading-8">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <DonateLinkButton
            href={monthlyUrl}
            label="Become a monthly supporter"
            variant="gold"
            className="min-w-[220px] shadow-[0_12px_40px_-12px_rgba(201,148,60,0.5)]"
          />
          <DonateLinkButton
            href={oneTimeUrl}
            label="One-time gift"
            variant="outline"
            className="min-w-[220px] border-white/[0.14] bg-white/[0.03] text-[var(--avasc-text-primary)] hover:border-[var(--avasc-gold)]/35 hover:bg-white/[0.06]"
          />
        </div>

        {/* TOM CR-002: the previous fallback copy exposed dev env-var names
            ("Configure NEXT_PUBLIC_STRIPE_*") to production visitors. That's
            both a trust hit and a minor info leak. The user-visible copy is
            now a warm "processors are being set up" message; dev configuration
            reminders live only in the build log. */}
        {(!monthlyUrl || !oneTimeUrl) && (
          <p className="mt-6 text-sm text-[var(--avasc-text-muted)]">
            Online donations are being set up. In the meantime, email{" "}
            <a
              href="mailto:give@avasc.org"
              className="underline decoration-[var(--avasc-gold)]/60 underline-offset-4 hover:text-[var(--avasc-gold-light)]"
            >
              give@avasc.org
            </a>{" "}
            and we&apos;ll share a way to contribute directly.
          </p>
        )}
      </div>
    </section>
  );
}
