import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-5 w-5 appearance-none rounded-none border border-[var(--color-ash)] bg-[var(--color-white)] checked:bg-[var(--color-black)] checked:border-[var(--color-black)] focus:outline-none focus:ring-2 focus:ring-[var(--color-black)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-safe-transition relative cursor-pointer",
          "before:content-[''] before:absolute before:inset-0 before:m-auto before:h-[10px] before:w-[5px] before:border-r-2 before:border-b-2 before:border-[var(--color-white)] before:rotate-45 before:opacity-0 checked:before:opacity-100",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
