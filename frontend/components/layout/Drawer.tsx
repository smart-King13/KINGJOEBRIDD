import * as React from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/IconButton";

export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: React.ReactNode;
}

export function Drawer({ isOpen, onClose, side = "right", title, children, className, ...props }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm motion-safe-transition"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 h-full w-[85vw] max-w-sm border-[var(--color-ash)]/20 bg-[var(--color-white)] p-6 shadow-2xl motion-safe-transition flex flex-col",
          side === "left" ? "border-r mr-auto" : "border-l ml-auto",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-8">
          {title && <div className="text-xl font-display font-medium">{title}</div>}
          <IconButton onClick={onClose} aria-label="Close drawer" size="sm" className="ml-auto">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
