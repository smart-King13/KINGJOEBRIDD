import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "muted";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-foreground text-background",
    outline: "border border-border text-foreground",
    muted: "bg-surface-muted text-text-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold tracking-widest uppercase",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
