import type { ReactNode } from "react";

/**
 * Public scam database layout — visually and semantically separate from `/admin` surfaces.
 * All victim-safe copy and masking live under `lib/public-database/public-indicator-display.ts`.
 */
export default function PublicDatabaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-database min-w-0" data-avasc-surface="public-database">
      {children}
    </div>
  );
}
