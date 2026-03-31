import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  copyPublicIndicatorsCardHint,
  formatPublicActivityRange,
  indicatorTypeLabel,
  phraseReportsTiedToPatternLine,
} from "@/lib/public-database/public-indicator-display";
import type { PublicScamProfileCard as CardModel } from "@/lib/public-database/public-profile-types";
import { ArrowRight, CalendarRange } from "lucide-react";
import { RiskBadge } from "./RiskBadge";
import { ScamTypeBadge } from "./ScamTypeBadge";

export function ScamProfileCard({ profile }: { profile: CardModel }) {
  return (
    <Card className="flex flex-col border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <ScamTypeBadge scamType={profile.scamType} />
          <RiskBadge level={profile.riskLevel} />
        </div>
        <Link href={`/database/${profile.slug}`} className="group block">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:underline">
            {profile.title}
          </h2>
        </Link>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{profile.summaryExcerpt}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-0 text-sm text-slate-600">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="text-slate-700">{phraseReportsTiedToPatternLine(profile.reportCount)}</span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <CalendarRange className="h-4 w-4 shrink-0" aria-hidden />
            {formatPublicActivityRange(profile.firstReportedAt, profile.lastReportedAt)}
          </span>
        </div>
        {(profile.dominantPlatforms.length > 0 || profile.dominantPaymentMethods.length > 0) && (
          <div>
            <p className="text-xs font-medium text-slate-500">Often seen in reports (general themes, not proof)</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
              {profile.dominantPlatforms.slice(0, 2).map((p) => (
                <span key={p} className="rounded-full bg-slate-100 px-2 py-0.5">
                  {p}
                </span>
              ))}
              {profile.dominantPaymentMethods.slice(0, 2).map((p) => (
                <span key={p} className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-950">
                  Payment type: {p}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.indicatorPreview.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500">{copyPublicIndicatorsCardHint()}</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-snug text-slate-800">
              {profile.indicatorPreview.map((row, i) => (
                <li key={`${row.type}-${i}`}>
                  <span className="text-slate-600">{indicatorTypeLabel(row.type)}:</span>{" "}
                  <span className="break-words">{row.displayValue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-slate-100 pt-4">
        <Link
          href={`/database/${profile.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
        >
          Read the full pattern
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </CardFooter>
    </Card>
  );
}
