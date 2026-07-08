import type { Briefing } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { BriefingKind, BriefingSection, BriefingSource } from "@/lib/briefings/generate";

/** Normalized, render-ready view of a Briefing's structured body + sources. */
export type BriefingView = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  status: string;
  summary: string | null;
  periodLabel: string | null;
  publishedAt: Date;
  updatedAt: Date;
  sections: BriefingSection[];
  keyPoints: string[];
  protectYourself: string[];
  sources: BriefingSource[];
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

function asSections(value: unknown): BriefingSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((s): BriefingSection | null => {
      if (!s || typeof s !== "object") return null;
      const sec = s as Record<string, unknown>;
      const heading = typeof sec.heading === "string" ? sec.heading : "";
      const paragraphs = asStringArray(sec.paragraphs);
      if (!heading || paragraphs.length === 0) return null;
      return { heading, paragraphs };
    })
    .filter((s): s is BriefingSection => s !== null);
}

function asSources(value: unknown): BriefingSource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((s): BriefingSource | null => {
      if (!s || typeof s !== "object") return null;
      const src = s as Record<string, unknown>;
      const url = typeof src.url === "string" ? src.url : "";
      if (!/^https?:\/\//i.test(url)) return null;
      const title = typeof src.title === "string" && src.title.trim() ? src.title : url;
      const publisher = typeof src.publisher === "string" && src.publisher.trim() ? src.publisher : undefined;
      return { title, url, publisher };
    })
    .filter((s): s is BriefingSource => s !== null);
}

function toView(row: Briefing): BriefingView {
  const body = (row.bodyJson ?? {}) as Record<string, unknown>;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek,
    category: row.category,
    status: row.status,
    summary: row.summary,
    periodLabel: row.periodLabel,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    sections: asSections(body.sections),
    keyPoints: asStringArray(body.keyPoints),
    protectYourself: asStringArray(body.protectYourself),
    sources: asSources(row.sources),
  };
}

/** Published briefings, newest first (for the index). Falls back to [] on any DB error. */
export async function listPublishedBriefings(limit = 50): Promise<BriefingView[]> {
  const rows = await prisma.briefing.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(toView);
}

/**
 * Briefings of a given cadence (category = kind), newest first — for the admin
 * management lists. Includes non-published rows so admins see the full history.
 */
export async function listBriefings(kind: BriefingKind, limit = 30): Promise<BriefingView[]> {
  const rows = await prisma.briefing.findMany({
    where: { category: kind },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map(toView);
}

/** One published briefing by slug, or null if missing / not published. */
export async function getPublishedBriefingBySlug(slug: string): Promise<BriefingView | null> {
  const row = await prisma.briefing.findUnique({ where: { slug } });
  if (!row || row.status !== "published") return null;
  return toView(row);
}

/** Most recent published briefing of a cadence (category = kind), or null. Used by the subscriber send. */
export async function getLatestPublishedBriefing(kind: BriefingKind): Promise<BriefingView | null> {
  const row = await prisma.briefing.findFirst({
    where: { category: kind, status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  return row ? toView(row) : null;
}
