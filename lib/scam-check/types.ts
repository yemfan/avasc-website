/** Client-safe Scam Check types + limits. No server-only imports. */

export const RISK_LEVELS = ["high", "medium", "low", "unclear"] as const;
export type ScamRisk = (typeof RISK_LEVELS)[number];

export type ScamCheckResource = { label: string; url: string };

export type ScamCheckResult = {
  /** Overall assessment. Never "safe" outright — low still means "stay cautious". */
  risk: ScamRisk;
  /** One-line plain-English headline, e.g. "This has strong signs of a crypto investment scam." */
  verdict: string;
  /** Best-guess scam pattern, or null if unclear. */
  scamType: string | null;
  /** Specific red flags / observations found in the description or screenshots. */
  signals: string[];
  /** What the person should do now, most important first. */
  whatToDo: string[];
  /** Where to report / get help. */
  reporting: ScamCheckResource[];
  /** Supportive, non-alarmist safety note (includes the "AI can be wrong" caveat). */
  caution: string;
};

export const MAX_DESC_CHARS = 4000;
export const MAX_IMAGES = 4;
/** Per-image cap on the base64 payload (~5MB of image data). */
export const MAX_IMAGE_BASE64_CHARS = 7_000_000;

export const RISK_META: Record<ScamRisk, { label: string; tone: string }> = {
  high: { label: "High risk — likely a scam", tone: "red" },
  medium: { label: "Suspicious — be careful", tone: "amber" },
  low: { label: "Fewer red flags — still stay cautious", tone: "green" },
  unclear: { label: "Not enough to tell yet", tone: "slate" },
};
