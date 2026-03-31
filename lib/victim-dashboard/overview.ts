import type { CaseStatus, PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { countPublishedPatternsLinkedToUserCases } from "./similar-patterns";

export type DashboardOverview = {
  totalCases: number;
  underReview: number;
  openSupportRequests: number;
  storiesPendingReview: number;
  publishedPatternsLinked: number;
  recentCases: {
    id: string;
    title: string;
    scamType: string;
    status: CaseStatus;
    createdAt: Date;
  }[];
  recentSupport: {
    id: string;
    supportType: string;
    status: string;
    createdAt: Date;
    caseTitle: string | null;
  }[];
  recentStories: {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    publishedAt: Date | null;
  }[];
};

export async function getDashboardOverview(prisma: PrismaClient, userId: string): Promise<DashboardOverview> {
  const [
    totalCases,
    underReview,
    openSupport,
    storiesPending,
    publishedPatternsLinked,
    recentCases,
    recentSupportRows,
    recentStories,
  ] = await Promise.all([
    prisma.case.count({ where: { userId } }),
    prisma.case.count({ where: { userId, status: "PENDING_REVIEW" } }),
    prisma.supportRequest.count({
      where: { userId, status: { not: "CLOSED" } },
    }),
    prisma.story.count({ where: { userId, moderationStatus: "PENDING" } }),
    countPublishedPatternsLinkedToUserCases(prisma, userId),
    prisma.case.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, scamType: true, status: true, createdAt: true },
    }),
    prisma.supportRequest.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        supportType: true,
        status: true,
        createdAt: true,
        case: { select: { title: true } },
      },
    }),
    prisma.story.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, moderationStatus: true, createdAt: true, publishedAt: true },
    }),
  ]);

  return {
    totalCases,
    underReview,
    openSupportRequests: openSupport,
    storiesPendingReview: storiesPending,
    publishedPatternsLinked,
    recentCases,
    recentSupport: recentSupportRows.map((r) => ({
      id: r.id,
      supportType: r.supportType,
      status: r.status,
      createdAt: r.createdAt,
      caseTitle: r.case?.title ?? null,
    })),
    recentStories: recentStories.map((s) => ({
      id: s.id,
      title: s.title,
      status: s.moderationStatus,
      createdAt: s.createdAt,
      publishedAt: s.publishedAt,
    })),
  };
}

export async function loadDashboardOverview(userId: string): Promise<DashboardOverview> {
  return getDashboardOverview(getPrisma(), userId);
}
