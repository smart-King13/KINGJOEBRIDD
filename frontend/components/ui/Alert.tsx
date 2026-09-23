import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error";
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  const variants = {
    default: "bg-surface-muted text-text-primary",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    error: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
  };

  return (
    <div
      role="alert"
      className={cn("p-4 rounded-md text-sm border border-transparent", variants[variant], className)}
      {...props}
    />
  );
}
