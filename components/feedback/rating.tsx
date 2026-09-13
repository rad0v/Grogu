"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/** Read-only star rating. */
export function RatingStars({
  value,
  max = 5,
  className,
  size = "sm",
}: {
  value: number;
  max?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(value);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${value} out of ${max}`}
      role="img"
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            size === "sm" ? "size-3.5" : "size-5",
            i < rounded
              ? "fill-warning text-warning"
              : "fill-transparent text-border-strong",
          )}
        />
      ))}
    </span>
  );
}

/** Interactive 1–5 rating using an accessible radio group. */
export function RatingInput({
  value,
  onChange,
  max = 5,
  labelledBy,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  labelledBy?: string;
}) {
  const [hovered, setHovered] = React.useState(0);
  // Preview the hovered value so the control feels responsive before commit.
  const shown = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const rating = i + 1;
        const active = rating <= shown;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHovered(rating)}
            className="rounded p-0.5 transition-transform duration-[120ms] hover:scale-110 focus-visible:outline-none"
          >
            <Star
              className={cn(
                "size-7 transition-colors duration-[120ms]",
                active
                  ? "fill-warning text-warning"
                  : "fill-transparent text-border-strong",
              )}
            />
          </button>
        );
      })}
      <span className="ml-2.5 text-sm tabular-nums text-muted-foreground">
        {value ? `${value}/${max}` : "—"}
      </span>
    </div>
  );
}

/** Horizontal bar for an averaged rating dimension (analytics). */
export function RatingBar({
  label,
  value,
  max = 5,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-out-soft)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
