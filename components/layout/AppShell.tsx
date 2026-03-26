import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
            AVASC
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
            <Link className="hover:text-slate-900" href="/report">
              Report a scam
            </Link>
            <Link className="hover:text-slate-900" href="/database">
              Scam database
            </Link>
            <Link className="hover:text-slate-900" href="/stories">
              Survivor stories
            </Link>
            <Link className="hover:text-slate-900" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-slate-900" href="/admin">
              Admin
            </Link>
            <Link
              className="rounded-full bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
