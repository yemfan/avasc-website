"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SafeInfoAlert } from "./SafeInfoAlert";

export function EvidenceUploadClient({ caseId }: { caseId: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("uploading");
    setMessage("");
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      setStatus("error");
      setMessage("Choose a file first.");
      return;
    }

    try {
      const presign = await fetch("/api/evidence/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          contentLength: file.size,
        }),
      });
      const presignJson = (await presign.json()) as { success?: boolean; uploadUrl?: string; storageKey?: string; error?: string };
      if (!presign.ok || !presignJson.success || !presignJson.uploadUrl || !presignJson.storageKey) {
        throw new Error(presignJson.error ?? "Upload not available");
      }

      const put = await fetch(presignJson.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");

      const complete = await fetch("/api/evidence/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          storageKey: presignJson.storageKey,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });
      const doneJson = (await complete.json()) as { success?: boolean; error?: string };
      if (!complete.ok || !doneJson.success) throw new Error(doneJson.error ?? "Could not save file");

      setStatus("done");
      setMessage("File uploaded. It may take a moment to appear in your list.");
      input.value = "";
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="space-y-6">
      <SafeInfoAlert>
        Only upload files you own. If uploads are disabled in your environment, use Support to send files another way.
      </SafeInfoAlert>
      <form onSubmit={onUpload} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <Label htmlFor={`ev-${caseId}`}>Add evidence</Label>
        <Input id={`ev-${caseId}`} name="file" type="file" accept="image/*,application/pdf,application/zip" />
        <Button type="submit" disabled={status === "uploading"}>
          {status === "uploading" ? "Uploading…" : "Upload"}
        </Button>
        {message ? (
          <p className={`text-sm ${status === "error" ? "text-red-700" : "text-emerald-800"}`}>{message}</p>
        ) : null}
      </form>
    </div>
  );
}
