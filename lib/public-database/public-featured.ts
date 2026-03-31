import type { PrismaClient } from "@prisma/client";
import { PUBLIC_CLUSTER_STATUS } from "./constants";
import { normalizePublicRiskLevel } from "./public-risk";
import type { PublicFeaturedAlert, PublicScamProfileCard } from "./public-profile-types";
import { batchDominantCaseFields, batchPublicIndicatorPreviews, getClusterDateBounds } from "./public-search-batch";

export async function getPublishedScamAlerts(prisma: PrismaClient, limit = 4): Promise<PublicFeaturedAlert[]> {
  const rows = await prisma.scamAlert.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      summary: true,
      scamType: true,
      severity: true,
      publishedAt: true,
    },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    scamType: r.scamType,
    severity: r.severity,
    publishedAt: r.publishedAt?.toISOString() ?? null,
  }));
}

export async function getRecentlyUpdatedPublicProfiles(
  prisma: PrismaClient,
  limit = 4
): Promise<PublicScamProfileCard[]> {
  const rows = await prisma.scamCluster.findMany({
    where: { publicStatus: PUBLIC_CLUSTER_STATUS },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      scamType: true,
      riskLevel: true,
      summary: true,
      updatedAt: true,
      commonScript: true,
      _count: { select: { caseLinks: true } },
    },
  });

  const ids = rows.map((r) => r.id);
  const [bounds, previews, dominants] = await Promise.all([
    getClusterDateBounds(prisma, ids),
    batchPublicIndicatorPreviews(prisma, ids, 3),
    batchDominantCaseFields(prisma, ids),
  ]);

  return rows.map((c) => {
    const n = c._count.caseLinks;
    const b = bounds.get(c.id);
    const dom = dominants.get(c.id);
    const risk = normalizePublicRiskLevel(c.riskLevel);
    const excerpt =
      c.summary.trim().length > 180 ? `${c.summary.trim().slice(0, 179)}…` : c.summary.trim();
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      scamType: c.scamType,
      riskLevel: risk,
      summaryExcerpt: excerpt || "Pattern summary available on the profile page.",
      reportCount: n,
      firstReportedAt: b?.first ?? null,
      lastReportedAt: b?.last ?? null,
      lastUpdatedAt: c.updatedAt.toISOString(),
      indicatorPreview: previews.get(c.id) ?? [],
      dominantPlatforms: dom?.platforms ?? [],
      dominantPaymentMethods: dom?.payments ?? [],
      relevanceScore: 0,
      matchTier: "browse",
    };
  });
}
