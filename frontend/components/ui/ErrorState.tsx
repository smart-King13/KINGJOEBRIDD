import { cn } from "@/lib/utils";
import { Heading3, BodyMuted } from "./Typography";
import { Button } from "./Button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorState({ 
  title = "WE COULDN'T LOAD THIS SECTION", 
  description = "Something went wrong while retrieving your information.", 
  action, 
  className, 
  ...props 
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-12 md:p-24 border border-[var(--color-ash)]/20", className)} {...props}>
      <AlertCircle className="w-8 h-8 text-[var(--color-black)] mb-4 opacity-50" strokeWidth={1} />
      <Heading3 className="mb-2 font-display">{title}</Heading3>
      <BodyMuted className="mb-6 max-w-md">{description}</BodyMuted>
      {action && (
        <Button onClick={action.onClick} variant="outline" className="uppercase tracking-widest text-xs rounded-none border-[var(--color-black)] text-[var(--color-black)]">
          {action.label}
        </Button>
      )}
    </div>
  );
}
