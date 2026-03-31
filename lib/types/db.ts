export type IndicatorType =
  | "phone"
  | "email"
  | "domain"
  | "wallet"
  | "tx_hash"
  | "social_handle"
  | "alias"
  | "app_platform"
  | "other";
export type UserRole = "victim" | "admin" | "moderator";
export type CaseVisibility = "private" | "anonymized" | "public";
export type CaseStatus = "draft" | "submitted" | "under_review" | "closed";
export type StoryStatus = "pending" | "approved" | "rejected";
export type CommentStatus = "pending" | "approved" | "rejected";
