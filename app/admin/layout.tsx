import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await ensureAppUser(user);

  const appUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!appUser || appUser.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
