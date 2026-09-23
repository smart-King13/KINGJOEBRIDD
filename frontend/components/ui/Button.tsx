import { cn } from "@/lib/utils";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "secondary-dark" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variants = {
  primary: "bg-[var(--color-black)] text-[var(--color-white)] hover:bg-[var(--color-off-black)] border border-transparent",
  secondary: "bg-transparent border border-[var(--color-black)] text-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-white)]",
  "secondary-dark": "bg-transparent border border-[var(--color-white)] text-[var(--color-white)] hover:bg-[var(--color-white)] hover:text-[var(--color-black)]",
  outline: "bg-transparent border border-[var(--color-light-ash)] text-[var(--color-black)] hover:border-[var(--color-black)]",
  ghost: "text-[var(--color-black)] hover:bg-[var(--color-black)]/5 border border-transparent",
  destructive: "bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 border border-transparent",
};

const sizes = {
  sm: "h-10 px-6 text-xs",
  md: "h-12 px-8 text-sm",
  lg: "h-14 px-10 text-sm",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: keyof typeof variants, size?: keyof typeof sizes, className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-bold uppercase tracking-widest motion-safe-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-black)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonClasses({ variant, size, className })}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
