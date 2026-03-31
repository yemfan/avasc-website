import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminKpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
