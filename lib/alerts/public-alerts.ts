import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { buildPublicAlertWhere } from "@/lib/alerts/build-public-alert-where";
import { prisma } from "@/lib/prisma";

export type AlertPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AlertType = "REALTIME" | "DAILY";

/** Shape consumed by `AvascAlertSection` and public API. */
export type PublicAlertItem = {
  id: string;
  slug?: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  summary: string;
  shortText: string;
  publishedAt: string;
  clusterId?: string;
  stats?: {
    newReports?: number;
    amountLostUsd?: number;
    indicatorLabel?: string;
  };
};

const publicAlertsQuerySchema = z.object({
  type: z.enum(["REALTIME", "DAILY"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export async function getHomepageAlertSectionData(): Promise<{
  realtimeAlerts: PublicAlertItem[];
  dailyAlerts: PublicAlertItem[];
}> {
  try {
    const [realtimeAlerts, dailyAlerts] = await Promise.all([
      getPublicAlerts({ type: "REALTIME", limit: 8, forHomepage: true }),
      getPublicAlerts({ type: "DAILY", limit: 6, forHomepage: true }),
    ]);
    return { realtimeAlerts, dailyAlerts };
  } catch {
    return { realtimeAlerts: [], dailyAlerts: [] };
  }
}

export async function getPublicAlerts(input?: {
  type?: AlertType;
  limit?: number;
  /** When true, only alerts flagged for the homepage alert section. */
  forHomepage?: boolean;
}): Promise<PublicAlertItem[]> {
  const parsed = publicAlertsQuerySchema.parse(input ?? {});
  const homepageOnly = input?.forHomepage === true;

  const where: Prisma.AlertWhereInput = (() => {
    if (parsed.type === "REALTIME") {
      return buildPublicAlertWhere({
        type: "REALTIME",
        homepageOnly,
      });
    }
    if (parsed.type === "DAILY") {
      return buildPublicAlertWhere({
        type: "DAILY",
        homepageOnly,
      });
    }
    return {
      OR: [
        buildPublicAlertWhere({ type: "REALTIME", homepageOnly }),
        buildPublicAlertWhere({ type: "DAILY", homepageOnly }),
      ],
    };
  })();

  const alerts = await prisma.alert.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: parsed.limit,
    select: {
      id: true,
      title: true,
      message: true,
      alertType: true,
      riskLevel: true,
      scamClusterId: true,
      createdAt: true,
    },
  });

  const clusterIds = [
    ...new Set(
      alerts.map((a) => a.scamClusterId).filter((id): id is string => Boolean(id))
    ),
  ];

  const clusters =
    clusterIds.length > 0
      ? await prisma.scamCluster.findMany({
          where: { id: { in: clusterIds } },
          select: {
            id: true,
            slug: true,
            title: true,
            reportCountSnapshot: true,
            threatScore: true,
            indicatorAggregates: {
              where: { isPublic: true },
              orderBy: [{ isVerified: "desc" }, { linkedCaseCount: "desc" }],
              take: 1,
              select: {
                displayValue: true,
                normalizedValue: true,
                indicatorType: true,
              },
            },
          },
        })
      : [];

  const clusterById = new Map(clusters.map((c) => [c.id, c]));

  return alerts.map((alert) => {
    const cluster = alert.scamClusterId
      ? clusterById.get(alert.scamClusterId)
      : undefined;

    const priority = normalizePriority(alert.riskLevel);
    const topIndicator = cluster?.indicatorAggregates?.[0];
    const indicatorLabel = topIndicator
      ? `${topIndicator.indicatorType}: ${topIndicator.displayValue || topIndicator.normalizedValue}`
      : undefined;

    const type: AlertType =
      alert.alertType === "REALTIME" ? "REALTIME" : "DAILY";

    const summaryText =
      alert.alertType === "DAILY" ? stripHtml(alert.message) : alert.message;

    return {
      id: alert.id,
      slug: cluster?.slug ?? undefined,
      type,
      priority,
      title: alert.title,
      summary: summaryText,
      shortText: buildShortText({
        alertType: alert.alertType,
        title: alert.title,
        clusterTitle: cluster?.title,
        indicatorLabel,
        riskLevel: alert.riskLevel ?? undefined,
      }),
      publishedAt: formatAlertDate(alert.createdAt),
      clusterId: alert.scamClusterId ?? undefined,
      stats: {
        newReports: cluster?.reportCountSnapshot ?? undefined,
        indicatorLabel,
      },
    } satisfies PublicAlertItem;
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePriority(value?: string | null): AlertPriority {
  if (value === "CRITICAL") return "CRITICAL";
  if (value === "HIGH") return "HIGH";
  if (value === "MEDIUM") return "MEDIUM";
  return "LOW";
}

function buildShortText(args: {
  alertType: string;
  title: string;
  clusterTitle?: string;
  indicatorLabel?: string;
  riskLevel?: string;
}) {
  if (args.alertType === "REALTIME") {
    const base = args.clusterTitle || args.title;
    if (args.indicatorLabel) {
      return `${base} — ${args.indicatorLabel}`;
    }
    if (args.riskLevel) {
      return `${base} — ${args.riskLevel} risk`;
    }
    return base;
  }

  return args.title;
}

function formatAlertDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Shared handler for `GET` JSON responses (e.g. `app/api/public-alerts/route.ts`).
 */
export async function handlePublicAlertsRequest(url: string) {
  const u = new URL(url, "https://avasc.org");
  const typeRaw = u.searchParams.get("type");
  const limitRaw = u.searchParams.get("limit");

  const type =
    typeRaw === "REALTIME" || typeRaw === "DAILY"
      ? typeRaw
      : undefined;

  const parsed = publicAlertsQuerySchema.safeParse({
    type,
    limit: limitRaw ?? undefined,
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Invalid query parameters",
      items: [] as PublicAlertItem[],
    };
  }

  const items = await getPublicAlerts({
    type: parsed.data.type,
    limit: parsed.data.limit,
  });

  return {
    success: true as const,
    items,
  };
}
