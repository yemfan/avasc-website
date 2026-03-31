import { Card, CardContent } from "@/components/ui/card";

type ImpactCardProps = {
  amount: string;
  text: string;
};

export function ImpactCard({ amount, text }: ImpactCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="text-2xl font-bold tracking-tight">{amount}</div>
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
