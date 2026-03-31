import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionShellProps = {
  as?: ElementType;
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidthClassName?: string;
};

export function SectionShell({
  as: Comp = "section",
  id,
  title,
  description,
  children,
  className,
  contentClassName,
  maxWidthClassName = "max-w-6xl",
}: SectionShellProps) {
  return (
    <Comp id={id} className={cn("w-full", className)}>
      <div className={cn("mx-auto w-full px-4 sm:px-6", maxWidthClassName, contentClassName)}>
        {(title || description) && (
          <header className="mb-8 md:mb-10">
            {title ? <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{title}</h2> : null}
            {description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p> : null}
          </header>
        )}
        {children}
      </div>
    </Comp>
  );
}
