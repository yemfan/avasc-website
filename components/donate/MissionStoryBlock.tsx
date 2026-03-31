import { Card } from "@/components/ui/card";

export function MissionStoryBlock() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <Card className="border-slate-200 p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Our mission</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Built from real victim experiences</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          AVASC started with a simple goal: make sure people facing scams have somewhere calm, practical, and
          trustworthy to turn. We focus on tools and guidance that reduce isolation, organize evidence, and help prevent
          repeat harm.
        </p>
      </Card>
    </section>
  );
}
