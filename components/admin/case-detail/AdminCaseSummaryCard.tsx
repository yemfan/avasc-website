import type { Case } from "@prisma/client";

type AdminCaseSummaryCardProps = {
  record: Case;
};

export function AdminCaseSummaryCard({ record }: AdminCaseSummaryCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Case Summary</h3>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Item label="Scam Type" value={record.scamType} />
        <Item label="Status" value={record.status} />
        <Item label="Visibility" value={record.visibility} />
        <Item label="Recovery Stage" value={record.recoveryStage} />
        <Item
          label="Amount Lost"
          value={
            record.amountLost && record.currency
              ? `${record.currency} ${record.amountLost.toString()}`
              : "Not provided"
          }
        />
        <Item label="Payment Method" value={record.paymentMethod || "Not provided"} />
        <Item
          label="Initial Contact Channel"
          value={record.initialContactChannel || "Not provided"}
        />
        <Item label="Jurisdiction" value={record.jurisdiction || "Not provided"} />
        <Item
          label="Incident Start"
          value={record.incidentStartDate?.toLocaleDateString() || "Not provided"}
        />
        <Item
          label="Incident End"
          value={record.incidentEndDate?.toLocaleDateString() || "Not provided"}
        />
      </dl>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <BooleanFlag
          label="Allow Follow-Up"
          value={record.allowFollowUp}
        />
        <BooleanFlag
          label="Allow Law Enforcement Referral"
          value={record.allowLawEnforcementReferral}
        />
        <BooleanFlag
          label="Allow Case Matching"
          value={record.allowCaseMatching}
        />
        <BooleanFlag
          label="Allow Public Anonymized Use"
          value={record.allowPublicAnonymizedUse}
        />
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function BooleanFlag({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value ? "Yes" : "No"}</p>
    </div>
  );
}
