import { DatabaseSearch } from "@/components/database/DatabaseSearch";

export const metadata = {
  title: "Scam database | AVASC",
  description: "Search aggregated scam indicators and risk scores.",
};

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Scam database</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Indicators are normalized for search. Victim narratives stay private unless you explicitly publish an
          anonymized summary.
        </p>
      </div>
      <DatabaseSearch />
    </div>
  );
}
