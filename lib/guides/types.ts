/** Client-safe guidance types + constants. No server-only imports (Anthropic SDK etc.). */

export const MAX_SITUATION_CHARS = 4000;

export type GuidanceResource = { label: string; url: string };

export type Guidance = {
  acknowledgement: string;
  likelyScamType: string | null;
  immediateSteps: string[];
  reporting: GuidanceResource[];
  protectYourself: string[];
  emotionalSupport: string;
};
