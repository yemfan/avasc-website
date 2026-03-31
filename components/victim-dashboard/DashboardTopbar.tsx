"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function DashboardTopbar({
  userName,
  userEmail,
}: {
  userName: string | null;
  userEmail: string | null;
}) {
  const display = userName?.trim() || userEmail || "Your account";

  return (
    <header className="border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Victim support portal</p>
          <p className="mt-1 text-sm text-slate-600">
            Signed in as <span className="font-medium text-slate-900">{display}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/report"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Report a scam
          </Link>
          <Link
            href="/recovery"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <HelpCircle className="h-4 w-4" aria-hidden />
            Help
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
