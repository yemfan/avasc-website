import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WhyDonateCardProps = {
  title: string;
  text: string;
};

export function WhyDonateCard({ title, text }: WhyDonateCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
