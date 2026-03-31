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

        <div className="flex flex-wrap gap-2">
          <Badge>{record.scamType}</Badge>
          <Badge variant="outline">{record.status}</Badge>
          <Badge variant="secondary">{record.visibility}</Badge>
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
