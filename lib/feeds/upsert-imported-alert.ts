import type { PrismaClient } from "@prisma/client";

import type { ImportedAlertPayload } from "@/lib/feeds/validate-import-payload";

const visibilityDefaults = {
  isPublicVisible: false,
  isRealtimeVisible: false,
  isHomepageVisible: false,
  isDailyFeedVisible: false,
};

/**
 * Handoff package: upsert draft by `sourceFileId` + ONEDRIVE; `message` is `summary` for MVP.
 */
export async function upsertImportedAlertDraft(
  prisma: PrismaClient,
  args: {
    payload: ImportedAlertPayload;
    sourceFileId: string;
    sourceName: string;
  }
) {
  const { payload, sourceFileId, sourceName } = args;

  const cluster = payload.slug
    ? await prisma.scamCluster.findFirst({
        where: { slug: payload.slug },
        select: { id: true, slug: true },
      })
    : null;

  const existing = await prisma.alert.findFirst({
    where: {
      sourceFileId,
      sourceType: "ONEDRIVE",
    },
  });

  const message = payload.summary;

  const data = {
    title: payload.title,
    message,
    alertType: payload.type,
    riskLevel: payload.priority,
    scamClusterId: cluster?.id ?? null,
    sourceType: "ONEDRIVE" as const,
    sourceName,
    sourceFileId,
    approvalStatus: "PENDING" as const,
    ...visibilityDefaults,
  };

  if (existing) {
    return prisma.alert.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.alert.create({
    data: {
      ...data,
      isSent: false,
    },
  });
}

/** Used by importer + retry — requires Graph file id. */
export async function upsertImportedAlert(
  prisma: PrismaClient,
  payload: ImportedAlertPayload,
  args: {
    sourceFileId: string | null;
    sourceFilePath: string;
  }
): Promise<{ alertId: string }> {
  void args.sourceFilePath;
  if (!args.sourceFileId) {
    throw new Error("sourceFileId is required for OneDrive ingestion.");
  }
  const alert = await upsertImportedAlertDraft(prisma, {
    payload,
    sourceFileId: args.sourceFileId,
    sourceName: payload.source_name,
  });
  return { alertId: alert.id };
}
