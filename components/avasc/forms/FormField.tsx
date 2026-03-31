import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Label + control + hint/error with readable spacing and contrast.
 */
export function FormField({ label, htmlFor, hint, error, required = false, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold leading-snug tracking-wide text-[var(--avasc-text-primary)]"
      >
        {label}
        {required ? (
          <span className="ml-1 font-semibold text-[var(--avasc-gold-light)]" aria-hidden>
            *
          </span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p className="text-sm font-medium leading-6 text-red-300" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-6 text-[var(--avasc-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
