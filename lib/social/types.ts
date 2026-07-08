/**
 * Client-safe social types + labels. No server-only imports here (the Anthropic
 * SDK, prisma, etc.) so client components can import these without dragging server
 * modules into the browser bundle.
 */

export const SOCIAL_PLATFORMS = ["x", "linkedin", "facebook", "instagram"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialPost = {
  platform: SocialPlatform;
  /** Post body, ready to paste. For X this already fits within the limit incl. link + hashtags. */
  body: string;
  hashtags: string[];
};

const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  x: "X / Twitter",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
};

export function platformLabel(p: SocialPlatform): string {
  return PLATFORM_LABEL[p];
}
