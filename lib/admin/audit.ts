import type { Prisma, PrismaClient } from "@prisma/client";
import { newRowId } from "@/lib/db/id";

export async function writeAuditLog(
  prisma: PrismaClient,
  params: {
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }
) {
  const now = new Date();
  await prisma.auditLog.create({
    data: {
      id: newRowId(),
      actorUserId: params.actorUserId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      metadataJson: params.metadata
        ? (params.metadata as Prisma.InputJsonValue)
        : undefined,
      createdAt: now,
    },
  });
}
