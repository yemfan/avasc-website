import type { PrismaClient } from "@prisma/client";

import { prisma as defaultPrisma } from "@/lib/prisma";
import {
  checksumText,
  downloadDriveItemText,
  isOnedriveConfigured,
  listFolderItems,
  moveDriveItem,
  moveDriveItemToFolder,
} from "@/lib/feeds/onedrive-client";
import { parseImportedAlertFile } from "@/lib/feeds/parse-import-file";
import { upsertImportedAlertDraft } from "@/lib/feeds/upsert-imported-alert";

export type ImportContentType = "REALTIME" | "DAILY" | "WEEKLY";

/** Ingestion rows that count as “already processed” for checksum / source_id dedupe. */
const DEDUPE_STATUSES = ["PENDING_APPROVAL", "APPROVED"] as const;

function folderIdByType(type: ImportContentType): string | undefined {
  if (type === "REALTIME") return process.env.ONEDRIVE_REALTIME_FOLDER_ID?.trim();
  if (type === "DAILY") return process.env.ONEDRIVE_DAILY_FOLDER_ID?.trim();
  return process.env.ONEDRIVE_WEEKLY_FOLDER_ID?.trim();
}

function archiveFolderId(): string | undefined {
  return process.env.ONEDRIVE_ARCHIVE_FOLDER_ID?.trim();
}

function invalidFolderId(): string | undefined {
  return process.env.ONEDRIVE_INVALID_FOLDER_ID?.trim();
}

async function isDuplicateIngestion(
  prisma: PrismaClient,
  args: { checksum: string; sourcePayloadId: string }
): Promise<boolean> {
  const byChecksum = await prisma.externalContentIngestion.findFirst({
    where: {
      checksum: args.checksum,
      status: { in: [...DEDUPE_STATUSES] },
    },
  });
  if (byChecksum) return true;

  const byPayload = await prisma.externalContentIngestion.findFirst({
    where: {
      sourcePayloadId: args.sourcePayloadId,
      status: { in: [...DEDUPE_STATUSES] },
    },
  });
  return Boolean(byPayload);
}

export type OnedriveImportResult = {
  kind: ImportContentType;
  scanned: number;
  imported: number;
  skippedDuplicate: number;
  failed: number;
  noop: boolean;
};

/**
 * Handoff package: `{ processed, skipped, failed }` using the app `prisma` singleton.
 */
export async function importOneDriveFeed(
  type: ImportContentType
): Promise<{ processed: number; skipped: number; failed: number }> {
  const r = await runOnedriveImportJob(defaultPrisma, type);
  return {
    processed: r.imported,
    skipped: r.skippedDuplicate,
    failed: r.failed,
  };
}

/**
 * Full stats + noop flag for cron JSON (`ok`, `kind`, etc.).
 */
export async function runOnedriveImportJob(
  prisma: PrismaClient,
  kind: ImportContentType
): Promise<OnedriveImportResult> {
  const result: OnedriveImportResult = {
    kind,
    scanned: 0,
    imported: 0,
    skippedDuplicate: 0,
    failed: 0,
    noop: false,
  };

  if (!isOnedriveConfigured()) {
    result.noop = true;
    return result;
  }

  const folderId = folderIdByType(kind);
  if (!folderId) {
    result.noop = true;
    return result;
  }

  let items: { id: string; name: string; parentReference?: { path?: string } }[];
  try {
    items = await listFolderItems(folderId);
  } catch (e) {
    console.error("[onedrive-importer] listFolderItems", e);
    result.failed++;
    return result;
  }

  const jsonItems = items.filter((item) => item.name.toLowerCase().endsWith(".json"));
  result.scanned = jsonItems.length;

  const archiveId = archiveFolderId();
  const invalidId = invalidFolderId();

  for (const item of jsonItems) {
    const existingFile = await prisma.externalContentIngestion.findFirst({
      where: { sourceFileId: item.id },
    });
    if (existingFile) {
      result.skippedDuplicate++;
      continue;
    }

    let ingestionId: string | null = null;

    try {
      const rawText = await downloadDriveItemText(item.id);
      const checksum = checksumText(rawText);

      const dupeByChecksum = await prisma.externalContentIngestion.findFirst({
        where: {
          checksum,
          status: { in: [...DEDUPE_STATUSES] },
        },
      });
      if (dupeByChecksum) {
        result.skippedDuplicate++;
        continue;
      }

      const sourcePath = item.parentReference?.path ?? `${kind}/${item.name}`;

      const ingestion = await prisma.externalContentIngestion.create({
        data: {
          sourceName: "OneDrive Feed",
          sourceFilePath: sourcePath,
          sourceFileId: item.id,
          sourceType: "ONEDRIVE",
          contentType: kind,
          checksum,
          rawPayload: {},
          status: "NEW",
        },
      });
      ingestionId = ingestion.id;

      const payload = parseImportedAlertFile(rawText);

      if (payload.type !== kind) {
        throw new Error(`JSON type ${payload.type} does not match folder ${kind}`);
      }

      const dup = await isDuplicateIngestion(prisma, {
        checksum,
        sourcePayloadId: payload.source_id,
      });
      if (dup) {
        await prisma.externalContentIngestion.update({
          where: { id: ingestion.id },
          data: {
            rawPayload: payload as object,
            sourceName: payload.source_name,
            sourcePayloadId: payload.source_id,
            status: "FAILED",
            errorMessage: "Duplicate source_id relative to an existing import",
            processedAt: new Date(),
          },
        });
        result.skippedDuplicate++;
        if (invalidId) {
          try {
            await moveDriveItem(item.id, invalidId);
          } catch {
            await moveDriveItemToFolder(item.id, invalidId);
          }
        }
        continue;
      }

      const alert = await upsertImportedAlertDraft(prisma, {
        payload,
        sourceFileId: item.id,
        sourceName: payload.source_name,
      });

      await prisma.externalContentIngestion.update({
        where: { id: ingestion.id },
        data: {
          rawPayload: payload as object,
          sourceName: payload.source_name,
          sourcePayloadId: payload.source_id,
          status: "PENDING_APPROVAL",
          linkedAlertId: alert.id,
          processedAt: new Date(),
        },
      });

      if (archiveId) {
        try {
          await moveDriveItem(item.id, archiveId);
        } catch {
          await moveDriveItemToFolder(item.id, archiveId);
        }
      }
      result.imported++;
    } catch (error) {
      result.failed++;
      const msg = error instanceof Error ? error.message : "Unknown import error";

      if (ingestionId) {
        await prisma.externalContentIngestion.update({
          where: { id: ingestionId },
          data: {
            status: "FAILED",
            errorMessage: msg,
            processedAt: new Date(),
          },
        });
      }

      if (invalidId) {
        try {
          await moveDriveItem(item.id, invalidId);
        } catch {
          await moveDriveItemToFolder(item.id, invalidId);
        }
      }
    }
  }

  return result;
}
