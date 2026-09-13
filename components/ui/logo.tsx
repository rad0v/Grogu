import Link from "next/link";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/**
 * Grogu wordmark. The mark is a radar sweep inside a rounded square — "find the
 * players who'll actually finish your build".
 */
export function Logo({
  className,
  href = "/",
  /** Mark only, for tight spaces. */
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md text-foreground",
        className,
      )}
      aria-label={`${SITE.name} home`}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-colors duration-[120ms] group-hover:bg-primary-hover"
      >
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none">
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.45"
          />
          <path
            d="M12 12 19 7.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M12 4a8 8 0 0 1 7 4.1"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          {SITE.name}
        </span>
      )}
    </Link>
  );
}
