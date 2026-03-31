import type {
  CaseStatus,
  CaseVisibility,
  EvidenceRedactionStatus,
  Prisma,
  RecoveryStage,
} from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { indicatorTypeLabel } from "@/lib/public-database/public-indicator-display";

export type VictimCaseListItem = {
  id: string;
  title: string;
  scamType: string;
  status: CaseStatus;
  summary: string;
  amountLost: number | null;
  currency: string | null;
  createdAt: Date;
};

export type VictimCaseDetail = {
  id: string;
  title: string;
  scamType: string;
  status: CaseStatus;
  visibility: CaseVisibility;
  summary: string;
  fullNarrative: string | null;
  amountLost: number | null;
  currency: string | null;
  paymentMethod: string | null;
  incidentStartDate: Date | null;
  incidentEndDate: Date | null;
  initialContactChannel: string | null;
  jurisdiction: string | null;
  recoveryStage: RecoveryStage;
  allowCaseMatching: boolean;
  allowFollowUp: boolean;
  supportRequested: boolean;
  createdAt: Date;
  updatedAt: Date;
  indicators: {
    id: string;
    type: string;
    displayLabel: string;
    value: string;
    rawDisplay: string | null;
  }[];
  evidence: {
    id: string;
    mimeType: string;
    fileSize: number;
    redactionStatus: EvidenceRedactionStatus;
    isReviewed: boolean;
    fileLabel: string;
    createdAt: Date;
  }[];
};

export type CaseListFilters = {
  status?: CaseStatus;
  scamType?: string;
  from?: string;
  to?: string;
};

function buildCaseWhere(userId: string, filters: CaseListFilters): Prisma.CaseWhereInput {
  const w: Prisma.CaseWhereInput = { userId };
  if (filters.status) w.status = filters.status;
  if (filters.scamType?.trim()) {
    w.scamType = { equals: filters.scamType.trim(), mode: "insensitive" };
  }
  if (filters.from || filters.to) {
    w.createdAt = {};
    if (filters.from) w.createdAt.gte = new Date(filters.from);
    if (filters.to) {
      const t = new Date(filters.to);
      t.setHours(23, 59, 59, 999);
      w.createdAt.lte = t;
    }
  }
  return w;
}

export async function getUserCases(userId: string, filters: CaseListFilters = {}): Promise<VictimCaseListItem[]> {
  const prisma = getPrisma();
  const rows = await prisma.case.findMany({
    where: buildCaseWhere(userId, filters),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      scamType: true,
      status: true,
      summary: true,
      amountLost: true,
      currency: true,
      createdAt: true,
    },
  });
  return rows.map((c) => ({
    ...c,
    amountLost: c.amountLost != null ? Number(c.amountLost) : null,
  }));
}

export async function getUserCaseDetail(userId: string, caseId: string): Promise<VictimCaseDetail | null> {
  const prisma = getPrisma();
  const c = await prisma.case.findFirst({
    where: { id: caseId, userId },
    select: {
      id: true,
      title: true,
      scamType: true,
      status: true,
      visibility: true,
      summary: true,
      fullNarrative: true,
      amountLost: true,
      currency: true,
      paymentMethod: true,
      incidentStartDate: true,
      incidentEndDate: true,
      initialContactChannel: true,
      jurisdiction: true,
      recoveryStage: true,
      allowCaseMatching: true,
      allowFollowUp: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { supportRequests: true } },
      indicators: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          indicatorType: true,
          rawValue: true,
          normalizedValue: true,
        },
      },
      evidenceFiles: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          mimeType: true,
          fileSize: true,
          redactionStatus: true,
          isReviewed: true,
          fileName: true,
          filePath: true,
          createdAt: true,
        },
      },
    },
  });
  if (!c) return null;

  return {
    id: c.id,
    title: c.title,
    scamType: c.scamType,
    status: c.status,
    visibility: c.visibility,
    summary: c.summary,
    fullNarrative: c.fullNarrative,
    amountLost: c.amountLost != null ? Number(c.amountLost) : null,
    currency: c.currency,
    paymentMethod: c.paymentMethod,
    incidentStartDate: c.incidentStartDate,
    incidentEndDate: c.incidentEndDate,
    initialContactChannel: c.initialContactChannel,
    jurisdiction: c.jurisdiction,
    recoveryStage: c.recoveryStage,
    allowCaseMatching: c.allowCaseMatching,
    allowFollowUp: c.allowFollowUp,
    supportRequested: c._count.supportRequests > 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    indicators: c.indicators.map((i) => {
      const value = i.normalizedValue || i.rawValue;
      return {
        id: i.id,
        type: i.indicatorType,
        displayLabel: indicatorTypeLabel(i.indicatorType),
        value,
        rawDisplay: i.rawValue && i.rawValue !== value ? i.rawValue : null,
      };
    }),
    evidence: c.evidenceFiles.map((e) => ({
      id: e.id,
      mimeType: e.mimeType,
      fileSize: e.fileSize,
      redactionStatus: e.redactionStatus,
      isReviewed: e.isReviewed,
      fileLabel: evidenceFileLabel(e.fileName, e.filePath, e.mimeType),
      createdAt: e.createdAt,
    })),
  };
}

function evidenceFileLabel(fileName: string, filePath: string, mime: string): string {
  const base = fileName?.trim() || filePath.split("/").pop() || "file";
  const short = base.length > 48 ? `${base.slice(0, 20)}…${base.slice(-12)}` : base;
  return short || mime;
}

const ownedCaseInclude = {
  indicators: true,
  evidenceFiles: true,
  supportRequests: true,
} as const;

export type OwnedCaseWithRelations = Prisma.CaseGetPayload<{
  include: typeof ownedCaseInclude;
}>;

/** Prisma `User.id` (app user), not Supabase auth UUID. */
export async function getOwnedCaseOrThrow(
  userId: string,
  caseId: string
): Promise<OwnedCaseWithRelations> {
  const prisma = getPrisma();
  const record = await prisma.case.findFirst({
    where: { id: caseId, userId },
    include: ownedCaseInclude,
  });

  if (!record) {
    throw new Error("Case not found or access denied.");
  }

  return record;
}

export async function assertCaseOwnedByUser(userId: string, caseId: string): Promise<boolean> {
  const prisma = getPrisma();
  const n = await prisma.case.count({ where: { id: caseId, userId } });
  return n > 0;
}
