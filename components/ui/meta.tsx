import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Compact metadata primitives.
 *
 * Game and playtest cards all show the same shape of information — reward,
 * duration, slots, deadline — so it lives here once instead of being re-styled
 * on every card.
 */

export function MetaItem({
  icon: Icon,
  label,
  value,
  tone = "default",
  className,
}: {
  icon?: LucideIcon;
  /** Screen-reader name for the value; not shown unless `stacked` is used. */
  label: string;
  value: React.ReactNode;
  tone?: "default" | "strong" | "success" | "warning";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Icon && (
        <Icon className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
      )}
      <dt className="sr-only">{label}</dt>
      <dd
        className={cn(
          "truncate",
          tone === "default" && "text-muted-foreground",
          tone === "strong" && "font-medium text-foreground",
          tone === "success" && "font-medium text-success",
          tone === "warning" && "font-medium text-warning",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/** Horizontal run of `MetaItem`s. Wraps on narrow screens. */
export function MetaRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs", className)}
      {...props}
    />
  );
}

/**
 * Label-over-value stat, used in detail rails and hero strips where the key
 * needs to be visible rather than screen-reader-only.
 */
export function MetaStat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-label text-subtle-foreground">{label}</dt>
      <dd className="mt-1.5 truncate font-display text-lg font-semibold tabular-nums text-foreground">
        {value}
      </dd>
      {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Grid of `MetaStat`s separated by hairlines. */
export function MetaStatGrid({
  className,
  ...props
}: React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4 [&>*]:bg-surface [&>*]:p-4",
        className,
      )}
      {...props}
    />
  );
}
