import { importedAlertSchema, type ImportedAlertPayload } from "./validate-import-payload";

export type ParsedImportFile =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string };

/**
 * Parse JSON from buffer or string; validate with `validateImportPayload` next.
 */
export function parseImportFile(content: string | Buffer): ParsedImportFile {
  const text = typeof content === "string" ? content : content.toString("utf8").replace(/^\uFEFF/, "");
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "JSON root must be an object" };
  }
  return { ok: true, payload: raw as Record<string, unknown> };
}

/**
 * Handoff package: parse + validate in one step (throws on invalid JSON or schema).
 */
export function parseImportedAlertFile(rawText: string): ImportedAlertPayload {
  let json: unknown;
  try {
    json = JSON.parse(rawText) as unknown;
  } catch {
    throw new Error("Invalid JSON file.");
  }
  return importedAlertSchema.parse(json);
}
