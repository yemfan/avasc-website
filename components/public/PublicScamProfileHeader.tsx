import Link from "next/link";
import { useTranslations } from "next-intl";
import { CalendarRange, Shield } from "lucide-react";
import { RiskBadge } from "@/components/public-database/RiskBadge";
import { ScamTypeBadge } from "@/components/public-database/ScamTypeBadge";
import { formatPublicActivityRange } from "@/lib/public-database/public-indicator-display";
import { normalizePublicRiskLevel } from "@/lib/public-database/public-risk";
import type { PublicScamProfile } from "@/lib/public-database/public-scam-profile-types";

export function PublicScamProfileHeader({ profile }: { profile: PublicScamProfile }) {
  const t = useTranslations("database");
  const risk = normalizePublicRiskLevel(profile.riskLevel);
  const first = profile.firstReportedAt?.toISOString() ?? null;
  const last = profile.latestReportedAt?.toISOString() ?? null;

  return (
    <header className="space-y-4 border-b border-border pb-8">
      <nav className="text-sm text-muted-foreground">
        <Link href="/database" className="font-medium text-foreground hover:underline">
          {t("breadcrumbDb")}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span>{t("breadcrumbPattern")}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        <ScamTypeBadge scamType={profile.scamType} />
        <RiskBadge level={risk} />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{profile.title}</h1>

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {t.rich("patternBlurb", {
          b: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
        })}
      </p>

      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 shrink-0" aria-hidden />
          <dt className="sr-only">{t("reportsLinked", { count: profile.reportCount })}</dt>
          <dd>{t("reportsLinked", { count: profile.reportCount })}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 shrink-0" aria-hidden />
          <dd>{t("reportingWindow", { range: formatPublicActivityRange(first, last) })}</dd>
        </div>
      </dl>
    </header>
  );
}
