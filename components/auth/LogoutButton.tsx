"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:border-avasc-gold/40 hover:text-avasc-gold-light"
    >
      Sign out
    </button>
  );
}
