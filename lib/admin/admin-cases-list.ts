"use server";

import { revalidatePath } from "next/cache";
import { CaseStatus, SuggestionStatus, UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

function normalizeListQuery(input: {
  q?: string;
  status?: string;
  scamType?: string;
  suggestion?: string;
}) {
  const q = (input.q ?? "").trim();
  const scamType = (input.scamType ?? "").trim() || "ALL";

  const statusRaw = (input.status ?? "").trim() || "ALL";
  const status: "ALL" | CaseStatus =
    statusRaw === "ALL" ? "ALL" : z.nativeEnum(CaseStatus).safeParse(statusRaw).success
      ? (statusRaw as CaseStatus)
      : "ALL";

  const sugRaw = (input.suggestion ?? "").trim() || "ALL";
  const suggestion: "ALL" | "HAS_PENDING" | "NO_PENDING" =
    sugRaw === "HAS_PENDING" || sugRaw === "NO_PENDING" ? sugRaw : "ALL";

  return { q, status, scamType, suggestion };
}

const quickStatusSchema = z.object({
  caseId: z.string().uuid(),
  status: z.nativeEnum(CaseStatus),
});

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function buildTextSearchWhere(q: string): Prisma.CaseWhereInput | null {
  const trimmed = q.trim();
  if (!trimmed) return null;

  const or: Prisma.CaseWhereInput[] = [
    { title: { contains: trimmed, mode: "insensitive" } },
    { summary: { contains: trimmed, mode: "insensitive" } },
    { scamType: { contains: trimmed, mode: "insensitive" } },
  ];

  if (UUID_RE.test(trimmed)) {
    or.unshift({ id: trimmed });
  }

  return { OR: or };
}

function buildSuggestionFilter(value: string): Prisma.CaseWhereInput | null {
  if (value === "HAS_PENDING") {
    return {
      clusterSuggestions: {
        some: { status: SuggestionStatus.PENDING },
      },
    };
  }

  if (value === "NO_PENDING") {
    return {
      NOT: {
        clusterSuggestions: {
          some: { status: SuggestionStatus.PENDING },
        },
      },
    };
  }

  return null;
}

export async function getAdminCasesListData(input?: {
  q?: string;
  status?: string;
  scamType?: string;
  suggestion?: string;
}) {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const parsed = normalizeListQuery({
    q: input?.q,
    status: input?.status,
    scamType: input?.scamType,
    suggestion: input?.suggestion,
  });

  const and: Prisma.CaseWhereInput[] = [];

  const textSearch = buildTextSearchWhere(parsed.q);
  if (textSearch) and.push(textSearch);

  if (parsed.status !== "ALL") {
    and.push({ status: parsed.status });
  }

  if (parsed.scamType !== "ALL") {
    and.push({ scamType: parsed.scamType });
  }

  const suggestionWhere = buildSuggestionFilter(parsed.suggestion);
  if (suggestionWhere) and.push(suggestionWhere);

  const where: Prisma.CaseWhereInput = and.length ? { AND: and } : {};

  const [
    cases,
    total,
    countNew,
    countPending,
    countFollowUp,
    countClustered,
    scamTypeRows,
  ] = await Promise.all([
    prisma.case.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        title: true,
        scamType: true,
        summary: true,
        amountLost: true,
        status: true,
        createdAt: true,
        _count: {
          select: { indicators: true },
        },
        clusterSuggestions: {
          orderBy: [{ createdAt: "desc" }],
          take: 1,
          select: {
            suggestionType: true,
            status: true,
          },
        },
      },
    }),
    prisma.case.count(),
    prisma.case.count({ where: { status: CaseStatus.NEW } }),
    prisma.case.count({ where: { status: CaseStatus.PENDING_REVIEW } }),
    prisma.case.count({ where: { status: CaseStatus.NEEDS_FOLLOW_UP } }),
    prisma.case.count({ where: { status: CaseStatus.CLUSTERED } }),
    prisma.case.findMany({
      distinct: ["scamType"],
      orderBy: { scamType: "asc" },
      select: { scamType: true },
    }),
  ]);

  return {
    cases: cases.map((item) => ({
      id: item.id,
      title: item.title,
      scamType: item.scamType,
      summary: item.summary,
      amountLost: item.amountLost,
      status: item.status,
      createdAt: item.createdAt,
      indicatorCount: item._count.indicators,
      hasPendingSuggestion: item.clusterSuggestions[0]?.status === SuggestionStatus.PENDING,
      topSuggestionType: item.clusterSuggestions[0]?.suggestionType ?? null,
    })),
    stats: {
      total,
      new: countNew,
      pendingReview: countPending,
      followUp: countFollowUp,
      clustered: countClustered,
    },
    filterValues: {
      statuses: Object.values(CaseStatus) as CaseStatus[],
      scamTypes: scamTypeRows.map((s) => s.scamType).filter(Boolean),
      suggestionStates: ["HAS_PENDING", "NO_PENDING"] as const,
    },
  };
}

export async function quickSetCaseStatusAction(input: { caseId: string; status: CaseStatus }) {
  const actor = await requireRole([UserRole.admin, UserRole.moderator]);
  const parsed = quickStatusSchema.parse(input);

  const previous = await prisma.case.findUnique({
    where: { id: parsed.caseId },
    select: { status: true },
  });

  if (!previous) {
    throw new Error("Case not found.");
  }

  await prisma.case.update({
    where: { id: parsed.caseId },
    data: { status: parsed.status },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: actor.id,
      entityType: "Case",
      entityId: parsed.caseId,
      action: "CASE_STATUS_QUICK_SET",
      metadataJson: {
        previousStatus: previous.status,
        nextStatus: parsed.status,
      },
    },
  });

  revalidatePath("/admin/cases");
  revalidatePath(`/admin/cases/${parsed.caseId}`);
  revalidatePath(`/admin/cases/${parsed.caseId}/review-production`);

  return { success: true as const };
}
