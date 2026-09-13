import * as React from "react";

import { cn } from "@/lib/utils";

/** Consistent eyebrow + title + lead block for marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <span className="text-label text-secondary">{eyebrow}</span>}
      <h2 className="text-display-sm">{title}</h2>
      {lead && (
        <p className="text-base leading-relaxed text-muted-foreground">{lead}</p>
      )}
    </div>
  );
}
