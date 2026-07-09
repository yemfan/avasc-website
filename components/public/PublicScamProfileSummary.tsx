import { useTranslations } from "next-intl";

import type { PublicScamProfile } from "@/lib/public-database/public-scam-profile-types";

export function PublicScamProfileSummary({ profile }: { profile: PublicScamProfile }) {
  const t = useTranslations("database");
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{t("summary")}</h2>
      <div className="max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p className="text-base text-foreground">{profile.summary}</p>

        {profile.commonScript?.trim() ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("whatPeopleReport")}</p>
            <p className="mt-2 text-sm text-foreground">{profile.commonScript}</p>
          </div>
        ) : null}

        {profile.redFlags?.trim() ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("warningSigns")}</p>
            <p className="mt-2 whitespace-pre-wrap text-foreground">{profile.redFlags}</p>
          </div>
        ) : null}

        {profile.safetyWarning?.trim() ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100"
          >
            <p className="font-semibold">{t("safetyWarning")}</p>
            <p className="mt-2">{profile.safetyWarning}</p>
          </div>
        ) : null}

        {profile.recommendedNextStep?.trim() ? (
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("suggestedNextSteps")}</p>
            <p className="mt-2 text-foreground">{profile.recommendedNextStep}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
