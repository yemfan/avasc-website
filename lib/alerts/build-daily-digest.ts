import type { PrismaClient } from "@prisma/client";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000").replace(/\/$/, "");
}

export type BuildDailyDigestResult = {
  subject: string;
  html: string;
  /** Clusters returned by the query (up to 10). */
  clusterCount: number;
};

/**
 * Builds daily digest HTML from recently updated published clusters (rich cards + public indicators).
 */
export async function buildDailyDigest(prisma: PrismaClient): Promise<BuildDailyDigestResult> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const baseUrl = appBaseUrl();

  const clusters = await prisma.scamCluster.findMany({
    where: {
      updatedAt: { gte: since },
      publicStatus: PUBLIC_CLUSTER_STATUS,
    },
    orderBy: [{ threatScore: "desc" }, { updatedAt: "desc" }],
    take: 10,
    include: {
      indicatorAggregates: {
        where: { isPublic: true },
        orderBy: [{ isVerified: "desc" }, { linkedCaseCount: "desc" }],
        take: 3,
      },
      _count: {
        select: {
          caseLinks: true,
        },
      },
    },
  });

  const topClusters = clusters.slice(0, 5);

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1>AVASC Daily Scam News</h1>
      <p>Here are the latest scam patterns and verified indicators from the last 24 hours.</p>

      ${topClusters
        .map(
          (cluster) => `
          <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="margin: 0 0 8px 0;">${escapeHtml(cluster.title)}</h2>
            <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${escapeHtml(cluster.scamType)}</p>
            <p style="margin: 0 0 8px 0;"><strong>Risk:</strong> ${escapeHtml(cluster.riskLevel)}</p>
            <p style="margin: 0 0 8px 0;"><strong>Reports:</strong> ${cluster._count.caseLinks}</p>
            <p style="margin: 0 0 8px 0;">${escapeHtml(cluster.summary)}</p>
            <p style="margin: 0 0 8px 0;"><strong>Indicators:</strong>
              ${cluster.indicatorAggregates
                .map((i) => escapeHtml(i.displayValue || i.normalizedValue))
                .join(", ")}
            </p>
            <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View profile</a>
          </div>
        `
        )
        .join("")}

      <p>Stay cautious and do not send funds to unverified entities.</p>
    </div>
  `;

  return {
    subject: "AVASC Daily Scam News",
    html,
    clusterCount: clusters.length,
  };
}
