import * as React from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/IconButton";

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, className, ...props }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm motion-safe-transition"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg mx-4 rounded-lg border border-border bg-background p-6 shadow-xl motion-safe-transition",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-6">
          {title && <div className="text-xl font-display font-medium">{title}</div>}
          <IconButton onClick={onClose} aria-label="Close modal" size="sm" className="ml-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </IconButton>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
