import type { PrismaClient } from "@prisma/client";
import { AlertChannel } from "@prisma/client";
import {
  ALERT_DEDUPE_WINDOW_MS,
  MAX_CRITICAL_SMS_PER_DAY,
  SMS_COOLDOWN_MS,
} from "@/lib/alerts/constants";
import { createDeliveryLog } from "@/lib/alerts/delivery-log";
import { calculateThreatScore, shouldTriggerRealtimeAlert } from "@/lib/alerts/alert-scoring";
import { loadClusterAlertMetrics } from "@/lib/alerts/cluster-metrics";
import { sendCriticalScamAlertSms } from "@/lib/alerts/send-sms-alert";
import { PUBLIC_CLUSTER_STATUS } from "@/lib/public-database/constants";

export type CriticalProcessResult = {
  clustersScanned: number;
  alertsCreated: number;
  smsAttempts: number;
  smsSent: number;
};

/**
 * Scan recently updated published clusters; create `Alert` rows (REALTIME) and send CRITICAL SMS when gated.
 */
export async function processCriticalClustersSince(
  prisma: PrismaClient,
  since: Date
): Promise<CriticalProcessResult> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000").replace(/\/$/, "");

  const clusters = await prisma.scamCluster.findMany({
    where: {
      publicStatus: PUBLIC_CLUSTER_STATUS,
      updatedAt: { gte: since },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      scamType: true,
      riskLevel: true,
      summary: true,
      lastAlertedAt: true,
    },
  });

  let alertsCreated = 0;
  let smsAttempts = 0;
  let smsSent = 0;

  for (const c of clusters) {
    const metrics = await loadClusterAlertMetrics(prisma, c.id);
    const threatScore = calculateThreatScore(metrics);
    const hasVerifiedIndicator =
      metrics.verifiedWalletCount > 0 ||
      metrics.verifiedDomainCount > 0 ||
      metrics.verifiedEmailCount > 0;

    if (
      !shouldTriggerRealtimeAlert({
        score: threatScore,
        riskLevel: c.riskLevel,
        reportCount: metrics.reportCount,
        hasVerifiedIndicator,
        reportsLast6h: metrics.reportsLast6h,
        lastAlertedAt: c.lastAlertedAt,
      })
    ) {
      continue;
    }

    const dedupeSince = new Date(Date.now() - ALERT_DEDUPE_WINDOW_MS);
    const recent = await prisma.alert.findFirst({
      where: {
        scamClusterId: c.id,
        alertType: "REALTIME",
        createdAt: { gte: dedupeSince },
      },
    });
    if (recent) continue;

    const alert = await prisma.alert.create({
      data: {
        title: `CRITICAL pattern update: ${c.title.slice(0, 120)}`,
        message: (c.summary ?? "").trim().slice(0, 2000) || "See the public scam database for details.",
        alertType: "REALTIME",
        riskLevel: c.riskLevel,
        scamClusterId: c.id,
        score: threatScore,
        isSent: false,
      },
    });
    alertsCreated++;

    const followers = await prisma.clusterSubscription.findMany({
      where: { clusterId: c.id },
      include: { subscription: true },
    });

    const body = `AVASC CRITICAL: Pattern "${c.title.slice(0, 55)}${c.title.length > 55 ? "…" : ""}" — ${baseUrl}/database/${c.slug}`;

    for (const f of followers) {
      const sub = f.subscription;
      if (!sub.isActive || !sub.smsEnabled || !sub.phone) {
        continue;
      }

      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const smsLast24h = await prisma.alertDeliveryLog.count({
        where: {
          subscriptionId: sub.id,
          channel: AlertChannel.SMS,
          status: "SENT",
          sentAt: { gte: dayAgo },
        },
      });
      if (smsLast24h >= MAX_CRITICAL_SMS_PER_DAY) {
        continue;
      }

      const recentSms = await prisma.alertDeliveryLog.findFirst({
        where: {
          subscriptionId: sub.id,
          channel: AlertChannel.SMS,
          status: "SENT",
          sentAt: { gte: new Date(Date.now() - SMS_COOLDOWN_MS) },
        },
        orderBy: { sentAt: "desc" },
      });
      if (recentSms) {
        continue;
      }

      smsAttempts++;
      const result = await sendCriticalScamAlertSms({ toE164: sub.phone, body });
      if (result.ok) {
        await createDeliveryLog(prisma, {
          alertId: alert.id,
          subscriptionId: sub.id,
          channel: AlertChannel.SMS,
          status: "SENT",
          providerMessageId: result.messageSid,
        });
        smsSent++;
      } else {
        await createDeliveryLog(prisma, {
          alertId: alert.id,
          subscriptionId: sub.id,
          channel: AlertChannel.SMS,
          status: "FAILED",
          errorMessage: result.error,
        });
      }
    }

    await prisma.alert.update({
      where: { id: alert.id },
      data: { isSent: true },
    });

    await prisma.scamCluster.update({
      where: { id: c.id },
      data: {
        lastAlertedAt: new Date(),
        threatScore,
        reportCountSnapshot: metrics.reportCount,
      },
    });
  }

  return {
    clustersScanned: clusters.length,
    alertsCreated,
    smsAttempts,
    smsSent,
  };
}
