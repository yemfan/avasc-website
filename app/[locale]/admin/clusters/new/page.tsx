import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/avasc/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { submitCreateCluster } from "../cluster-form-actions";

export const dynamic = "force-dynamic";

export default async function AdminNewClusterPage() {
  const staff = await requireStaff();
  if (!canMutate(staff.role)) {
    redirect("/admin/clusters");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New cluster"
        description="Create a draft cluster, then refine indicators, cases, and publication status on the detail page."
        actions={
          <Link
            href="/admin/clusters"
            className="inline-flex rounded-lg border border-[var(--avasc-border)] px-5 py-3 text-sm font-medium text-[var(--avasc-text-primary)] transition hover:border-[var(--avasc-gold)] hover:text-white"
          >
            Back to list
          </Link>
        }
      />

      <form
        action={submitCreateCluster}
        className="grid gap-4 rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <Label htmlFor="title" className="text-[var(--avasc-text-secondary)]">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g. Fake exchange impersonation ring"
            className="mt-1.5 border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-white placeholder:text-[var(--avasc-text-muted)]"
          />
        </div>
        <div>
          <Label htmlFor="slug" className="text-[var(--avasc-text-secondary)]">
            Slug (URL)
          </Label>
          <Input
            id="slug"
            name="slug"
            required
            placeholder="fake-exchange-ring"
            className="mt-1.5 border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-white placeholder:text-[var(--avasc-text-muted)]"
          />
        </div>
        <div>
          <Label htmlFor="scamType" className="text-[var(--avasc-text-secondary)]">
            Scam type
          </Label>
          <Input
            id="scamType"
            name="scamType"
            required
            placeholder="phishing"
            className="mt-1.5 border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-white placeholder:text-[var(--avasc-text-muted)]"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary" className="text-[var(--avasc-text-secondary)]">
            Summary
          </Label>
          <Textarea
            id="summary"
            name="summary"
            rows={3}
            placeholder="Internal / public-facing summary"
            className="mt-1.5 border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-white placeholder:text-[var(--avasc-text-muted)]"
          />
        </div>
        <div>
          <Label htmlFor="riskLevel" className="text-[var(--avasc-text-secondary)]">
            Risk level
          </Label>
          <Input
            id="riskLevel"
            name="riskLevel"
            placeholder="medium"
            defaultValue="medium"
            className="mt-1.5 border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-white placeholder:text-[var(--avasc-text-muted)]"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            className="bg-gradient-to-r from-[var(--avasc-gold-dark)] via-[var(--avasc-gold)] to-[var(--avasc-gold-light)] text-[#050A14] hover:brightness-110"
          >
            Create draft cluster
          </Button>
        </div>
      </form>
    </div>
  );
}
