/**
 * AVASC indicator extraction + cluster scoring (production-oriented skeleton).
 * 1) Extract indicators from raw victim text
 * 2) Normalize via shared normalizers (consistent with CaseIndicator storage)
 * 3) Score similarity against cluster indicator aggregates
 * 4) Assign to existing cluster or suggest a new one for moderator review
 */

import {
  ClusterPublicStatus,
  IndicatorType,
  type RiskLevel,
} from "@prisma/client";
import {
  normalizeDomain,
  normalizeEmail,
  normalizePhone,
  normalizePlatform,
  normalizeTxHash,
  normalizeWallet,
} from "@/lib/matching/indicator-normalizers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ParsedIndicator = {
  type: IndicatorType;
  rawValue: string;
  normalizedValue: string;
  /** Heuristic confidence for extraction quality (0–1). */
  confidence: number;
};

export type IntakeCaseInput = {
  caseId: string;
  title?: string;
  scamType?: string;
  summary?: string;
  description: string;
  evidenceRaw?: string;
  contactMethod?: string;
  amountLost?: number | null;
};

export type ClusterCandidate = {
  clusterId: string;
  title: string;
  scamType: string;
  riskLevel: RiskLevel;
  publicStatus: ClusterPublicStatus;
  reportCount: number;
  indicators: Array<{
    type: IndicatorType;
    normalizedValue: string;
    isVerified?: boolean;
    linkedCaseCount?: number;
  }>;
};

export type ClusterMatchScore = {
  clusterId: string;
  totalScore: number;
  confidenceLabel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  matchedIndicatorTypes: IndicatorType[];
  matchedIndicators: Array<{
    type: IndicatorType;
    normalizedValue: string;
    weight: number;
    reason: string;
  }>;
  reasons: string[];
};

export type ClusterDecision =
  | {
      action: "ASSIGN_TO_EXISTING";
      clusterId: string;
      score: ClusterMatchScore;
    }
  | {
      action: "CREATE_NEW_CLUSTER_SUGGESTION";
      suggestedTitle: string;
      suggestedScamType: string;
      suggestedSummary: string;
      suggestedRiskLevel: RiskLevel;
      reasons: string[];
    };

// ---------------------------------------------------------------------------
// Regex extraction
// ---------------------------------------------------------------------------

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const DOMAIN_RE = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/gi;
const ETH_WALLET_RE = /\b0x[a-fA-F0-9]{40}\b/g;
const TX_HASH_RE = /\b0x[a-fA-F0-9]{64}\b/g;
const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{4,}\b/g;

const PLATFORM_KEYWORDS = [
  "whatsapp",
  "telegram",
  "signal",
  "facebook",
  "instagram",
  "discord",
  "wechat",
  "line",
  "tiktok",
  "twitter",
  "coinbase",
  "binance",
  "kraken",
  "paypal",
  "cash app",
  "zelle",
  "venmo",
] as const;

export function extractIndicatorsFromText(input: IntakeCaseInput): ParsedIndicator[] {
  const text = [input.title, input.summary, input.description, input.evidenceRaw, input.contactMethod]
    .filter(Boolean)
    .join("\n\n");

  const found: ParsedIndicator[] = [];

  for (const raw of uniqueMatches(text.match(EMAIL_RE))) {
    found.push({
      type: IndicatorType.EMAIL,
      rawValue: raw,
      normalizedValue: normalizeEmail(raw),
      confidence: 0.98,
    });
  }

  const emailDomains = new Set(
    found
      .filter((i) => i.type === IndicatorType.EMAIL)
      .map((i) => i.normalizedValue.split("@")[1])
      .filter((d): d is string => Boolean(d))
  );

  for (const raw of uniqueMatches(text.match(TX_HASH_RE))) {
    found.push({
      type: IndicatorType.TX_HASH,
      rawValue: raw,
      normalizedValue: normalizeTxHash(raw),
      confidence: 0.99,
    });
  }

  for (const raw of uniqueMatches(text.match(ETH_WALLET_RE))) {
    if (raw.length === 42) {
      found.push({
        type: IndicatorType.WALLET,
        rawValue: raw,
        normalizedValue: normalizeWallet(raw),
        confidence: 0.98,
      });
    }
  }

  for (const raw of uniqueMatches(text.match(DOMAIN_RE))) {
    const normalized = normalizeDomain(raw);
    if (emailDomains.has(normalized)) continue;

    found.push({
      type: IndicatorType.DOMAIN,
      rawValue: raw,
      normalizedValue: normalized,
      confidence: 0.9,
    });
  }

  for (const raw of uniqueMatches(text.match(PHONE_RE))) {
    const normalized = normalizePhone(raw);
    if (normalized.length >= 8) {
      found.push({
        type: IndicatorType.PHONE,
        rawValue: raw,
        normalizedValue: normalized,
        confidence: 0.8,
      });
    }
  }

  const lower = text.toLowerCase();
  for (const keyword of PLATFORM_KEYWORDS) {
    if (lower.includes(keyword)) {
      const nv = normalizePlatform(keyword);
      found.push({
        type: IndicatorType.PLATFORM,
        rawValue: keyword,
        normalizedValue: nv,
        confidence: 0.75,
      });
    }
  }

  return dedupeIndicators(found);
}

function uniqueMatches(matches: string[] | null): string[] {
  return [...new Set((matches ?? []).map((m) => m.trim()).filter(Boolean))];
}

function dedupeIndicators(items: ParsedIndicator[]): ParsedIndicator[] {
  const seen = new Set<string>();
  const output: ParsedIndicator[] = [];

  for (const item of items) {
    const key = `${item.type}:${item.normalizedValue}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(item);
    }
  }

  return output;
}

// ---------------------------------------------------------------------------
// Risk heuristic for new clusters
// ---------------------------------------------------------------------------

export function suggestRiskLevelForNewCluster(input: IntakeCaseInput, indicators: ParsedIndicator[]): RiskLevel {
  let score = 0;

  if ((input.amountLost ?? 0) >= 10_000) score += 2;
  if ((input.amountLost ?? 0) >= 50_000) score += 2;

  if (indicators.some((i) => i.type === IndicatorType.WALLET)) score += 2;
  if (indicators.some((i) => i.type === IndicatorType.DOMAIN)) score += 1;
  if (indicators.some((i) => i.type === IndicatorType.TX_HASH)) score += 2;
  if (
    indicators.some(
      (i) => i.type === IndicatorType.PLATFORM && ["whatsapp", "telegram"].includes(i.normalizedValue)
    )
  )
    score += 1;

  const scamType = (input.scamType ?? "").toLowerCase();
  if (scamType.includes("crypto") || scamType.includes("recovery") || scamType.includes("pig butchering")) score += 2;

  if (score >= 6) return "CRITICAL";
  if (score >= 4) return "HIGH";
  if (score >= 2) return "MEDIUM";
  return "LOW";
}

// ---------------------------------------------------------------------------
// Cluster scoring
// ---------------------------------------------------------------------------

const INDICATOR_WEIGHTS: Record<IndicatorType, number> = {
  [IndicatorType.TX_HASH]: 100,
  [IndicatorType.WALLET]: 85,
  [IndicatorType.DOMAIN]: 70,
  [IndicatorType.EMAIL]: 60,
  [IndicatorType.PHONE]: 50,
  [IndicatorType.SOCIAL_HANDLE]: 35,
  [IndicatorType.ALIAS]: 30,
  [IndicatorType.COMPANY_NAME]: 30,
  [IndicatorType.PLATFORM]: 20,
  [IndicatorType.BANK_ACCOUNT]: 40,
};

export function scoreCaseAgainstClusters(
  parsedIndicators: ParsedIndicator[],
  intake: IntakeCaseInput,
  clusters: ClusterCandidate[]
): ClusterMatchScore[] {
  const inputIndicatorMap = new Map(parsedIndicators.map((i) => [`${i.type}:${i.normalizedValue}`, i]));
  const results: ClusterMatchScore[] = [];

  for (const cluster of clusters) {
    let totalScore = 0;
    const matchedIndicatorTypes = new Set<IndicatorType>();
    const matchedIndicators: ClusterMatchScore["matchedIndicators"] = [];
    const reasons: string[] = [];

    for (const clusterIndicator of cluster.indicators) {
      const key = `${clusterIndicator.type}:${clusterIndicator.normalizedValue}`;
      const matched = inputIndicatorMap.get(key);
      if (!matched) continue;

      const baseWeight = INDICATOR_WEIGHTS[clusterIndicator.type] ?? 10;
      const verifiedBoost = clusterIndicator.isVerified ? 10 : 0;
      const caseDensityBoost = Math.min(clusterIndicator.linkedCaseCount ?? 0, 10);
      const weight = baseWeight + verifiedBoost + caseDensityBoost;

      totalScore += weight;
      matchedIndicatorTypes.add(clusterIndicator.type);
      matchedIndicators.push({
        type: clusterIndicator.type,
        normalizedValue: clusterIndicator.normalizedValue,
        weight,
        reason: `Matched ${clusterIndicator.type.toLowerCase()} exactly`,
      });
    }

    if (intake.scamType && cluster.scamType.toLowerCase() === intake.scamType.toLowerCase()) {
      totalScore += 20;
      reasons.push("Same scam type as existing cluster");
    }

    const description = `${intake.title ?? ""} ${intake.summary ?? ""} ${intake.description}`.toLowerCase();
    const clusterTitle = `${cluster.title} ${cluster.scamType}`.toLowerCase();
    if (description && overlapScore(description, clusterTitle) > 0.2) {
      totalScore += 10;
      reasons.push("Narrative overlap with cluster title or type");
    }

    if (matchedIndicatorTypes.size >= 2) {
      totalScore += 10;
      reasons.push("Multiple indicator types matched");
    }

    if (totalScore > 0) {
      results.push({
        clusterId: cluster.clusterId,
        totalScore,
        confidenceLabel: mapMatchScoreToConfidence(totalScore),
        matchedIndicatorTypes: [...matchedIndicatorTypes],
        matchedIndicators,
        reasons: [...reasons, ...matchedIndicators.map((m) => m.reason)],
      });
    }
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}

function overlapScore(a: string, b: string): number {
  const aTokens = new Set(tokenize(a));
  const bTokens = new Set(tokenize(b));
  if (!aTokens.size || !bTokens.size) return 0;
  let overlap = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap += 1;
  }
  return overlap / Math.max(aTokens.size, bTokens.size);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function mapMatchScoreToConfidence(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score >= 140) return "CRITICAL";
  if (score >= 90) return "HIGH";
  if (score >= 45) return "MEDIUM";
  return "LOW";
}

// ---------------------------------------------------------------------------
// Decision
// ---------------------------------------------------------------------------

const ASSIGN_THRESHOLD = 90;

export function decideClusterAssignment(
  intake: IntakeCaseInput,
  parsedIndicators: ParsedIndicator[],
  scoredMatches: ClusterMatchScore[]
): ClusterDecision {
  const best = scoredMatches[0];

  if (best && best.totalScore >= ASSIGN_THRESHOLD) {
    return {
      action: "ASSIGN_TO_EXISTING",
      clusterId: best.clusterId,
      score: best,
    };
  }

  const suggestedScamType = intake.scamType || inferScamTypeFromIndicators(parsedIndicators) || "Unknown Scam Pattern";
  const suggestedRiskLevel = suggestRiskLevelForNewCluster(intake, parsedIndicators);

  return {
    action: "CREATE_NEW_CLUSTER_SUGGESTION",
    suggestedTitle: suggestClusterTitle(intake, parsedIndicators),
    suggestedScamType,
    suggestedSummary: suggestClusterSummary(intake, parsedIndicators),
    suggestedRiskLevel,
    reasons: best
      ? [
          `Best existing cluster score too low (${best.totalScore}) for confident assignment`,
          "Create a new cluster suggestion for moderator review",
        ]
      : ["No meaningful existing cluster match found", "Create a new cluster suggestion for moderator review"],
  };
}

function inferScamTypeFromIndicators(indicators: ParsedIndicator[]): string | null {
  const hasWallet = indicators.some((i) => i.type === IndicatorType.WALLET);
  const hasDomain = indicators.some((i) => i.type === IndicatorType.DOMAIN);
  const hasWhatsApp = indicators.some(
    (i) => i.type === IndicatorType.PLATFORM && i.normalizedValue === "whatsapp"
  );

  if (hasWallet && hasDomain && hasWhatsApp) return "Fake Crypto Investment";
  if (hasWallet && !hasDomain) return "Crypto-Linked Scam Pattern";
  return null;
}

function suggestClusterTitle(intake: IntakeCaseInput, indicators: ParsedIndicator[]): string {
  const domain = indicators.find((i) => i.type === IndicatorType.DOMAIN)?.normalizedValue;
  const scamType = intake.scamType || inferScamTypeFromIndicators(indicators) || "Unknown Scam Pattern";

  if (domain) return `${scamType} – ${domain}`;
  const wallet = indicators.find((i) => i.type === IndicatorType.WALLET)?.normalizedValue;
  if (wallet) return `${scamType} – Shared Wallet Pattern`;
  return intake.title || `${scamType} – Emerging Pattern`;
}

function suggestClusterSummary(intake: IntakeCaseInput, indicators: ParsedIndicator[]): string {
  const parts: string[] = [];
  if (intake.description) parts.push(intake.description.slice(0, 220));

  const types = [...new Set(indicators.map((i) => i.type.toLowerCase()))];
  if (types.length) {
    parts.push(`Detected indicators: ${types.join(", ")}.`);
  }

  return parts.join(" ").trim() || "Emerging scam pattern pending moderator review.";
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export function runIndicatorAndClusteringEngine(args: {
  intake: IntakeCaseInput;
  existingClusters: ClusterCandidate[];
}) {
  const parsedIndicators = extractIndicatorsFromText(args.intake);
  const scoredMatches = scoreCaseAgainstClusters(parsedIndicators, args.intake, args.existingClusters);
  const decision = decideClusterAssignment(args.intake, parsedIndicators, scoredMatches);

  return {
    parsedIndicators,
    scoredMatches,
    decision,
  };
}
