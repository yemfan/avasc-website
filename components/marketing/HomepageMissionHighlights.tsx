import { useTranslations } from "next-intl";

/** Mission / database / alerts / trust copy for homepage lower panel (was hero sidebar). */
export function HomepageMissionHighlights() {
  const t = useTranslations("mission");
  const items = [
    { k: t("missionK"), v: t("missionV") },
    { k: t("databaseK"), v: t("databaseV") },
    { k: t("alertsK"), v: t("alertsV") },
    { k: t("trustK"), v: t("trustV") },
  ];
  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-[#050a14]/60 p-6 backdrop-blur-md sm:p-8">
      <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ k, v }) => (
          <div key={k}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--avasc-gold-light)]/90">{k}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
