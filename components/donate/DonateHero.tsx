import { DonateLinkButton } from "./DonateLinkButton";

type DonateHeroProps = {
  title: string;
  subtitle: string;
  monthlyUrl?: string;
  oneTimeUrl?: string;
};

export function DonateHero({
  title,
  subtitle,
  monthlyUrl,
  oneTimeUrl,
}: DonateHeroProps) {
  return (
    <section className="border-b bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <DonateLinkButton href={monthlyUrl} label="Become a Monthly Supporter" className="min-w-[220px]" />
          <DonateLinkButton
            href={oneTimeUrl}
            label="Make a One-Time Gift"
            variant="outline"
            className="min-w-[220px]"
          />
        </div>

        {(!monthlyUrl || !oneTimeUrl) && (
          <p className="mt-4 text-sm text-muted-foreground">
            Donation links can be added through environment variables when ready.
          </p>
        )}
      </div>
    </section>
  );
}
