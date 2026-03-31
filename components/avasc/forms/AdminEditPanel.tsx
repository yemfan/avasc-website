import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type AdminEditPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Grouped editor block for admin surfaces — same chrome as {@link FormSection}, titled with `h3`. */
export function AdminEditPanel({ title, description, children, className }: AdminEditPanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] sm:p-8",
        className
      )}
    >
      <div className="mb-6 border-b border-[var(--avasc-divider)] pb-5">
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--avasc-text-secondary)]">{description}</p>
        ) : null}
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}
