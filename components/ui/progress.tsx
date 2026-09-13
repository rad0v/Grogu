"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    value?: number;
    indicatorClassName?: string;
  }
>(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={clamped}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full bg-primary transition-[width] duration-500 ease-out",
          indicatorClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = "Progress";
