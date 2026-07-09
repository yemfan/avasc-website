/**
 * Redact STRUCTURED PII from free text before it is sent to an external model
 * (used for "translate a private case narrative for moderator review").
 *
 * Catches: emails, URLs, @handles, long hex/wallet strings, card numbers,
 * SSNs, phone numbers, and long digit runs (account numbers). Each is replaced
 * with a stable placeholder so the translated text stays readable.
 *
 * IMPORTANT: this is a REDUCTION of exposure, not a guarantee. Free-form names,
 * street addresses, and other unstructured identifiers are NOT detected by
 * regex and can still pass through. Treat the redacted text accordingly.
 *
 * Currency amounts (e.g. "$4,200") are intentionally preserved — they are useful
 * context for review and are not identifying on their own.
 */

const RULES: Array<[RegExp, string]> = [
  // Emails first (before @handles / phone digits inside them).
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]"],
  // URLs.
  [/\bhttps?:\/\/\S+/gi, "[link]"],
  // Social @handles.
  [/(^|\s)@[A-Za-z0-9_]{2,}/g, "$1[handle]"],
  // Crypto wallets / tx hashes / other long hex ids.
  [/\b(?:0x)?[a-f0-9]{16,}\b/gi, "[id]"],
  // Card-like numbers: 13–19 digits with optional space/dash separators
  // (anchored to start/end on a digit so a trailing separator isn't consumed).
  [/\b\d(?:[ -]?\d){12,18}\b/g, "[card]"],
  // US SSNs.
  [/\b\d{3}-\d{2}-\d{4}\b/g, "[ssn]"],
  // Phone numbers (loose, international-ish): a run of digits + separators.
  [/\+?\d(?:[\d\s().-]{7,})\d/g, "[phone]"],
  // Any remaining long digit run (account / reference numbers).
  [/\b\d{6,}\b/g, "[number]"],
];

/** Return `input` with structured PII replaced by placeholders. */
export function redactPii(input: string): string {
  if (!input) return input;
  let out = input;
  for (const [pattern, replacement] of RULES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
