import * as React from "react";

import { cn } from "@/lib/utils";

/** Centered, max-width page gutter. One source of truth for horizontal rhythm. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-page", className)} {...props} />;
}
