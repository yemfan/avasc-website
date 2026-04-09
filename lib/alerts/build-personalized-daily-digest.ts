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

export type PersonalizedDailyDigestPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Per-subscriber HTML digest: followed clusters, related recommendations, global highlights.
 */
export async function buildPersonalizedDailyDigest(
  subscriptionId: string
): Promise<PersonalizedDailyDigestPayload | null> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
  const related = await getRelatedClusterRecommendations(followedIds, 5);

  const topGlobal = await prisma.scamCluster.findMany({
    where: {
      publicStatus: PUBLIC_CLUSTER_STATUS,
      updatedAt: { gte: since },
    },
    orderBy: [{ threatScore: "desc" }, { updatedAt: "desc" }],
    take: 5,
    include: {
      _count: {
        select: { caseLinks: true },
      },
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1>AVASC Daily Scam News</h1>
      <p>Your personalized daily scam digest.</p>

      <h2>Scams You Follow</h2>
      ${
        followedUpdates.length === 0
          ? `<p>No followed scam profiles changed in the last 24 hours.</p>`
          : followedUpdates
              .map(
                (cluster) => `
                <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
                  <strong>${escapeHtml(cluster.title)}</strong><br />
                  Type: ${escapeHtml(cluster.scamType)}<br />
                  Risk: ${escapeHtml(cluster.riskLevel)}<br />
                  Threat Score: ${cluster.threatScore}<br />
                  Reports: ${cluster.reportCount}<br />
                  ${
                    cluster.newIndicators.length > 0
                      ? `New Indicators: ${cluster.newIndicators
                          .map(
                            (i) =>
                              `${escapeHtml(String(i.type))}: ${escapeHtml(i.value)}${i.verified ? " ✓" : ""}`
                          )
                          .join(", ")}<br />`
                      : ""
                  }
                  <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View profile</a>
                </div>
              `
              )
              .join("")
      }

      <h2>Related Scam Profiles You May Want to Watch</h2>
      ${
        related.length === 0
          ? `<p>No related scam profiles found today.</p>`
          : related
              .map(
                (cluster) => `
                <div style="margin-bottom: 16px;">
                  <strong>${escapeHtml(cluster.title)}</strong> — ${escapeHtml(cluster.scamType)}<br />
                  Risk: ${escapeHtml(cluster.riskLevel)} | Reports: ${cluster.reportCount} | Shared indicators: ${cluster.sharedIndicatorCount}<br />
                  <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View related profile</a>
                </div>
              `
              )
              .join("")
      }

      <h2>AVASC Daily Highlights</h2>
      ${topGlobal
        .map(
          (cluster) => `
          <div style="margin-bottom: 16px;">
            <strong>${escapeHtml(cluster.title)}</strong><br />
            Risk: ${escapeHtml(cluster.riskLevel)} | Reports: ${cluster._count.caseLinks}<br />
            <a href="${escapeHtml(`${baseUrl}/database/${cluster.slug}`)}" style="color:#1d4ed8;">View profile</a>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  return {
    to: subscription.email,
    subject: "AVASC Daily Scam News",
    html,
  };
}
