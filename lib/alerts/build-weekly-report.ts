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

export type BuildWeeklyReportResult = {
  subject: string;
  html: string;
  clusterCount: number;
};

/**
 * Weekly HTML: scam-type rollup (by linked report counts) + top threat clusters.
 */
export async function buildWeeklyReport(prisma: PrismaClient): Promise<BuildWeeklyReportResult> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const baseUrl = appBaseUrl();

  const clusters = await prisma.scamCluster.findMany({
    where: {
      updatedAt: { gte: since },
      publicStatus: PUBLIC_CLUSTER_STATUS,
    },
    orderBy: [{ threatScore: "desc" }, { updatedAt: "desc" }],
    take: 40,
    include: {
      _count: {
        select: {
          caseLinks: true,
        },
      },
    },
  });

  const scamTypeMap = new Map<string, number>();
  for (const cluster of clusters) {
    scamTypeMap.set(cluster.scamType, (scamTypeMap.get(cluster.scamType) ?? 0) + cluster._count.caseLinks);
  }

  const topTypes = [...scamTypeMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1>AVASC Weekly Scam Intelligence Report</h1>
      <p>This weekly report summarizes scam activity and trends observed across the AVASC platform.</p>

      <h2>Top Scam Types</h2>
      <ul>
        ${topTypes
          .map(
            ([type, count]) =>
              `<li>${escapeHtml(type)}: ${count} linked reports</li>`
          )
          .join("")}
      </ul>

      <h2>Highest-Risk Published Clusters</h2>
      ${clusters
        .slice(0, 5)
        .map(
          (cluster) => `
          <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <strong>${escapeHtml(cluster.title)}</strong><br />
            Type: ${escapeHtml(cluster.scamType)}<br />
            Risk: ${escapeHtml(cluster.riskLevel)}<br />
            Threat Score: ${cluster.threatScore}<br />
            Reports: ${cluster._count.caseLinks}<br />
            <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View profile</a>
          </div>
        `
        )
        .join("")}

      <p>Continue monitoring emerging clusters and public indicators.</p>
    </div>
  `;

  return {
    subject: "AVASC Weekly Scam Intelligence Report",
    html,
    clusterCount: clusters.length,
  };
}
