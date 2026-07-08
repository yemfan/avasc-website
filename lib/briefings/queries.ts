import type { Briefing } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { BriefingSection, BriefingSource } from "@/lib/briefings/generate";

/** Normalized, render-ready view of a Briefing's structured body + sources. */
export type BriefingView = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  category: string;
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

/** One published briefing by slug, or null if missing / not published. */
export async function getPublishedBriefingBySlug(slug: string): Promise<BriefingView | null> {
  const row = await prisma.briefing.findUnique({ where: { slug } });
  if (!row || row.status !== "published") return null;
  return toView(row);
}
