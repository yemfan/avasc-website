import { ClusterPublicStatus, RiskLevel, ScamCluster } from "@prisma/client";
import { updateClusterAction } from "@/lib/admin/admin-cluster-detail-actions";

type AdminClusterEditCardProps = {
  cluster: ScamCluster;
};

export function AdminClusterEditCard({ cluster }: AdminClusterEditCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Edit Cluster</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Update the public-facing summary and internal publishing settings.
      </p>

      <form action={updateClusterAction} className="mt-6 space-y-5">
        <input type="hidden" name="clusterId" value={cluster.id} />

        <Field label="Title" name="title" defaultValue={cluster.title} />
        <Field label="Slug" name="slug" defaultValue={cluster.slug} />
        <Field label="Scam Type" name="scamType" defaultValue={cluster.scamType} />

        <TextArea
          label="Summary"
          name="summary"
          defaultValue={cluster.summary}
          rows={5}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Public Status"
            name="publicStatus"
            defaultValue={cluster.publicStatus}
            options={Object.values(ClusterPublicStatus)}
          />
          <SelectField
            label="Risk Level"
            name="riskLevel"
            defaultValue={cluster.riskLevel}
            options={Object.values(RiskLevel)}
          />
        </div>

        <TextArea
          label="Red Flags"
          name="redFlags"
          defaultValue={cluster.redFlags || ""}
          rows={4}
        />
        <TextArea
          label="Common Script"
          name="commonScript"
          defaultValue={cluster.commonScript || ""}
          rows={4}
        />
        <TextArea
          label="Safety Warning"
          name="safetyWarning"
          defaultValue={cluster.safetyWarning || ""}
          rows={4}
        />
        <TextArea
          label="Recommended Next Step"
          name="recommendedNextStep"
          defaultValue={cluster.recommendedNextStep || ""}
          rows={4}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Save Cluster
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows,
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatEnum(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
