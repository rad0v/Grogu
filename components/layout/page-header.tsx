import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Breadcrumb {
  label: string;
  href?: string;
}

/** Consistent page title block for the authenticated app areas. */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  /** Small line above the title — role, game name, or section. */
  eyebrow,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight className="size-3 text-subtle-foreground" aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          {eyebrow && <p className="text-label text-secondary">{eyebrow}</p>}
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Section heading inside a page. Use instead of wrapping a section in a Card
 * just to give it a title.
 */
export function SectionTitle({
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
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="space-y-1">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
