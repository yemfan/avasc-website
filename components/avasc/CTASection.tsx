import Link from "next/link";

const linkGoldClass =
  "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-5 py-3 text-sm font-semibold text-[var(--avasc-bg)] shadow-[0_0_20px_rgba(197,139,43,0.12)] transition duration-150 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

const linkOutlineClass =
  "inline-flex items-center justify-center rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition-colors duration-150 hover:border-[var(--avasc-gold)]/50 hover:text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

type CTASectionProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="rounded-3xl border border-[var(--avasc-border)] bg-gradient-to-br from-[var(--avasc-bg-soft)] to-[var(--avasc-blue)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] sm:p-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--avasc-text-primary)] sm:text-3xl">{title}</h2>

        <p className="mt-3 text-sm leading-7 text-[var(--avasc-text-secondary)] sm:text-base">{description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={primaryHref} className={linkGoldClass}>
            {primaryLabel}
          </Link>

          {secondaryLabel && secondaryHref ? (
            <Link href={secondaryHref} className={linkOutlineClass}>
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
