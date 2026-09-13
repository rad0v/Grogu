import * as React from "react";
import Link from "next/link";

/**
 * Heading + body wrapper for the auth forms. No card frame — the split auth
 * layout already gives the form its own column, and boxing it inside that
 * would be a frame within a frame.
 */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {children}

      <div className="space-y-3 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">{footer}</p>
        <p className="text-xs text-subtle-foreground">
          Prototype · no real accounts.{" "}
          <Link href="/" className="transition-colors hover:text-foreground">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
