"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveHumanTranslationAction, revertToMachineAction } from "../actions";

/**
 * Client editor for one ContentTranslation row. One textarea per field; Save
 * pins the values as human-authored, Revert drops back to the machine track.
 */
export function TranslationEditor({
  id,
  fields,
  editable,
}: {
  id: string;
  fields: Record<string, string>;
  editable: boolean;
}) {
  const router = useRouter();
  const keys = Object.keys(fields);
  const [values, setValues] = useState<Record<string, string>>(fields);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  }

  function onSave() {
    startTransition(async () => {
      const res = await saveHumanTranslationAction(id, values);
      if (res.ok) {
        setStatus({ kind: "ok", message: "Saved — this is now the pinned human translation." });
        router.refresh();
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }

  function onRevert() {
    startTransition(async () => {
      const res = await revertToMachineAction(id);
      if (res.ok) {
        setStatus({ kind: "ok", message: "Reverted — a fresh machine translation will be generated on next view." });
        router.refresh();
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }

  return (
    <div className="space-y-5">
      {keys.length === 0 ? (
        <p className="text-sm text-slate-500">This translation has no editable fields.</p>
      ) : (
        keys.map((key) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={`f-${key}`} className="text-xs font-medium text-slate-500">
              {key}
            </Label>
            <Textarea
              id={`f-${key}`}
              value={values[key] ?? ""}
              onChange={(e) => update(key, e.target.value)}
              disabled={!editable || pending}
              rows={Math.min(10, Math.max(2, Math.ceil((values[key]?.length ?? 0) / 80)))}
              className="text-slate-900"
            />
          </div>
        ))
      )}

      {status ? (
        <p className={`text-sm ${status.kind === "ok" ? "text-emerald-600" : "text-red-600"}`}>{status.message}</p>
      ) : null}

      {editable ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={onSave} disabled={pending || keys.length === 0}>
            {pending ? "Saving…" : "Save as human translation"}
          </Button>
          <Button variant="outline" onClick={onRevert} disabled={pending}>
            Revert to machine
          </Button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">You have read-only access to translations.</p>
      )}
    </div>
  );
}
