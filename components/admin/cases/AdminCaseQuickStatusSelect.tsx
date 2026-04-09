"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { CaseStatus } from "@prisma/client";
import { quickSetCaseStatusAction } from "@/lib/admin/admin-cases-list";

const OPTIONS: CaseStatus[] = [
  "NEW",
  "PENDING_REVIEW",
  "NEEDS_FOLLOW_UP",
  "CLUSTERED",
  "PUBLISHED_ANONYMIZED",
  "CLOSED",
];

export function AdminCaseQuickStatusSelect({
  caseId,
  status,
}: {
  caseId: string;
  status: CaseStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label={`Status for case ${caseId}`}
      disabled={pending}
      value={status}
      onChange={(e) => {
        const next = e.target.value as CaseStatus;
        startTransition(async () => {
          try {
            await quickSetCaseStatusAction({ caseId, status: next });
            router.refresh();
          } catch {
            router.refresh();
          }
        });
      }}
      className="h-9 max-w-[200px] rounded-md border border-input bg-background px-2 text-xs text-foreground shadow-sm"
    >
      {OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
