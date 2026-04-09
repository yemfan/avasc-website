import { prisma } from "@/lib/prisma";
import { getFollowedClusterUpdates } from "@/lib/alerts/get-followed-cluster-updates";
import { getRelatedClusterRecommendations } from "@/lib/alerts/get-related-cluster-recommendations";
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

export type PersonalizedWeeklyDigestPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Per-subscriber weekly HTML: followed activity, related clusters, global highlights (7-day window).
 */
export async function buildPersonalizedWeeklyDigest(
  subscriptionId: string
): Promise<PersonalizedWeeklyDigestPayload | null> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const baseUrl = appBaseUrl();

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      clusterSubscriptions: true,
    },
  });

  if (!subscription || !subscription.email) {
    return null;
  }

  const followedUpdates = await getFollowedClusterUpdates(subscriptionId, since);
  const followedIds = subscription.clusterSubscriptions.map((c) => c.clusterId);
  const related = await getRelatedClusterRecommendations(followedIds, 8);

  const topWeek = await prisma.scamCluster.findMany({
    where: {
      publicStatus: PUBLIC_CLUSTER_STATUS,
      updatedAt: { gte: since },
    },
    orderBy: [{ threatScore: "desc" }, { updatedAt: "desc" }],
    take: 8,
    include: {
      _count: {
        select: { caseLinks: true },
      },
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1>AVASC Weekly Scam Intelligence Report</h1>
      <p>Your personalized weekly summary of scams you follow and emerging public patterns.</p>

      <h2>Weekly Updates on Scams You Follow</h2>
      ${
        followedUpdates.length === 0
          ? `<p>No major updates this week for followed scam profiles.</p>`
          : followedUpdates
              .map(
                (cluster) => `
                <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
                  <strong>${escapeHtml(cluster.title)}</strong><br />
                  Type: ${escapeHtml(cluster.scamType)}<br />
                  Risk: ${escapeHtml(cluster.riskLevel)}<br />
                  Threat Score: ${cluster.threatScore}<br />
                  Reports: ${cluster.reportCount}<br />
                  <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View profile</a>
                </div>
              `
              )
              .join("")
      }

      <h2>Related Scam Profiles</h2>
      ${
        related.length === 0
          ? `<p>No additional related scam profiles this week.</p>`
          : related
              .map(
                (cluster) => `
                <div style="margin-bottom: 16px;">
                  <strong>${escapeHtml(cluster.title)}</strong> — ${escapeHtml(cluster.scamType)}<br />
                  Risk: ${escapeHtml(cluster.riskLevel)} | Reports: ${cluster.reportCount}<br />
                  <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View related profile</a>
                </div>
              `
              )
              .join("")
      }

      <h2>Top AVASC Weekly Highlights</h2>
      ${topWeek
        .map(
          (cluster) => `
          <div style="margin-bottom: 16px;">
            <strong>${escapeHtml(cluster.title)}</strong><br />
            Risk: ${escapeHtml(cluster.riskLevel)} | Reports: ${cluster._count.caseLinks} | Threat Score: ${cluster.threatScore}<br />
            <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View profile</a>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  return {
    to: subscription.email,
    subject: "AVASC Weekly Scam Intelligence Report",
    html,
  };
}
