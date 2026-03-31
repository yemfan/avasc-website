import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

export type AvascTextareaProps = React.ComponentProps<typeof Textarea>;

const AvascTextarea = React.forwardRef<HTMLTextAreaElement, AvascTextareaProps>(
  ({ className, ...props }, ref) => (
    <Textarea ref={ref} className={cn("rounded-xl", className)} {...props} />
  )
);
AvascTextarea.displayName = "AvascTextarea";

export { AvascTextarea };
