import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

type DonateLinkButtonProps = {
  href?: string;
  label: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

export function DonateLinkButton({
  href,
  label,
  variant = "gold",
  size = "lg",
  className,
}: DonateLinkButtonProps) {
  const isDisabled = !href;

  if (isDisabled) {
    return (
      <Button type="button" variant={variant} size={size} className={className} disabled aria-disabled="true">
        {label}
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {label}
      </Link>
    </Button>
  );
}
