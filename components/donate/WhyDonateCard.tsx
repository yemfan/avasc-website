import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WhyDonateCardProps = {
  title: string;
  text: string;
};

export function WhyDonateCard({ title, text }: WhyDonateCardProps) {
  return (
    <Card className="h-full border-white/[0.08] bg-[var(--avasc-bg-card)]/85 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-display text-xl font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{text}</p>
      </CardContent>
    </Card>
  );
}
