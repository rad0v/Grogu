import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Surface container.
 *
 * Reach for a Card only when a boundary genuinely helps grouping — a list row,
 * a tile in a grid, a side panel. Page sections should use headings and
 * whitespace instead, so the UI doesn't become a field of floating rectangles.
 *
 * `plain` is the escape hatch for that: structure without a visible box.
 */
const cardVariants = cva("text-surface-foreground", {
  variants: {
    variant: {
      default: "rounded-xl border border-border bg-surface",
      elevated: "rounded-xl border border-border bg-elevated shadow-md",
      /** Whole card is a link/button target. Pair with a focusable child. */
      interactive:
        "lift rounded-xl border border-border bg-surface hover:border-border-strong hover:bg-elevated",
      /** Grouping without a frame. */
      plain: "rounded-xl bg-transparent",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold leading-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center p-5 pt-0", className)} {...props} />
  );
}
