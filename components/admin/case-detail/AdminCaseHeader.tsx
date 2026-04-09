import Link from "next/link";
import type { Case } from "@prisma/client";

type AdminCaseHeaderProps = {
  record: Case & {
    user: {
      id: string;
      email: string;
      displayName: string | null;
    };
  };
};

export function AdminCaseHeader({ record }: AdminCaseHeaderProps) {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Case ID: {record.id}</p>
          <h2 className="text-2xl font-bold tracking-tight">{record.title}</h2>
          <p className="text-sm text-muted-foreground">
            Submitted by {record.user.displayName || record.user.email}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap justify-end gap-2">
            <Badge>{record.scamType}</Badge>
            <Badge variant="outline">{record.status}</Badge>
            <Badge variant="secondary">{record.visibility}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/cases/${record.id}/review-production`}
              className="inline-flex min-h-9 items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:border-[var(--avasc-gold)] hover:text-[var(--avasc-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Production review
            </Link>
            <Link
              href={`/dashboard/cases/${record.id}`}
              className="inline-flex min-h-9 items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Victim view
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground"
      : variant === "secondary"
        ? "bg-muted text-foreground"
        : "bg-black text-white";

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{children}</span>;
}
