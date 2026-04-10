import { Check } from "lucide-react";

type TrustStripProps = {
  items: string[];
};

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <section className="border-b border-white/[0.06] bg-[var(--avasc-bg-card)]/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-10 sm:px-6 lg:px-8">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-center gap-2 text-center text-sm font-medium text-[var(--avasc-text-secondary)]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--avasc-gold)]/15 text-[var(--avasc-gold-light)]">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
