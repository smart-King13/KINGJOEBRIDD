'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: 'default' | 'flushed' | 'rounded';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const baseStyles = "flex w-full bg-[var(--color-white)] text-base text-[var(--color-black)] placeholder:text-[var(--color-ash)] motion-safe-transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
    const variantStyles = {
      default: "h-12 rounded-none border border-[var(--color-light-ash)] px-4 py-2 hover:border-[var(--color-ash)] focus:ring-1 focus:ring-[var(--color-black)] focus:border-[var(--color-black)]",
      flushed: "h-14 border-b border-[var(--color-black)] px-0 py-2 text-center text-lg placeholder:text-sm placeholder:tracking-widest placeholder:uppercase focus:border-b-2",
      rounded: "h-12 rounded-xl border border-[var(--color-light-ash)] px-4 py-2 hover:border-[var(--color-ash)] focus:ring-1 focus:ring-[var(--color-black)] focus:border-[var(--color-black)]",
    };
    const errorStyles = error ? (props.variant === 'flushed' ? "border-[var(--color-error)]" : "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]") : "";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            baseStyles,
            variantStyles[props.variant || 'default'],
            errorStyles,
            isPassword && "pr-10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ash)] hover:text-[var(--color-black)] focus:outline-none transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
