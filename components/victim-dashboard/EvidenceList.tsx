import type { EvidenceRedactionStatus } from "@prisma/client";
import type { VictimCaseDetail } from "@/lib/victim-dashboard/cases";
import { Badge } from "@/components/ui/badge";

function reviewLabel(isReviewed: boolean, redact: EvidenceRedactionStatus) {
  if (isReviewed && redact === "SAFE") return { text: "Reviewed", variant: "success" as const };
  if (redact === "NEEDS_REDACTION" || redact === "REDACTED") {
    return { text: "Redaction in progress", variant: "warning" as const };
  }
  if (redact === "NOT_REVIEWED") return { text: "Received", variant: "secondary" as const };
  return { text: "Received", variant: "secondary" as const };
}

export function EvidenceList({ files }: { files: VictimCaseDetail["evidence"] }) {
  if (files.length === 0) {
    return <p className="text-sm text-slate-600">No files uploaded yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {files.map((f) => {
        const rev = reviewLabel(f.isReviewed, f.redactionStatus);
        return (
          <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-slate-900">{f.fileLabel}</p>
              <p className="text-xs text-slate-500">
                {f.mimeType} · {(f.fileSize / 1024).toFixed(1)} KB · Uploaded{" "}
                {f.createdAt.toLocaleDateString(undefined, { dateStyle: "medium" })}
              </p>
            </div>
            <Badge variant={rev.variant === "success" ? "success" : rev.variant === "warning" ? "warning" : "secondary"}>
              {rev.text}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
