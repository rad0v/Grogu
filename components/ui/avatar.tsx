"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex size-9 shrink-0 overflow-hidden rounded-full border border-border",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-primary/20 text-xs font-semibold text-secondary",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

/** Convenience: initials avatar for a named user. */
export function UserAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback aria-hidden>{initials || "?"}</AvatarFallback>
    </Avatar>
  );
}
