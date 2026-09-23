import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Display({ className, as: Component = "h1", ...props }: TypographyProps) {
  return <Component className={cn("font-display text-5xl md:text-7xl font-medium tracking-tight", className)} {...props} />;
}

export function Heading1({ className, as: Component = "h1", ...props }: TypographyProps) {
  return <Component className={cn("font-display text-4xl md:text-5xl font-medium", className)} {...props} />;
}

export function Heading2({ className, as: Component = "h2", ...props }: TypographyProps) {
  return <Component className={cn("font-display text-3xl md:text-4xl font-medium", className)} {...props} />;
}

export function Heading3({ className, as: Component = "h3", ...props }: TypographyProps) {
  return <Component className={cn("font-display text-2xl md:text-3xl font-medium", className)} {...props} />;
}

export function Body({ className, as: Component = "p", ...props }: TypographyProps) {
  return <Component className={cn("text-base md:text-lg text-text-primary leading-relaxed", className)} {...props} />;
}

export function BodyMuted({ className, as: Component = "p", ...props }: TypographyProps) {
  return <Component className={cn("text-sm md:text-base text-text-secondary leading-relaxed", className)} {...props} />;
}
