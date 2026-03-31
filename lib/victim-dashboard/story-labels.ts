import type { ModerationStatus } from "@prisma/client";

export function storyStatusPresentation(
  status: ModerationStatus,
  publishedAt: Date | null
): { label: string; helper: string } {
  if (status === "APPROVED" && publishedAt) {
    return { label: "Published", helper: "Your story is live after moderation." };
  }
  switch (status) {
    case "DRAFT":
      return { label: "Draft", helper: "Save and submit when you’re ready — you can edit before review." };
    case "PENDING":
      return {
        label: "Pending review",
        helper: "Our team reviews stories for safety and privacy before publication.",
      };
    case "APPROVED":
      return { label: "Approved", helper: "Approved — publication timing may vary." };
    case "REJECTED":
      return {
        label: "Not published",
        helper: "This version wasn’t published. You can edit and resubmit if appropriate.",
      };
    case "FLAGGED":
      return { label: "Under review", helper: "This story needs additional review before it can appear publicly." };
    default:
      return { label: String(status), helper: "" };
  }
}
