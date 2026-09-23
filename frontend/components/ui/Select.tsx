import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-12 w-full appearance-none rounded-none border border-[var(--color-light-ash)] bg-[var(--color-white)] px-4 py-2 text-base text-[var(--color-black)] placeholder:text-[var(--color-ash)] motion-safe-transition hover:border-[var(--color-ash)] focus:outline-none focus:ring-1 focus:ring-[var(--color-black)] focus:border-[var(--color-black)] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
