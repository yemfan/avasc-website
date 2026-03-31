import { forwardRef, type SelectHTMLAttributes } from "react";
import { avascControlClassName } from "./focus-styles";

export type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement>;

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={avascControlClassName(className)} {...props}>
      {children}
    </select>
  )
);

SelectInput.displayName = "SelectInput";
