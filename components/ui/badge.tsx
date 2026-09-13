import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "border-border bg-elevated text-elevated-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        primary: "border-primary-line bg-primary-soft text-secondary",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        info: "border-transparent bg-info/15 text-info",
        outline: "border-border-strong bg-transparent text-muted-foreground",
        /** For badges sitting on top of game art. */
        overlay:
          "border-white/10 bg-dark/70 text-foreground backdrop-blur-sm",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] leading-4",
        md: "px-2.5 py-1 text-xs leading-4",
      },
    },
    defaultVariants: { tone: "default", size: "sm" },
  },
);

const DOT_TONE = {
  default: "bg-secondary",
  muted: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  outline: "bg-muted-foreground",
  overlay: "bg-secondary",
} as const;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Leading status dot. Use for live/state badges, not for labels. */
  dot?: boolean;
}

export function Badge({
  className,
  tone,
  size,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot && (
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full", DOT_TONE[tone ?? "default"])}
        />
      )}
      {children}
    </span>
  );
}
