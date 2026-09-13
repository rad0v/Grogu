import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, Inbox, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------------------------------------------------- */
/*  Empty                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Shown when a list has no rows. Always says what's missing and offers the
 * action that would fill it — an empty state with no way forward is a dead end.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative grid size-12 place-items-center rounded-full bg-muted text-subtle-foreground"
      >
        {/* Faint halo — gives the mark presence without decoration. */}
        <span className="absolute inset-0 rounded-full ring-8 ring-muted/40" />
        <Icon className="relative size-5" />
      </span>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Error                                                                      */
/* -------------------------------------------------------------------------- */

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/8 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-destructive/15 text-destructive">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Success                                                                    */
/* -------------------------------------------------------------------------- */

/** Inline confirmation panel — used after an application or feedback submit. */
export function SuccessState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-success/30 bg-success/8 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="size-6" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading                                                                    */
/* -------------------------------------------------------------------------- */

export function LoadingState({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}…
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skeletons                                                                  */
/* -------------------------------------------------------------------------- */

/** Mirrors `PlaytestCard` so the layout doesn't jump when data arrives. */
export function PlaytestCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <PlaytestCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Row skeleton for list views (applications, tests, playtests). */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-xl border border-border bg-surface p-4"
        >
          <Skeleton className="aspect-[16/10] w-36 shrink-0" />
          <div className="flex-1 space-y-2.5 py-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-4">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="mt-3 h-7 w-14" />
        </div>
      ))}
    </div>
  );
}

/** Whole-page placeholder used while the persisted store rehydrates. */
export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <StatsSkeleton />
      <ListSkeleton />
    </div>
  );
}
