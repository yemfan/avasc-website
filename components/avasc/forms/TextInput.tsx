import { forwardRef, type InputHTMLAttributes } from "react";
import { avascControlClassName } from "./focus-styles";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ className, ...props }, ref) => (
  <input ref={ref} className={avascControlClassName(className)} {...props} />
));

TextInput.displayName = "TextInput";
