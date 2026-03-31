import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SafeInfoAlert } from "@/components/victim-dashboard/SafeInfoAlert";
import { requireAuthUser } from "@/lib/victim-dashboard";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const user = await requireAuthUser();
  const prisma = getPrisma();
  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { displayName: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Your profile</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This information is only visible to you. We use it to keep your cases and support requests tied to your
          account securely.
        </p>
      </div>

      <SafeInfoAlert>
        Your reports and stories stay private unless you choose to share them. If you need to update sensitive
        details, contact us through{" "}
        <Link href="/dashboard/support" className="font-medium underline underline-offset-2">
          Support
        </Link>
        .
      </SafeInfoAlert>

      <Card className="border-slate-200 p-6 shadow-sm">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Name</dt>
            <dd className="mt-1 text-slate-900">{row?.displayName?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-900">{row?.email ?? user.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Account type</dt>
            <dd className="mt-1 capitalize text-slate-900">{row?.role?.replace(/_/g, " ") ?? "member"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Member since</dt>
            <dd className="mt-1 text-slate-900">
              {row?.createdAt ? row.createdAt.toLocaleDateString(undefined, { dateStyle: "long" }) : "—"}
            </dd>
          </div>
        </dl>
      </Card>

      <p className="text-sm text-slate-600">
        To change your password or sign-in method, use your account settings where you originally signed up (e.g. your
        email provider or SSO).
      </p>
    </div>
  );
}
