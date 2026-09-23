import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        ref={ref}
        className={cn(
          "h-5 w-5 appearance-none rounded-full border border-[var(--color-ash)] bg-transparent checked:border-[6px] checked:border-[var(--color-black)] focus:outline-none focus:ring-2 focus:ring-[var(--color-black)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-safe-transition cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Radio.displayName = "Radio";
