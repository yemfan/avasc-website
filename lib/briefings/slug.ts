/**
 * Slugify a briefing title with the publication date so each weekly briefing has
 * a stable, unique, dated URL (e.g. "romance-scam-surge-2026-07-06").
 */
export function slugifyBriefingTitle(title: string, date = new Date()): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);

  const datePart = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const slugBase = base || "this-week-in-scams";
  return `${slugBase}-${datePart}`;
}
