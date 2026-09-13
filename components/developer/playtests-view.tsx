"use client";

import { useState } from "react";
import Link from "next/link";
import { ListChecks, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PlaytestStatus } from "@/lib/types";
import { useDeveloperPlaytests } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PageHeader } from "@/components/layout/page-header";
import { DeveloperPlaytestRow } from "@/components/developer/playtest-row";

type Filter = PlaytestStatus | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "recruiting", label: "Recruiting" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "In review" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Drafts" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

export function PlaytestsView() {
  const { user } = useSession();
  const playtests = useDeveloperPlaytests(user?.id);
  const [filter, setFilter] = useState<Filter>("all");

  if (!user) return null;

  const counts = playtests.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const list =
    filter === "all" ? playtests : playtests.filter((p) => p.status === filter);

  // Only offer filters that would actually return something.
  const visibleFilters = FILTERS.filter(
    (f) => f.value === "all" || (counts[f.value] ?? 0) > 0,
  );

  return (
    <div className="space-y-10">
      <PageHeader
        title="Playtests"
        description="Every playtest across your games."
        actions={
          <Button asChild>
            <Link href="/developer/playtests/new">
              <Plus /> New playtest
            </Link>
          </Button>
        }
      />

      {playtests.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nothing here yet."
          description="Create your first playtest to start recruiting testers."
          action={
            <Button asChild size="sm">
              <Link href="/developer/playtests/new">New playtest</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Status filter — a scrollable chip rail rather than tabs, so it
              doesn't overflow on mobile. */}
          <div
            role="group"
            aria-label="Filter playtests by status"
            className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
          >
            {visibleFilters.map((f) => {
              const active = filter === f.value;
              const count =
                f.value === "all" ? playtests.length : (counts[f.value] ?? 0);
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-[120ms] focus-visible:outline-none",
                    active
                      ? "border-primary-line bg-primary-soft text-secondary"
                      : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {list.length === 0 ? (
            <EmptyState
              title={`No ${FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} playtests`}
              description="Nothing matches this status right now."
            />
          ) : (
            <div className="space-y-3">
              {list.map((playtest) => (
                <DeveloperPlaytestRow key={playtest.id} playtest={playtest} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
