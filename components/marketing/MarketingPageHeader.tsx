import { cn } from "@/lib/utils/cn";

const eyebrowClass =
  "inline-flex items-center gap-2 rounded-full border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.08] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--avasc-gold-light)]";

type MarketingPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

/** Consistent hero block for public inner pages (database, report, etc.). */
export function MarketingPageHeader({ eyebrow, title, description, className }: MarketingPageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(135deg,var(--avasc-bg-soft)_0%,#0a1628_45%,var(--avasc-blue)_100%)] p-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] sm:p-10",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 100% 0%, rgba(201, 148, 60, 0.12), transparent 50%)",
        }}
      />
      <div className="relative">
        <p className={eyebrowClass}>{eyebrow}</p>
        <h1 className="font-display mt-5 text-[2rem] font-medium leading-[1.15] tracking-tight text-white sm:text-4xl sm:leading-[1.12] lg:text-[2.75rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--avasc-text-secondary)] sm:text-lg sm:leading-8">
          {description}
        </p>
      </div>
    </header>
  );
}
