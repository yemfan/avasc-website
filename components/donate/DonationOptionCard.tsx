import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonateLinkButton } from "./DonateLinkButton";

export function DonationOptionCard({
  title,
  description,
  buttonLabel,
  href,
  featured = false,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  href?: string;
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "border-primary shadow-sm" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{title}</CardTitle>
          {featured ? <Badge>Recommended</Badge> : null}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2">
        <DonateLinkButton href={href} label={buttonLabel} className="w-full" />
        {!href && <p className="text-xs text-muted-foreground">Donation link not configured yet.</p>}
      </CardFooter>
    </Card>
  );
}
