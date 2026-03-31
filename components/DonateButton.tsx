import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type DonateButtonProps = {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
  href?: string;
  disabled?: boolean;
  openInNewTab?: boolean;
  ariaLabel?: string;
};

const VARIANT_MAP = {
  primary: "gold",
  outline: "outline",
  ghost: "ghost",
} as const;

const SIZE_MAP = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const;

export function DonateButton({
  variant = "primary",
  size = "md",
  className,
  children = "Donate",
  href = "/donate",
  disabled = false,
  openInNewTab = false,
  ariaLabel = "Donate to support scam victims",
}: DonateButtonProps) {
  if (disabled) {
    return (
      <Button variant={VARIANT_MAP[variant]} size={SIZE_MAP[size]} className={className} disabled aria-label={ariaLabel}>
        {children}
      </Button>
    );
  }

  return (
    <Button asChild variant={VARIANT_MAP[variant]} size={SIZE_MAP[size]} className={className} aria-label={ariaLabel}>
      <Link href={href} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined}>
        {children}
      </Link>
    </Button>
  );
}
