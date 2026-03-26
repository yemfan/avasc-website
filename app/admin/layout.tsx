import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { getServiceSupabase } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await ensureAppUser(user);

  const db = getServiceSupabase();
  const { data: appUser } = await db.from("User").select("role").eq("id", user.id).maybeSingle();
  if (!appUser || appUser.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
