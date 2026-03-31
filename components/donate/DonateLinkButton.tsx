import Link from "next/link";
import { Button } from "@/components/ui/button";

type DonateLinkButtonProps = {
  href?: string;
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
};

export function DonateLinkButton({
  href,
  label,
  variant = "default",
  className,
}: DonateLinkButtonProps) {
  const isDisabled = !href;

  if (isDisabled) {
    return (
      <Button type="button" variant={variant} className={className} disabled aria-disabled="true">
        {label}
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} className={className}>
      <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {label}
      </Link>
    </Button>
  );
}
