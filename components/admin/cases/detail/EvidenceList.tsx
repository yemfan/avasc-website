import Link from "next/link";
import { FileWarning } from "lucide-react";
import type { EvidenceFile } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/admin/format";
import { submitEvidenceReview } from "@/app/admin/cases/[id]/form-actions";

function staffReviewDefault(f: EvidenceFile): "none" | "reviewed" | "needs_redaction" {
  if (f.redactionStatus === "NEEDS_REDACTION") return "needs_redaction";
  if (f.isReviewed && (f.redactionStatus === "SAFE" || f.redactionStatus === "REDACTED")) {
    return "reviewed";
  }
  return "none";
}

export function EvidenceList({
  files,
  presignById,
  canEdit,
}: {
  files: EvidenceFile[];
  presignById: Map<string, { url: string | null; restricted?: boolean; error?: string | null }>;
  canEdit: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Evidence files</CardTitle>
        <p className="text-xs text-slate-500">
          Unsafe types are not opened inline; use presigned links only for allowed MIME types.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.length === 0 ? (
          <p className="text-sm text-slate-500">No files uploaded.</p>
        ) : (
          <ul className="space-y-4">
            {files.map((f) => {
              const link = presignById.get(f.id);
              const staff = staffReviewDefault(f);
              return (
                <li
                  key={f.id}
                  className="rounded-lg border border-slate-100 bg-slate-50/80 p-4 text-sm"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="font-mono text-[11px] text-slate-500">
                        {f.bucket}/{f.filePath}
                      </p>
                      <p className="text-slate-800">
                        <span className="font-medium">{f.fileName}</span>
                        <span className="text-slate-500"> · </span>
                        <span className="font-medium">{f.mimeType}</span>
                        <span className="text-slate-500"> · </span>
                        {(f.fileSize / 1024).toFixed(1)} KB
                        <span className="text-slate-500"> · </span>
                        {formatDate(f.createdAt)}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant="outline" className="text-[10px] font-normal">
                          Redaction: {f.redactionStatus}
                        </Badge>
                        <Badge
                          variant={
                            staff === "needs_redaction"
                              ? "warning"
                              : staff === "reviewed"
                                ? "success"
                                : "secondary"
                          }
                          className="text-[10px] font-normal"
                        >
                          Staff: {staff}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                      {link?.url ? (
                        <Button size="sm" variant="secondary" asChild>
                          <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            Open (safe type)
                          </Link>
                        </Button>
                      ) : link?.restricted ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-900">
                          <FileWarning className="h-4 w-4 shrink-0" />
                          Open disabled for this file type
                        </span>
                      ) : link?.error ? (
                        <span className="text-xs text-amber-800">{link.error}</span>
                      ) : null}
                    </div>
                  </div>
                  {canEdit ? (
                    <form
                      action={submitEvidenceReview}
                      className="mt-3 flex flex-wrap items-end gap-3 border-t border-slate-200/80 pt-3"
                    >
                      <input type="hidden" name="evidenceId" value={f.id} />
                      <div>
                        <Label className="text-xs" htmlFor={`ev-${f.id}`}>
                          Review status
                        </Label>
                        <select
                          id={`ev-${f.id}`}
                          name="staffReviewStatus"
                          defaultValue={staff}
                          className="mt-1 flex h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm"
                        >
                          <option value="none">None</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="needs_redaction">Needs redaction</option>
                        </select>
                      </div>
                      <Button type="submit" size="sm" variant="outline">
                        Save
                      </Button>
                    </form>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
