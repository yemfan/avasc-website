import { ImageResponse } from "next/og";
import sharp from "sharp";

import { prisma } from "@/lib/prisma";
import { dailyThemeLabel } from "@/lib/social/daily-queries";
import type { SocialPost } from "@/lib/social/types";

// sharp (PNG -> JPEG) needs the Node runtime; Instagram requires a JPEG image_url.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

/** Short, clean headline for the card: strip links + hashtags, first sentence. */
function headlineFor(posts: SocialPost[]): string {
  const src = posts.find((p) => p.platform === "x")?.body ?? posts.find((p) => p.platform === "instagram")?.body ?? posts[0]?.body ?? "";
  const clean = src
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#[\w-]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  const firstSentence = clean.split(/(?<=[.!?])\s/)[0] ?? clean;
  return (firstSentence.length > 170 ? `${firstSentence.slice(0, 167)}…` : firstSentence) || "Stay a step ahead of scams.";
}

export async function GET(_req: Request, { params }: PageProps) {
  const { id } = await params;
  const row = await prisma.socialDailyPost.findUnique({ where: { id } }).catch(() => null);
  const posts = row && Array.isArray(row.posts) ? (row.posts as unknown as SocialPost[]) : [];
  const eyebrow = row ? dailyThemeLabel(row.theme).toUpperCase() : "SCAM AWARENESS";
  const headline = posts.length ? headlineFor(posts) : "Stay a step ahead of scams.";

  const png = new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "88px",
          background: "linear-gradient(150deg, #050912 0%, #0c1a32 55%, #0a1424 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "60px", fontWeight: 800, color: "#f0d08a", letterSpacing: "-1px" }}>AVASC</span>
            <span style={{ fontSize: "26px", color: "#9CA3AF" }}>Association of Victims Against Cyber-Scams</span>
          </div>
          <div
            style={{
              marginTop: "56px",
              alignSelf: "flex-start",
              display: "flex",
              padding: "12px 26px",
              borderRadius: "999px",
              border: "2px solid rgba(201,148,60,0.4)",
              background: "rgba(201,148,60,0.10)",
              color: "#f0d08a",
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "3px",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <span style={{ fontSize: "70px", lineHeight: 1.18, fontWeight: 700, color: "#EAECEF" }}>{headline}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "34px", fontWeight: 700, color: "#f0d08a" }}>avasc.org</span>
          <span style={{ fontSize: "28px", color: "#9CA3AF" }}>Report · Learn · Recover</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );

  const pngBuf = Buffer.from(await png.arrayBuffer());
  const jpeg = await sharp(pngBuf).jpeg({ quality: 88 }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
