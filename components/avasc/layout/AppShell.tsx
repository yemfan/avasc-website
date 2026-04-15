import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { TopNavbar } from "@/components/avasc/TopNavbar";
import { brand, brandImages } from "@/lib/brand-images";

const footerLink = "text-sm text-[var(--avasc-text-secondary)] transition-colors hover:text-[var(--avasc-gold-light)]";

const footerColTitle = "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--avasc-gold-light)]/90";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNavbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">{children}</main>
      <footer className="mt-auto border-t border-white/[0.06] bg-[linear-gradient(180deg,var(--avasc-bg-soft)_0%,var(--avasc-bg)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3">
                <Image
                  src={brandImages.mark64}
                  alt={brand.logoAltMark}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain opacity-90"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{brand.shortName}</p>
                  <p className="text-xs leading-snug text-[var(--avasc-text-muted)]">{brand.legalName}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--avasc-text-secondary)]">
                Victim-centered reporting, pattern intelligence, and recovery resources.
              </p>
            </div>
            <div>
              <p className={footerColTitle}>Take action</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/report" className={footerLink}>
                    Report a scam
                  </Link>
                </li>
                <li>
                  <Link href="/database" className={footerLink}>
                    Scam database
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className={footerLink}>
                    Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/recovery" className={footerLink}>
                    Recovery center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className={footerColTitle}>Organization</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/about" className={footerLink}>
                    About AVASC
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className={footerLink}>
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className={footerLink}>
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className={footerLink}>
                    Donate
                  </Link>
                </li>
                <li>
                  <Link href="/login" className={footerLink}>
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className={footerColTitle}>Disclaimer</p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--avasc-text-muted)]">
                Not a law firm, investigator, or government agency. No guarantee of fund recovery. Public entries are
                anonymized—never share passwords, full card numbers, or IDs in public forms. Watch for recovery scams
                with upfront fees.
              </p>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--avasc-text-muted)]">
              © {new Date().getFullYear()} {brand.shortName} ({brand.legalName}). All rights reserved.
            </p>
            <Link href="/database" className="text-xs text-[var(--avasc-text-muted)] hover:text-[var(--avasc-gold-light)]">
              Database & privacy notes
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
