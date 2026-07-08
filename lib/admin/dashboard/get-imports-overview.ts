import type { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/require-role";

export type ImportsOverview = {
  rows: Array<{
    id: string;
    sourceName: string;
    sourceFilePath: string;
    sourceFileId?: string | null;
    contentType: string;
    status: string;
    errorMessage?: string | null;
    linkedAlertId?: string | null;
    linkedAlertTitle?: string | null;
    createdAt: Date;
    processedAt?: Date | null;
    rawPayload: Prisma.JsonValue;
  }>;
  stats: {
    total: number;
    pendingApproval: number;
    failed: number;
    approved: number;
    rejected: number;
  };
};

export type ImportsOverviewFilters = {
  status?: string;
  contentType?: string;
  sourceName?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export async function getImportsOverview(filters: ImportsOverviewFilters = {}): Promise<ImportsOverview> {
  await requireRole([UserRole.admin, UserRole.moderator]);

  const where: Prisma.ExternalContentIngestionWhereInput = {};

  if (filters.status?.trim()) {
    where.status = filters.status.trim();
  }
  if (filters.contentType?.trim()) {
    where.contentType = filters.contentType.trim();
  }
  if (filters.sourceName?.trim()) {
    where.sourceName = { contains: filters.sourceName.trim(), mode: "insensitive" };
  }
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const [rowsRaw, allForStats] = await Promise.all([
    prisma.externalContentIngestion.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        sourceName: true,
        sourceFilePath: true,
        sourceFileId: true,
        contentType: true,
        status: true,
        errorMessage: true,
        linkedAlertId: true,
        createdAt: true,
        processedAt: true,
        rawPayload: true,
        linkedAlert: { select: { id: true, title: true } },
      },
    }),
    prisma.externalContentIngestion.findMany({
      where,
      select: { status: true },
    }),
  ]);

  const rows: ImportsOverview["rows"] = rowsRaw.map((r) => ({
    id: r.id,
    sourceName: r.sourceName,
    sourceFilePath: r.sourceFilePath,
    sourceFileId: r.sourceFileId,
    contentType: r.contentType,
    status: r.status,
    errorMessage: r.errorMessage,
    linkedAlertId: r.linkedAlertId,
    linkedAlertTitle: r.linkedAlert?.title ?? null,
    createdAt: r.createdAt,
    processedAt: r.processedAt,
    rawPayload: r.rawPayload,
  }));

  const stats = {
    total: allForStats.length,
    pendingApproval: allForStats.filter((r) => r.status === "PENDING_APPROVAL").length,
    failed: allForStats.filter((r) => r.status === "FAILED").length,
    approved: allForStats.filter((r) => r.status === "APPROVED").length,
    rejected: allForStats.filter((r) => r.status === "REJECTED" || r.status === "INVALIDATED").length,
  };

  return { rows, stats };
}
