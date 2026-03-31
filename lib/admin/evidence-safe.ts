/** MIME types we allow staff to open via presigned GET in-browser (no inline rendering). */
export function isEvidenceOpenSafe(mimeType: string): boolean {
  const m = mimeType.toLowerCase();
  if (m.startsWith("image/")) return true;
  if (m.startsWith("text/")) return true;
  if (m === "application/pdf") return true;
  return false;
}
