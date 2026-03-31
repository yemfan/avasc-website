import { ShieldAlert } from "lucide-react";

export function PublicDisclaimerCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-sm leading-relaxed text-slate-700">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" aria-hidden />
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">How to read this database</p>
          <ul className="list-inside list-disc space-y-1 text-slate-600">
            <li>
              You will never see private victim details or unpublished indicators here — only staff-reviewed, public-safe
              summaries and masked clues.
            </li>
            <li>Entries are built from anonymized reports — not verified court findings.</li>
            <li>Similarity to your situation does not mean the facts are identical.</li>
            <li>AVASC is not a law firm and does not provide legal advice.</li>
            <li>Independently verify claims, URLs, and contacts before sharing funds or data.</li>
            <li>Watch for “recovery scams” that ask for upfront fees.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
