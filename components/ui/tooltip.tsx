"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Minimal tooltip.
 *
 * Radix ships one, but it isn't a project dependency and a tooltip doesn't
 * justify adding it — this is ~40 lines of hover/focus state with the same
 * accessibility contract: the trigger is described by the bubble, the bubble is
 * hidden from the tree until shown, and Escape dismisses it.
 *
 * Tooltips carry supporting detail only. Never put an action or the only copy
 * explaining a control inside one.
 */
export function Tooltip({
  label,
  side = "top",
  children,
  className,
}: {
  label: React.ReactNode;
  side?: "top" | "bottom";
  /** The trigger. Must be focusable for keyboard users to reach the tooltip. */
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-56 -translate-x-1/2 rounded-md",
          "border border-border bg-elevated px-2.5 py-1.5 text-xs text-elevated-foreground shadow-md",
          "animate-in fade-in-0 zoom-in-95 duration-[120ms]",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        )}
      >
        {label}
      </span>
    </span>
  );
}
