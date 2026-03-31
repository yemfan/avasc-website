import type { EvidenceFile } from "@prisma/client";

type AdminCaseEvidenceCardProps = {
  evidenceFiles: EvidenceFile[];
};

export function AdminCaseEvidenceCard({ evidenceFiles }: AdminCaseEvidenceCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Evidence Files</h3>

      <div className="mt-4 space-y-3">
        {evidenceFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No evidence files uploaded.</p>
        ) : (
          evidenceFiles.map((file) => (
            <div key={file.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{file.fileName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {file.mimeType} · {formatBytes(file.fileSize)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {file.bucket}/{file.filePath}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge>{file.redactionStatus}</Badge>
                  <Badge variant="outline">
                    {file.isReviewed ? "Reviewed" : "Not Reviewed"}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground"
      : "bg-muted text-foreground";

  return (
    <span className={`rounded-full px-3 py-1 ${styles}`}>{children}</span>
  );
}
