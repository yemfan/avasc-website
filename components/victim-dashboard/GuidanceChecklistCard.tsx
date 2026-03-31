import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const ITEMS = [
  "Keep screenshots, emails, and transaction IDs in a safe place.",
  "Contact your bank or card issuer if money moved through them.",
  "File a report with your local cybercrime or consumer protection office when you’re ready.",
  "Be cautious of anyone who promises guaranteed recovery for a fee.",
  "Review recovery resources on AVASC — you’re not alone in this.",
];

export function GuidanceChecklistCard() {
  return (
    <Card className="border-slate-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Practical next steps</h2>
      <p className="mt-1 text-sm text-slate-600">
        Here are some practical steps many people take. They aren’t legal advice — go at your own pace.
      </p>
      <ul className="mt-4 space-y-3">
        {ITEMS.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
