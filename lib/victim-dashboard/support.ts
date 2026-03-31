import type { PrismaClient, SupportRequestStatus, SupportType } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { newRowId } from "@/lib/db/id";
import type { CreateSupportRequestInput } from "./schemas";
import { assertCaseOwnedByUser } from "./cases";

/** Victim-safe row: staff-only fields excluded — only the user’s `note`. */
export type VictimSupportRow = {
  id: string;
  supportType: SupportType;
  status: SupportRequestStatus;
  /** Original message from the user when they opened the request; safe to display. */
  userSubmittedNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  caseId: string | null;
  caseTitle: string | null;
};

export async function getUserSupportRequests(prisma: PrismaClient, userId: string): Promise<VictimSupportRow[]> {
  const rows = await prisma.supportRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      supportType: true,
      status: true,
      note: true,
      createdAt: true,
      updatedAt: true,
      caseId: true,
      case: { select: { title: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    supportType: r.supportType,
    status: r.status,
    userSubmittedNote: r.note,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    caseId: r.caseId,
    caseTitle: r.case?.title ?? null,
  }));
}

export async function createSupportRequest(userId: string, input: CreateSupportRequestInput): Promise<string> {
  const prisma = getPrisma();
  if (input.caseId) {
    const ok = await assertCaseOwnedByUser(userId, input.caseId);
    if (!ok) throw new Error("Case not found or access denied");
  }
  const id = newRowId();
  const note = input.note.trim();
  await prisma.supportRequest.create({
    data: {
      id,
      userId,
      caseId: input.caseId ?? null,
      supportType: input.supportType,
      status: "OPEN",
      note,
    },
  });
  return id;
}
