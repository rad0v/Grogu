import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Shared field styling. `Textarea` and `SelectTrigger` mirror these values. */
export const fieldClassName = [
  "w-full rounded-md border border-border bg-input text-sm text-foreground",
  "transition-colors duration-[120ms]",
  "placeholder:text-subtle-foreground",
  "hover:border-border-strong",
  "focus-visible:border-ring focus-visible:outline-none",
  "aria-[invalid=true]:border-destructive",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(fieldClassName, "flex h-10 px-3 py-2", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
