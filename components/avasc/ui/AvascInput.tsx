import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export type AvascInputProps = React.ComponentProps<typeof Input>;

const AvascInput = React.forwardRef<HTMLInputElement, AvascInputProps>(
  ({ className, ...props }, ref) => (
    <Input ref={ref} className={cn("rounded-xl", className)} {...props} />
  )
);
AvascInput.displayName = "AvascInput";

export { AvascInput };
