import type { MetadataRoute } from "next";
import { ClusterPublicStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { listApprovedPublicStories } from "@/lib/public-stories/service";
import { listPublishedBriefings } from "@/lib/briefings/queries";

const BASE_URL = "https://www.avasc.org";

/**
 * Add hreflang alternates (es, zh) to a sitemap entry. The `url` stays the
 * un-prefixed English URL (default locale under `localePrefix: "as-needed"`);
 * the localized variants get `/es` / `/zh` prefixes.
 */
function withLocaleAlternates(entry: MetadataRoute.Sitemap[number]): MetadataRoute.Sitemap[number] {
  const path = entry.url.startsWith(BASE_URL) ? entry.url.slice(BASE_URL.length) : entry.url;
  const suffix = path === "/" ? "" : path;
  return {
    ...entry,
    alternates: {
      languages: {
        es: `${BASE_URL}/es${suffix}`,
        zh: `${BASE_URL}/zh${suffix}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/database`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/report`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/recovery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/briefings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/statistics`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/how-to-identify-a-scam`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/what-to-do-if-youve-been-scammed`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/romance-scam-warning-signs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/cryptocurrency-scam-types`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/investment-scam-red-flags`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/phishing-email-protection`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/elder-fraud-prevention`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/social-media-scams`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/job-scam-warning-signs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/tech-support-scam-protection`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/online-shopping-scam-prevention`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/identity-theft-protection`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/money-mule-awareness`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/charity-scam-verification`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/business-email-compromise`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/sextortion-and-blackmail-scams`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic story pages
  let storyRoutes: MetadataRoute.Sitemap = [];
  try {
    const stories = await listApprovedPublicStories(200);
    storyRoutes = stories.map((story) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable during build — skip dynamic routes
    storyRoutes = [];
  }

  // Dynamic briefing article pages
  let briefingRoutes: MetadataRoute.Sitemap = [];
  try {
    const briefings = await listPublishedBriefings(200);
    briefingRoutes = briefings.map((b) => ({
      url: `${baseUrl}/briefings/${b.slug}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    briefingRoutes = [];
  }

  // Published scam-profile pages (/database/[slug]) — the core reference content.
  let databaseRoutes: MetadataRoute.Sitemap = [];
  try {
    const clusters = await prisma.scamCluster.findMany({
      where: { publicStatus: ClusterPublicStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
    databaseRoutes = clusters.map((c) => ({
      url: `${baseUrl}/database/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable during build — skip dynamic routes
    databaseRoutes = [];
  }

  return [...staticRoutes, ...databaseRoutes, ...storyRoutes, ...briefingRoutes].map(
    withLocaleAlternates
  );
}
