import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type AvascButtonProps = ButtonProps;

/** Design-system entry for primary actions; themed via global tokens. */
const AvascButton = React.forwardRef<HTMLButtonElement, AvascButtonProps>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} className={cn("duration-150", className)} {...props} />
  )
);
AvascButton.displayName = "AvascButton";

export { AvascButton };
