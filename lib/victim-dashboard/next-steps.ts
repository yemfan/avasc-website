import type { CaseStatus, RecoveryStage } from "@prisma/client";

export type NextStepItem = { title: string; detail: string };

/**
 * Supportive, non-judgmental guidance — not a substitute for professional advice.
 */
export function getNextStepsForCase(params: {
  status: CaseStatus;
  scamType: string;
  supportOpen: boolean;
  recoveryStage: RecoveryStage;
}): NextStepItem[] {
  const steps: NextStepItem[] = [];

  steps.push({
    title: "Preserve what you have",
    detail:
      "Save screenshots, emails, transaction references, and chat logs somewhere safe. You’re not alone, and these details help if you report to banks or authorities.",
  });

  if (params.status === "NEW" || params.status === "PENDING_REVIEW" || params.status === "NEEDS_FOLLOW_UP") {
    steps.push({
      title: "Watch for follow-up scams",
      detail:
        "Scammers often pose as “recovery” services. Legitimate help does not ask for upfront fees to recover funds.",
    });
  }

  const st = params.scamType.toLowerCase();
  if (st.includes("crypto") || st.includes("investment")) {
    steps.push({
      title: "Crypto & investment scams",
      detail:
        "If you sent crypto, report to the exchange (if any), save wallet addresses and transaction hashes, and avoid sending more to “unlock” funds.",
    });
  }
  if (st.includes("romance")) {
    steps.push({
      title: "Romance scams",
      detail:
        "Stop sending money or gift cards. Talk to someone you trust offline. Report the profile to the platform.",
    });
  }
  if (st.includes("bank") || st.includes("wire") || st.includes("impersonation")) {
    steps.push({
      title: "Bank or wire fraud",
      detail:
        "Contact your bank’s fraud line as soon as you can. Ask what reversal or trace options exist for your situation.",
    });
  }

  if (params.supportOpen) {
    steps.push({
      title: "Support request in progress",
      detail: "We’ll use your case link to respond — you don’t need to repeat everything if you’ve already shared it.",
    });
  }

  const rs = params.recoveryStage;
  if (rs !== "NOT_STARTED") {
    steps.push({
      title: "Recovery stage",
      detail: `You indicated: ${rs.replace(/_/g, " ")}. Update your report if anything changes.`,
    });
  }

  steps.push({
    title: "Recovery resources",
    detail: "Browse AVASC recovery guides for checklists that match your situation.",
  });

  return steps.slice(0, 8);
}
