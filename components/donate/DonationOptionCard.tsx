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
    <Card
      className={
        featured
          ? "border-[var(--avasc-gold)]/35 bg-[var(--avasc-bg-card)]/90 shadow-[0_20px_50px_-20px_rgba(201,148,60,0.2)] backdrop-blur-sm ring-1 ring-[var(--avasc-gold)]/15"
          : "border-white/[0.08] bg-[var(--avasc-bg-card)]/85 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm"
      }
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-display text-xl font-medium text-white">{title}</CardTitle>
          {featured ? <Badge variant="default">Recommended</Badge> : null}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-relaxed text-[var(--avasc-text-secondary)]">{description}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2">
        <DonateLinkButton
          href={href}
          label={buttonLabel}
          variant={featured ? "gold" : "outline"}
          className={
            featured
              ? "w-full shadow-[0_8px_28px_-10px_rgba(201,148,60,0.45)]"
              : "w-full border-white/[0.14] bg-white/[0.03] text-[var(--avasc-text-primary)] hover:border-[var(--avasc-gold)]/35"
          }
        />
        {!href && <p className="text-xs text-[var(--avasc-text-muted)]">Donation link not configured yet.</p>}
      </CardFooter>
    </Card>
  );
}
