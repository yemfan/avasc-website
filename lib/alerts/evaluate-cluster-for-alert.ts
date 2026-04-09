import { prisma } from "@/lib/prisma";
import {
  calculateThreatScore,
  mapScoreToRiskLevel,
  shouldTriggerRealtimeAlert,
} from "@/lib/alerts/alert-scoring";
import { getClusterAlertMetrics } from "@/lib/alerts/get-cluster-alert-metrics";
import { sendRealtimeSmsAlert } from "@/lib/alerts/send-sms-alert";

function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000").replace(/\/$/, "");
}

export async function evaluateClusterForAlert(clusterId: string) {
  const { cluster, metrics } = await getClusterAlertMetrics(clusterId);

  const score = calculateThreatScore(metrics);
  const riskLevel = mapScoreToRiskLevel(score);
  const hasVerifiedIndicator =
    metrics.verifiedWalletCount > 0 ||
    metrics.verifiedDomainCount > 0 ||
    metrics.verifiedEmailCount > 0;

  await prisma.scamCluster.update({
    where: { id: cluster.id },
    data: {
      threatScore: score,
      riskLevel,
      reportCountSnapshot: metrics.reportCount,
    },
  });

  const shouldSend = shouldTriggerRealtimeAlert({
    score,
    riskLevel,
    reportCount: metrics.reportCount,
    hasVerifiedIndicator,
    reportsLast6h: metrics.reportsLast6h,
    lastAlertedAt: cluster.lastAlertedAt,
  });

  if (!shouldSend) {
    return {
      clusterId,
      score,
      riskLevel,
      alertCreated: false,
    };
  }

  const indicatorPreview =
    cluster.indicatorAggregates.find((i) => i.isPublic && i.displayValue)?.displayValue ||
    cluster.indicatorAggregates.find((i) => i.isPublic)?.normalizedValue ||
    "A newly verified scam pattern";

  const alert = await prisma.alert.create({
    data: {
      title: `AVASC Realtime Scam Alert: ${cluster.title}`,
      message:
        `⚠️ AVASC ALERT\n` +
        `${cluster.title}\n` +
        `Risk: ${riskLevel}\n` +
        `Indicator: ${indicatorPreview}\n` +
        `Do not send funds or share sensitive information.\n` +
        `${appBaseUrl()}/database/${cluster.slug}`,
      alertType: "REALTIME",
      riskLevel,
      scamClusterId: cluster.id,
      score,
      isSent: false,
      isPublicVisible: true,
      isRealtimeVisible: true,
      isHomepageVisible: true,
      isDailyFeedVisible: false,
      sourceType: "INTERNAL",
      approvalStatus: "APPROVED",
    },
  });

  await sendRealtimeSmsAlert(alert.id);

  await prisma.scamCluster.update({
    where: { id: cluster.id },
    data: {
      lastAlertedAt: new Date(),
    },
  });

  return {
    clusterId,
    score,
    riskLevel,
    alertCreated: true,
    alertId: alert.id,
  };
}
