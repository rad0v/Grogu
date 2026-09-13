"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Page numbers around `current`, with `…` where the range is elided. */
function pageRange(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("gap");
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < total - 1) pages.push("gap");

  pages.push(total);
  return pages;
}

/**
 * Client-side pagination for long result lists. Grogu's mock data rarely spills
 * past one page, so this stays hidden at `totalPages <= 1`.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>

      {pageRange(page, totalPages).map((entry, index) =>
        entry === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="px-1 text-sm text-subtle-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => onPageChange(entry)}
            className={cn(
              "h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors",
              entry === page
                ? "bg-primary-soft text-secondary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {entry}
          </button>
        ),
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
