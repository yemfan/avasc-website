import { prisma } from "@/lib/prisma";
import type { SocialPost } from "@/lib/social/types";

export type AdminDailyPost = {
  id: string;
  date: string;
  theme: string;
  themeLabel: string;
  status: string;
  linkUrl: string | null;
  posts: SocialPost[];
};

export type BlogPostItem = {
  id: string;
  date: string;
  theme: string;
  themeLabel: string;
  body: string;
  hashtags: string[];
  linkUrl: string | null;
};

const THEME_LABELS: Record<string, string> = {
  scam_spotlight: "Scam spotlight",
  red_flag: "Red-flag warning",
  stat: "Scam stat",
  story: "Survivor story",
  this_week: "This Week in Scams",
  protect: "Protect yourself",
  get_help: "Where to get help",
};

export function dailyThemeLabel(theme: string): string {
  return THEME_LABELS[theme] ?? theme;
}

/** Recent daily posts for the public Blog feed (published only; longest copy per day). */
export async function listRecentDailyPosts(limit = 60): Promise<BlogPostItem[]> {
  const rows = await prisma.socialDailyPost.findMany({
    where: { status: { notIn: ["pending", "rejected"] } },
    orderBy: { postDate: "desc" },
    take: limit,
  });

  return rows
    .map((r): BlogPostItem => {
      const posts = Array.isArray(r.posts) ? (r.posts as unknown as SocialPost[]) : [];
      // Prefer the fuller copy for a blog reading experience.
      const pick =
        posts.find((p) => p.platform === "linkedin") ??
        posts.find((p) => p.platform === "facebook") ??
        posts.find((p) => p.platform === "instagram") ??
        posts[0];
      return {
        id: r.id,
        date: r.postDate.toISOString().slice(0, 10),
        theme: r.theme,
        themeLabel: dailyThemeLabel(r.theme),
        body: pick?.body ?? "",
        hashtags: pick?.hashtags ?? [],
        linkUrl: r.linkUrl,
      };
    })
    .filter((x) => x.body.length > 0);
}

/** Recent daily posts for the admin queue (all statuses, full platform copy). */
export async function listDailyPostsForAdmin(limit = 30): Promise<AdminDailyPost[]> {
  const rows = await prisma.socialDailyPost.findMany({ orderBy: { postDate: "desc" }, take: limit });
  return rows.map((r) => ({
    id: r.id,
    date: r.postDate.toISOString().slice(0, 10),
    theme: r.theme,
    themeLabel: dailyThemeLabel(r.theme),
    status: r.status,
    linkUrl: r.linkUrl,
    posts: Array.isArray(r.posts) ? (r.posts as unknown as SocialPost[]) : [],
  }));
}
