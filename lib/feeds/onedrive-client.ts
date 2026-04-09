import { createHash } from "node:crypto";

/** Microsoft Graph v1.0 root (handoff package). */
export const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

export type DriveItem = {
  id: string;
  name: string;
  webUrl?: string;
  parentReference?: { path?: string; id?: string };
};

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

/**
 * App-only + drive: set `ONEDRIVE_DRIVE_ID` and folder item IDs.
 * Delegated `/me` flows: omit `ONEDRIVE_DRIVE_ID` (requires a user token — not client credentials).
 */
export function isOnedriveConfigured(): boolean {
  return Boolean(
    env("ONEDRIVE_TENANT_ID") && env("ONEDRIVE_CLIENT_ID") && env("ONEDRIVE_CLIENT_SECRET")
  );
}

/** Handoff package: throws when token cannot be obtained. */
export async function getOneDriveAccessToken(): Promise<string> {
  const tenant = env("ONEDRIVE_TENANT_ID");
  const clientId = env("ONEDRIVE_CLIENT_ID");
  const secret = env("ONEDRIVE_CLIENT_SECRET");
  if (!tenant || !clientId || !secret) {
    throw new Error("OneDrive env ONEDRIVE_TENANT_ID, ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET are required.");
  }

  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: secret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(`Failed to get OneDrive token: ${res.status} ${data.error_description ?? ""}`);
  }
  return data.access_token;
}

function itemsUrlForFolder(folderId: string): string {
  const driveId = env("ONEDRIVE_DRIVE_ID");
  if (driveId) {
    return `${GRAPH_BASE}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(folderId)}/children?$top=200`;
  }
  return `${GRAPH_BASE}/me/drive/items/${encodeURIComponent(folderId)}/children?$top=200`;
}

function itemContentUrl(itemId: string): string {
  const driveId = env("ONEDRIVE_DRIVE_ID");
  if (driveId) {
    return `${GRAPH_BASE}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/content`;
  }
  return `${GRAPH_BASE}/me/drive/items/${encodeURIComponent(itemId)}/content`;
}

function itemPatchUrl(itemId: string): string {
  const driveId = env("ONEDRIVE_DRIVE_ID");
  if (driveId) {
    return `${GRAPH_BASE}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}`;
  }
  return `${GRAPH_BASE}/me/drive/items/${encodeURIComponent(itemId)}`;
}

/** Handoff package: list children (all items — filter `.json` in the importer). */
export async function listFolderItems(folderId: string): Promise<DriveItem[]> {
  const token = await getOneDriveAccessToken();
  const res = await fetch(itemsUrlForFolder(folderId), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to list OneDrive folder items: ${res.status}`);
  }
  const data = (await res.json()) as {
    value?: { id: string; name: string; webUrl?: string; parentReference?: { path?: string; id?: string } }[];
  };
  return (data.value ?? []).map((i) => ({
    id: i.id,
    name: i.name,
    webUrl: i.webUrl,
    parentReference: i.parentReference,
  }));
}

/** Download item body as UTF-8 text (JSON feeds). */
export async function downloadDriveItemText(itemId: string): Promise<string> {
  const token = await getOneDriveAccessToken();
  const res = await fetch(itemContentUrl(itemId), {
    headers: { Authorization: `Bearer ${token}` },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Failed to download OneDrive item: ${res.status}`);
  }
  return await res.text();
}

/** Handoff package: SHA-256 of UTF-8 text (for dedupe). */
export function checksumText(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** SHA-256 of binary content (legacy / binary-safe). */
export function sha256Hex(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

/** Handoff package name for moving an item to another folder by id. */
export async function moveDriveItem(itemId: string, destinationFolderId: string): Promise<void> {
  const token = await getOneDriveAccessToken();
  const res = await fetch(itemPatchUrl(itemId), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parentReference: { id: destinationFolderId },
    }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(`Failed to move OneDrive item: ${res.status} ${err.error?.message ?? ""}`);
  }
}

/** Backward compat — returns false on failure instead of throwing. */
export async function moveDriveItemToFolder(itemId: string, destinationFolderId: string): Promise<boolean> {
  try {
    await moveDriveItem(itemId, destinationFolderId);
    return true;
  } catch (e) {
    console.error("[onedrive] moveDriveItemToFolder", e);
    return false;
  }
}

/** List `.json` files only (app-only drive path when `ONEDRIVE_DRIVE_ID` is set). */
export async function listJsonFilesInFolder(folderItemId: string): Promise<DriveItem[]> {
  try {
    const items = await listFolderItems(folderItemId);
    return items.filter((i) => i.name.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error("[onedrive] listJsonFilesInFolder", e);
    return [];
  }
}

export async function downloadDriveItem(itemId: string): Promise<Buffer | null> {
  try {
    const text = await downloadDriveItemText(itemId);
    return Buffer.from(text, "utf8");
  } catch (e) {
    console.error("[onedrive] downloadDriveItem", e);
    return null;
  }
}
