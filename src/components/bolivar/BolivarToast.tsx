import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast, toast } from "@/hooks/use-toast";

interface ToastItemProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function ToastItem({
  title,
  description,
  action,
  variant,
  onOpenChange,
}: ToastItemProps) {
  const isDestructive = variant === "destructive";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg font-sans transition-all animate-in slide-in-from-bottom-full",
        isDestructive
          ? "border-destructive bg-destructive text-destructive-foreground"
          : "border bg-background text-foreground"
      )}
    >
      <div className="grid gap-1">
        {title && (
          <div className="text-sm font-semibold font-sans">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90 font-sans">{description}</div>
        )}
      </div>
      {action}
      <button
        onClick={() => onOpenChange?.(false)}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2",
          isDestructive
            ? "text-red-300 hover:text-red-50 focus:ring-red-400"
            : "text-foreground/50 hover:text-foreground focus:ring-ring"
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col p-4 sm:max-w-[420px]">
      {toasts.map(({ id, title, description, action, variant, open, onOpenChange, ...props }) => {
        if (!open) return null;
        return (
          <ToastItem
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            variant={variant as "default" | "destructive" | null}
            onOpenChange={onOpenChange}
          />
        );
      })}
    </div>
  );
}

export { Toaster, useToast, toast };
