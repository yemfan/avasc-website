import type { SupportRequestStatus, SupportType } from "@prisma/client";

const LABELS: Record<SupportType, string> = {
  EMOTIONAL_SUPPORT: "Emotional support",
  REPORTING_HELP: "Help with reporting",
  RECOVERY_GUIDANCE: "Recovery guidance",
  LEGAL_REFERRAL: "Legal referral inquiry",
  MEDIA_ADVOCACY: "Media / advocacy interest",
  GENERAL_HELP: "General help",
};

export function supportTypeLabel(t: SupportType | string): string {
  return LABELS[t as SupportType] ?? String(t).replace(/_/g, " ");
}

export function supportStatusLabel(status: SupportRequestStatus | string): { label: string; helper: string } {
  const s = String(status).toLowerCase().trim();
  switch (s) {
    case "open":
      return {
        label: "Open",
        helper: "We’ve received your request. Our team will follow up when they can — there’s nothing else you need to do right now.",
      };
    case "in_progress":
    case "in progress":
      return {
        label: "In progress",
        helper: "Someone on our team is working on this. You’ll hear from us if we need more from you.",
      };
    case "closed":
      return {
        label: "Closed",
        helper: "We’ve closed this thread on our side. You can always start a new support request if you need more help.",
      };
    default:
      return {
        label: String(status).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        helper: "",
      };
  }
}
