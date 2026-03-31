import {
  Case,
  CaseStatus,
  CaseVisibility,
  RecoveryStage,
} from "@prisma/client";
import { updateCaseModerationAction } from "@/app/admin/cases/[id]/actions";

type AdminCaseModerationCardProps = {
  record: Pick<
    Case,
    "id" | "status" | "visibility" | "recoveryStage" | "internalNotes"
  >;
};

const caseStatuses = Object.values(CaseStatus);
const caseVisibilities = Object.values(CaseVisibility);
const recoveryStages = Object.values(RecoveryStage);

export function AdminCaseModerationCard({
  record,
}: AdminCaseModerationCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Moderation Actions</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Update the case review state, public visibility, and internal notes.
      </p>

      <form action={updateCaseModerationAction} className="mt-6 space-y-5">
        <input type="hidden" name="caseId" value={record.id} />

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Case Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={record.status}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {caseStatuses.map((status) => (
              <option key={status} value={status}>
                {formatEnum(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="visibility"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            defaultValue={record.visibility}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {caseVisibilities.map((visibility) => (
              <option key={visibility} value={visibility}>
                {formatEnum(visibility)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="recoveryStage"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Recovery Stage
          </label>
          <select
            id="recoveryStage"
            name="recoveryStage"
            defaultValue={record.recoveryStage}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {recoveryStages.map((stage) => (
              <option key={stage} value={stage}>
                {formatEnum(stage)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="internalNotes"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Internal Notes
          </label>
          <textarea
            id="internalNotes"
            name="internalNotes"
            defaultValue={record.internalNotes || ""}
            rows={8}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            placeholder="Add internal review notes, moderation rationale, or follow-up guidance..."
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
