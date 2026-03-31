import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { AVASC_CONTROL_FOCUS } from "./focus-styles";

export type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, description, className, id, disabled, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-start gap-4 rounded-xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] p-4 sm:p-5",
          "transition-colors duration-150 hover:border-[var(--avasc-divider)] hover:bg-white/[0.02]",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color-mix(in_srgb,var(--avasc-gold)_35%,transparent)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--avasc-bg-card)]",
          disabled && "cursor-not-allowed opacity-[0.55]",
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--avasc-border)] bg-[var(--avasc-bg)] text-[var(--avasc-gold)]",
            "focus-visible:outline-none",
            AVASC_CONTROL_FOCUS,
            "disabled:cursor-not-allowed"
          )}
          {...props}
        />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold leading-snug text-[var(--avasc-text-primary)]">{label}</p>
          {description ? (
            <p className="text-xs leading-6 text-[var(--avasc-text-secondary)]">{description}</p>
          ) : null}
        </div>
      </label>
    );
  }
);

CheckboxField.displayName = "CheckboxField";
