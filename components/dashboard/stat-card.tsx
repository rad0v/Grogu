import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Metric tile for dashboards.
 *
 * Deliberately not a `Card`: dashboards show four of these in a row, and four
 * bordered boxes plus the cards below them turns the page into a grid of
 * frames. A hairline and a lot of air does the grouping instead.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  /** Draws attention to a number that needs action (e.g. pending applicants). */
  emphasis = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-surface p-4 transition-colors duration-[180ms]",
        emphasis ? "border-primary-line bg-primary-soft" : "border-border",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
        )}
        <p className="text-label truncate text-subtle-foreground">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold leading-none tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function StatCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4", className)}>
      {children}
    </div>
  );
}
