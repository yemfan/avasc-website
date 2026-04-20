import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { brand, brandImages } from "@/lib/brand-images";
import { cn } from "@/lib/utils/cn";

const navLinkClass =
  "text-sm text-[var(--avasc-text-secondary)] transition-colors duration-150 hover:text-[var(--avasc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)] rounded-md";

const ctaOutlineClass =
  "inline-flex items-center justify-center rounded-lg border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-[var(--avasc-text-primary)] transition-colors duration-150 hover:border-[var(--avasc-gold)]/50 hover:text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

const ctaGoldClass =
  "inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] px-4 py-2 text-sm font-semibold text-[var(--avasc-bg)] shadow-[0_0_20px_rgba(197,139,43,0.12)] transition duration-150 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]";

const mobileItemClass =
  "rounded-lg px-3 py-2.5 text-sm text-[var(--avasc-text-secondary)] transition-colors hover:bg-[var(--avasc-bg-soft)] hover:text-[var(--avasc-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--avasc-gold)]";

type TopNavbarProps = {
  logoSrc?: string;
};

const DESKTOP_LINKS = [
  { href: "/database", label: "Scam Database" },
  { href: "/report", label: "Report Case" },
  { href: "/stories", label: "Stories" },
  { href: "/guides", label: "Guides" },
  { href: "/recovery", label: "Recovery" },
  { href: "/about", label: "About" },
] as const;

function MobileMenu() {
  // TOM MN-002: mobile viewport renders the gold "Report" CTA next to the
  // hamburger already (see TopNavbar bottom-right on md- breakpoints). The
  // menu listing "Report Case" inside as well surfaced as a duplicate.
  // Drop /report from the mobile menu — the CTA covers the entry point.
  const mobileMenuLinks = DESKTOP_LINKS.filter((link) => link.href !== "/report");
  return (
    <details className="group relative">
      <summary
        className={cn(
          ctaOutlineClass,
          "cursor-pointer list-none px-3 py-2 [&::-webkit-details-marker]:hidden"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4 shrink-0" aria-hidden />
      </summary>
      <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-0.5">
          {mobileMenuLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={mobileItemClass}>
              {label}
            </Link>
          ))}
          <Link href="/donate" className={mobileItemClass}>
            Donate
          </Link>
          <Link href="/login" className={mobileItemClass}>
            Sign in
          </Link>
        </div>
      </div>
    </details>
  );
}

export function TopNavbar({ logoSrc = brandImages.logoFull }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[rgba(5,9,18,0.78)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(5,9,18,0.72)]">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:min-h-[5rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avasc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--avasc-bg)]"
          aria-label={`${brand.shortName}, ${brand.legalName} — home`}
        >
          {/* TOM MN-003: the anchor's aria-label already supplies the
              accessible name ("AVASC, …the full legal name… — home"), so
              the image should be treated as decorative. Previously alt={brand.logoAltFull}
              could double-read in screen readers that concatenate instead of
              letting the link's aria-label override. */}
          <Image
            src={logoSrc}
            alt=""
            width={320}
            height={80}
            className="h-12 w-auto max-w-[min(100%,16rem)] object-contain sm:h-14 md:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex" aria-label="Primary">
          {DESKTOP_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/donate" className={cn(ctaOutlineClass, "hidden sm:inline-flex")}>
            Donate
          </Link>
          <Link href="/login" className={cn(navLinkClass, "hidden px-2 lg:inline-flex")}>
            Sign in
          </Link>
          <Link href="/report" className={ctaGoldClass}>
            Report Now
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/report" className={cn(ctaGoldClass, "px-3 py-2 text-xs sm:text-sm")}>
            Report
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
