import { forwardRef, type TextareaHTMLAttributes } from "react";
import { avascTextareaClassName } from "./focus-styles";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={avascTextareaClassName(className)} {...props} />
));

TextArea.displayName = "TextArea";
