/**
 * Example intake + clusters for manual tests or REPL — not imported by production routes.
 */

import { ClusterPublicStatus, IndicatorType, RiskLevel } from "@prisma/client";
import {
  type IntakeCaseInput,
  runIndicatorAndClusteringEngine,
  type ClusterCandidate,
} from "./intake-cluster-engine";

export const demoIntakeCase: IntakeCaseInput = {
  caseId: "case_123",
  title: "Could not withdraw funds after profit screenshot",
  scamType: "Fake Crypto Investment",
  description:
    "They contacted me on WhatsApp and told me to invest. The platform showed big profits, but when I tried to withdraw they asked me to pay taxes first. The website used was primegrowth-asset.com and they gave me wallet 0x1234567890abcdef1234567890abcdef12345678.",
  amountLost: 25000,
};

export const demoClusterCandidates: ClusterCandidate[] = [
  {
    clusterId: "cluster_1",
    title: "Fake Crypto Investment Group – Shared Wallet / Domain Pattern",
    scamType: "Fake Crypto Investment",
    riskLevel: RiskLevel.CRITICAL,
    publicStatus: ClusterPublicStatus.PUBLISHED,
    reportCount: 24,
    indicators: [
      {
        type: IndicatorType.DOMAIN,
        normalizedValue: "primegrowth-asset.com",
        isVerified: true,
        linkedCaseCount: 12,
      },
      {
        type: IndicatorType.WALLET,
        normalizedValue: "0x1234567890abcdef1234567890abcdef12345678",
        isVerified: true,
        linkedCaseCount: 9,
      },
      {
        type: IndicatorType.PLATFORM,
        normalizedValue: "whatsapp",
        linkedCaseCount: 15,
      },
    ],
  },
];

export function getDemoEngineResult() {
  return runIndicatorAndClusteringEngine({
    intake: demoIntakeCase,
    existingClusters: demoClusterCandidates,
  });
}
