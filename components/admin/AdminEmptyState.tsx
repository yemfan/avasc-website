import { cn } from "@/lib/utils/cn";

export function AdminEmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center",
        className
      )}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
