import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-foreground text-background hover:bg-foreground/90",
      secondary: "bg-surface-muted text-foreground hover:bg-surface-muted/80",
      outline: "border border-border text-foreground hover:bg-surface-muted/50",
      ghost: "text-foreground hover:bg-surface-muted/50",
    };

    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm motion-safe-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-black)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-white)] disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";
