import { cn } from "@/lib/utils";
import { Heading3, BodyMuted } from "./Typography";
import { Button } from "./Button";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-12 md:p-24 border border-[var(--color-light-ash)]", className)} {...props}>
      <Heading3 className="mb-3 font-display tracking-wide text-[var(--color-black)]">{title}</Heading3>
      {description && <BodyMuted className="mb-8 max-w-md text-[var(--color-ash)] leading-relaxed">{description}</BodyMuted>}
      {action && (
        <Button onClick={action.onClick} variant="outline" className="uppercase tracking-widest text-xs rounded-none border-[var(--color-black)] text-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-white)]">
          {action.label}
        </Button>
      )}
    </div>
  );
}
