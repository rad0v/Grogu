import { cn } from "@/lib/utils";

/** Placeholder block. Shimmer instead of a pulse — it reads as loading, not broken. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-muted",
        className,
      )}
      {...props}
    />
  );
}
