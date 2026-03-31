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
    <section className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-slate-50 md:px-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{subtitle}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <DonateLinkButton
          href={monthlyUrl ?? undefined}
          label="Donate Monthly"
          className="bg-white text-slate-900 hover:bg-slate-100"
        />
        <DonateLinkButton
          href={oneTimeUrl ?? undefined}
          label="One-Time Gift"
          variant="outline"
          className="border-slate-500 text-slate-100 hover:bg-slate-800"
        />
      </div>
    </section>
  );
}
