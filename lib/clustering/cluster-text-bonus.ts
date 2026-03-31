/**
 * Deterministic, tiny keyword overlap between case titles/summaries.
 * Supporting signal only — never sufficient alone for clustering decisions.
 */

const PHRASES = [
  "pay tax",
  "withdraw",
  "security deposit",
  "release funds",
  "verification fee",
  "recovery fee",
  "send crypto",
  "gas fee",
  "wallet verification",
] as const;

export function textSimilarityBonus(
  a: { title: string; summary: string | null },
  b: { title: string; summary: string | null }
): number {
  const ta = `${a.title} ${a.summary ?? ""}`.toLowerCase();
  const tb = `${b.title} ${b.summary ?? ""}`.toLowerCase();
  let hits = 0;
  for (const p of PHRASES) {
    if (ta.includes(p) && tb.includes(p)) hits += 1;
  }
  return Math.min(hits * 3, 12);
}
