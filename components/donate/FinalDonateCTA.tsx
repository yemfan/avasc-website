import { DonateLinkButton } from "./DonateLinkButton";

export function FinalDonateCTA({
  title,
  subtitle,
  monthlyUrl,
  oneTimeUrl,
}: {
  title: string;
  subtitle: string;
  monthlyUrl: string | null;
  oneTimeUrl: string | null;
}) {
  return (
    <section className="mx-4 rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(135deg,var(--avasc-bg-soft)_0%,var(--avasc-blue)_100%)] px-6 py-12 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] sm:mx-6 md:mx-auto md:max-w-5xl md:px-10">
      <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--avasc-text-secondary)] sm:text-base">{subtitle}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <DonateLinkButton
          href={monthlyUrl ?? undefined}
          label="Donate monthly"
          variant="gold"
          className="shadow-[0_12px_40px_-12px_rgba(201,148,60,0.5)]"
        />
        <DonateLinkButton
          href={oneTimeUrl ?? undefined}
          label="One-time gift"
          variant="outline"
          className="border-white/[0.14] bg-white/[0.04] text-[var(--avasc-text-primary)] hover:border-[var(--avasc-gold)]/35"
        />
      </div>
    </section>
  );
}
