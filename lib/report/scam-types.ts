/** Client-safe report field constants shared by the form, the AI-fill prompt, and the assist UI. */

export const SCAM_TYPES = [
  "Fake Crypto Investment",
  "Romance Scam",
  "Fake Recovery Scam",
  "Phishing",
  "Impersonation Scam",
  "Other",
] as const;

export type ScamTypeOption = (typeof SCAM_TYPES)[number];

/** Fields the AI assist can suggest for the report form. Empty string = leave blank. */
export type ReportFieldSuggestion = {
  title: string;
  scamType: string;
  description: string;
  amountLost: string;
  contactMethod: string;
  evidence: string;
};

export const MAX_ACCOUNT_CHARS = 4000;
