"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Toasts for transient confirmations ("Application submitted", "Tester
 * accepted"). Deliberately tiny: a provider, a queue, and an auto-dismiss.
 *
 * Toasts confirm; they never carry information the user must act on. Anything
 * that needs a decision belongs in the page or a dialog.
 */

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

type ToastInput = Omit<Toast, "id" | "tone"> & { tone?: ToastTone };

const ToastContext = React.createContext<((toast: ToastInput) => void) | null>(
  null,
);

const DISMISS_AFTER_MS = 4200;

const TONE_META: Record<
  ToastTone,
  { icon: typeof Info; className: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-success/30",
    iconClass: "text-success",
  },
  error: {
    icon: AlertTriangle,
    className: "border-destructive/30",
    iconClass: "text-destructive",
  },
  info: { icon: Info, className: "border-border", iconClass: "text-secondary" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = React.useCallback(
    (input: ToastInput) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((current) => [
        ...current.slice(-2),
        { ...input, tone: input.tone ?? "success", id },
      ]);
      window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-100 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      >
        {toasts.map((toast) => {
          const meta = TONE_META[toast.tone];
          const Icon = meta.icon;
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-elevated p-3.5 shadow-lg",
                "animate-in slide-in-from-bottom-2 fade-in-0 duration-[180ms]",
                meta.className,
              )}
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", meta.iconClass)} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Returns a `toast(...)` function. Safe to call outside the provider — it
 * no-ops rather than throwing, so a component can be rendered in isolation.
 */
export function useToast() {
  const push = React.useContext(ToastContext);
  return React.useCallback(
    (toast: ToastInput) => push?.(toast),
    [push],
  );
}
