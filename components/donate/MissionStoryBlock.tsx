import { Card } from "@/components/ui/card";

export function MissionStoryBlock() {
  return (
    <section className="mx-auto max-w-7xl py-10 sm:py-12">
      <Card className="border-white/[0.08] bg-[var(--avasc-bg-card)]/85 p-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--avasc-gold-light)]">Our mission</p>
        <h2 className="font-display mt-3 text-2xl font-medium tracking-tight text-white md:text-3xl">
          Built from real victim experiences
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
          AVASC exists so people facing scams have somewhere calm, practical, and trustworthy to turn. We focus on tools
          and guidance that reduce isolation, organize evidence, and help prevent repeat harm.
        </p>
      </Card>
    </section>
  );
}
