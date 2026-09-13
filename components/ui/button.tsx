import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button styles. Exported separately so a `<Link>` can be styled as a button:
 * `<Link className={buttonVariants()}>` — or use `<Button asChild><Link/></Button>`.
 *
 * Hierarchy, strongest to weakest: primary → secondary → outline → ghost → link.
 * A screen should carry exactly one primary action.
 */
export const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-medium",
    "transition-[background-color,border-color,color,transform,opacity] duration-[120ms] ease-[var(--ease-out-soft)]",
    "focus-visible:outline-none",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "border border-border bg-elevated text-elevated-foreground hover:border-border-strong hover:bg-accent",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:border-secondary/50 hover:bg-accent",
        ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
        success: "bg-success text-success-foreground shadow-sm hover:opacity-90",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        xl: "h-13 px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      type,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        type={type ?? "button"}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
