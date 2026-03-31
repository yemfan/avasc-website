import type { IndicatorType } from "@prisma/client";

export function buildClusterSummaryText(params: {
  reportCount: number;
  dominantScamType: string;
  indicatorTypes: IndicatorType[];
  maxIndicators?: number;
}): string {
  const { reportCount, dominantScamType, indicatorTypes } = params;
  const max = params.maxIndicators ?? 6;
  const types = [...new Set(indicatorTypes)].slice(0, max);
  const typeList = types.length ? types.join(", ") : "limited indicators";
  return (
    `Automated draft: ${reportCount} linked reports (${dominantScamType}). ` +
    `Repeated signal types: ${typeList}. Review before publishing.`
  );
}
