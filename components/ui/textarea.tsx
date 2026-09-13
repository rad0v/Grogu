import * as React from "react";

import { cn } from "@/lib/utils";
import { fieldClassName } from "@/components/ui/input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(fieldClassName, "flex resize-y px-3 py-2 leading-relaxed", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
