import type { PrismaClient } from "@prisma/client";
import type { IndicatorType } from "@prisma/client";
import { PUBLIC_CLUSTER_STATUS } from "./constants";
import { buildPublicPatternSummary } from "./public-aggregates";
import {
  canShowCaseIndicatorPublic,
  getPublicIndicatorDisplayValue,
  indicatorTypeLabel,
} from "./public-indicator-display";
import { normalizePublicRiskLevel } from "./public-risk";
import { getRelatedPublicClusters } from "./public-related-clusters";
import type { PublicIndicatorGroup, PublicIndicatorRow, PublicScamProfileDetail } from "./public-profile-types";

/** Never select `rawValue` or case PII for public aggregation — only normalized `value` + public flags. */

function splitRedFlags(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 24);
}

/**
 * Public-safe indicators for a published cluster, grouped and deduped.
 */
export async function getPublicClusterIndicators(
  prisma: PrismaClient,
  clusterId: string
): Promise<PublicIndicatorGroup[]> {
  const rows = await prisma.caseIndicator.findMany({
    where: {
      case: { clusterLinks: { some: { scamClusterId: clusterId } } },
    },
    select: { indicatorType: true, normalizedValue: true, isPublic: true, caseId: true },
  });

  const grouped = new Map<IndicatorType, Map<string, Set<string>>>();

  for (const r of rows) {
    if (!canShowCaseIndicatorPublic(r)) continue;
    const g = grouped.get(r.indicatorType) ?? new Map<string, Set<string>>();
    if (!grouped.has(r.indicatorType)) grouped.set(r.indicatorType, g);
    const byVal = g.get(r.normalizedValue) ?? new Set<string>();
    if (!g.has(r.normalizedValue)) g.set(r.normalizedValue, byVal);
    byVal.add(r.caseId);
  }

  const order: IndicatorType[] = [
    "WALLET",
    "DOMAIN",
    "TX_HASH",
    "EMAIL",
    "PHONE",
    "SOCIAL_HANDLE",
    "ALIAS",
    "PLATFORM",
    "COMPANY_NAME",
    "BANK_ACCOUNT",
  ];

  const groups: PublicIndicatorGroup[] = [];
  for (const type of order) {
    const g = grouped.get(type);
    if (!g) continue;
    const items: PublicIndicatorRow[] = [...g.entries()]
      .map(([value, caseIds]) => ({
        type,
        displayValue: getPublicIndicatorDisplayValue({
          indicatorType: type,
          normalizedValue: value,
          displayValue: null,
          isPublic: true,
        }),
        caseCount: caseIds.size,
      }))
      .sort((a, b) => b.caseCount - a.caseCount || a.displayValue.localeCompare(b.displayValue));

    if (items.length === 0) continue;
    groups.push({
      type,
      label: indicatorTypeLabel(type),
      items,
    });
  }

  return groups;
}

export async function getPublicScamProfileDetailBySlug(
  prisma: PrismaClient,
  slug: string
): Promise<PublicScamProfileDetail | null> {
  const cluster = await prisma.scamCluster.findFirst({
    where: { slug, publicStatus: PUBLIC_CLUSTER_STATUS },
    select: { id: true },
  });
  if (!cluster) return null;
  return buildPublicClusterProfile(prisma, cluster.id);
}

export async function buildPublicClusterProfile(
  prisma: PrismaClient,
  clusterId: string
): Promise<PublicScamProfileDetail | null> {
  const cluster = await prisma.scamCluster.findFirst({
    where: { id: clusterId, publicStatus: PUBLIC_CLUSTER_STATUS },
    select: {
      id: true,
      slug: true,
      title: true,
      scamType: true,
      riskLevel: true,
      summary: true,
      updatedAt: true,
      commonScript: true,
      redFlags: true,
      safetyWarning: true,
      recommendedNextStep: true,
    },
  });
  if (!cluster) return null;

  const reportCount = await prisma.scamClusterCase.count({ where: { scamClusterId: cluster.id } });
  const pattern = await buildPublicPatternSummary(prisma, cluster.id, cluster.commonScript);
  const indicatorGroups = await getPublicClusterIndicators(prisma, cluster.id);
  const relatedProfiles = await getRelatedPublicClusters(cluster.id, 6);

  const why =
    "This profile summarizes independently reported cases that AVASC staff grouped because they share the same tactics, channels, or identifiers. It is not legal advice and does not name victims.";

  return {
    id: cluster.id,
    slug: cluster.slug,
    title: cluster.title,
    scamType: cluster.scamType,
    riskLevel: normalizePublicRiskLevel(cluster.riskLevel),
    summary: cluster.summary.trim() || "Summary pending — see pattern details and public indicators below.",
    reportCount,
    firstReportedAt: pattern.firstReportedAt,
    lastReportedAt: pattern.lastReportedAt,
    lastUpdatedAt: cluster.updatedAt.toISOString(),
    whyThisProfileExists: why,
    commonVictimExperience: cluster.commonScript,
    redFlags: splitRedFlags(cluster.redFlags),
    safetyWarning: cluster.safetyWarning,
    recommendedNextStep: cluster.recommendedNextStep,
    indicatorGroups,
    pattern: {
      reportCount,
      firstReportedAt: pattern.firstReportedAt,
      lastReportedAt: pattern.lastReportedAt,
      dominantPaymentMethods: pattern.dominantPaymentMethods,
      dominantPlatforms: pattern.dominantPlatforms,
      dominantCountries: pattern.dominantCountries,
      commonScript: cluster.commonScript,
    },
    relatedProfiles,
  };
}

export { getPublicScamProfileBySlug } from "./get-public-scam-profile";
