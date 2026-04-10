import { Card, CardContent } from "@/components/ui/card";

type ImpactCardProps = {
  amount: string;
  text: string;
};

export function ImpactCard({ amount, text }: ImpactCardProps) {
  return (
    <Card className="h-full border-white/[0.08] bg-[var(--avasc-bg-card)]/85 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="font-display text-2xl font-medium tracking-tight text-[var(--avasc-gold-light)]">{amount}</div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{text}</p>
      </CardContent>
    </Card>
  );
}
