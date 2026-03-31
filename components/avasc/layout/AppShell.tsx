import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { TopNavbar } from "@/components/avasc/TopNavbar";
import { brand, brandImages } from "@/lib/brand-images";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <footer className="mt-auto border-t border-border bg-avasc-bg-soft/50">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 text-sm text-muted-foreground sm:px-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/recovery" className="transition-colors hover:text-avasc-gold-light">
              Recovery center
            </Link>
            <span className="text-avasc-divider" aria-hidden>
              |
            </span>
            <Link href="/about" className="transition-colors hover:text-avasc-gold-light">
              About AVASC
            </Link>
            <span className="text-avasc-divider" aria-hidden>
              |
            </span>
            <Link href="/donate" className="transition-colors hover:text-avasc-gold-light">
              Donate
            </Link>
            <span className="text-avasc-divider" aria-hidden>
              |
            </span>
            <Link href="/database" className="transition-colors hover:text-avasc-gold-light">
              Database disclaimer
            </Link>
            <span className="text-avasc-divider" aria-hidden>
              |
            </span>
            <Link href="/report" className="transition-colors hover:text-avasc-gold-light">
              Report intake
            </Link>
          </div>
          <p className="max-w-3xl leading-relaxed text-avasc-text-muted">
            AVASC is a nonprofit support and intelligence initiative. We are not a law firm, private investigator, or
            government agency. We do not guarantee recovery of funds. Public database entries are anonymized; never
            share passwords, full card numbers, or government IDs in public forms or comments. Beware of follow-on
            &ldquo;recovery scams&rdquo; that charge upfront fees.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Image
              src={brandImages.mark64}
              alt={brand.logoAltMark}
              width={28}
              height={28}
              className="h-7 w-7 object-contain opacity-80"
            />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {brand.shortName} ({brand.legalName}). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
