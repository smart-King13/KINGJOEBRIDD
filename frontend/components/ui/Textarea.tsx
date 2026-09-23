import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[120px] w-full rounded-none border border-[var(--color-light-ash)] bg-[var(--color-white)] px-4 py-3 text-base text-[var(--color-black)] placeholder:text-[var(--color-ash)] motion-safe-transition hover:border-[var(--color-ash)] focus:outline-none focus:ring-1 focus:ring-[var(--color-black)] focus:border-[var(--color-black)] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
