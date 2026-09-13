"use client";

import { useMemo, useState } from "react";
import { Compass, Search, SlidersHorizontal, X } from "lucide-react";

import {
  EMPTY_DISCOVER_FILTERS,
  matchesDiscoverFilters,
  playtestCapacity,
  type DiscoverFilters,
} from "@/lib/domain";
import type { PlaytestWithRelations } from "@/lib/types";
import { usePlaytests } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CardGridSkeleton, EmptyState } from "@/components/ui/states";
import { PlaytestCard } from "@/components/playtests/playtest-card";
import { FeaturedPlaytest } from "@/components/playtests/featured-playtest";
import {
  DiscoverFilterPanel,
  activeFilterCount,
  hasActiveFilters,
} from "@/components/playtests/discover-filters";

const SORTS = {
  closing: "Closing soonest",
  newest: "Newly published",
  slots: "Most slots left",
  shortest: "Shortest first",
} as const;

type SortKey = keyof typeof SORTS;

function sortPlaytests(list: PlaytestWithRelations[], sort: SortKey) {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "slots":
      return sorted.sort(
        (a, b) =>
          playtestCapacity(b).spotsLeft - playtestCapacity(a).spotsLeft,
      );
    case "shortest":
      return sorted.sort(
        (a, b) => a.requirements.estimatedHours - b.requirements.estimatedHours,
      );
    case "closing":
    default:
      return sorted.sort((a, b) => a.closesAt.localeCompare(b.closesAt));
  }
}

const PAGE_SIZE = 9;

export function DiscoverExplorer({
  initialPlaytests,
}: {
  initialPlaytests: PlaytestWithRelations[];
}) {
  const hydrated = useHydrated();
  const storePlaytests = usePlaytests();
  const [filters, setFilters] = useState<DiscoverFilters>(EMPTY_DISCOVER_FILTERS);
  const [sort, setSort] = useState<SortKey>("closing");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Use the server-rendered list until the persisted store has hydrated, so the
  // page shows content immediately and the first client render matches the HTML.
  const source = hydrated
    ? storePlaytests.filter((p) => p.status === "recruiting")
    : initialPlaytests;

  const results = useMemo(
    () =>
      sortPlaytests(
        source.filter((p) => matchesDiscoverFilters(p, filters)),
        sort,
      ),
    [source, filters, sort],
  );

  const filtering = hasActiveFilters(filters);
  const filterCount = activeFilterCount(filters);

  // The lead card is only editorial when nothing is filtered — once the user is
  // searching, every result deserves equal weight.
  const featured = !filtering && results.length > 2 ? results[0] : null;
  const gridResults = featured ? results.slice(1) : results;

  const totalPages = Math.ceil(gridResults.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const visible = gridResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function updateFilters(next: DiscoverFilters) {
    setFilters(next);
    setPage(1);
  }

  const filterPanel = (
    <DiscoverFilterPanel filters={filters} onChange={updateFilters} />
  );

  return (
    <div className="space-y-8">
      {/* Search + sort — the primary controls, full width above everything. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search games, studios, or playtests…"
            aria-label="Search playtests"
            value={filters.search}
            onChange={(e) =>
              updateFilters({ ...filters, search: e.target.value })
            }
            className="h-12 pl-10 text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter drawer — the rail is hidden below lg. */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="lg" className="lg:hidden">
                <SlidersHorizontal />
                Filters
                {filterCount > 0 && (
                  <Badge tone="primary" className="ml-0.5">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-sm overflow-y-auto">
              <SheetTitle className="font-display text-base font-semibold">
                Filters
              </SheetTitle>
              {filterPanel}
              <Button
                className="mt-2 w-full"
                onClick={() => setFiltersOpen(false)}
              >
                Show {results.length} {results.length === 1 ? "result" : "results"}
              </Button>
            </SheetContent>
          </Sheet>

          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value as SortKey);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="h-12 w-full sm:w-48"
              aria-label="Sort playtests"
            >
              {/* Radix renders SelectValue empty until the menu has been opened
                  once, so the current label is passed explicitly. */}
              <SelectValue>{SORTS[sort]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORTS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
          <h2 className="sr-only">Filters</h2>
          {filterPanel}
        </aside>

        <div className="min-w-0 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "playtest" : "playtests"} open
              {filtering && " for your filters"}
            </p>
            {filtering && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilters(EMPTY_DISCOVER_FILTERS)}
              >
                <X /> Clear filters
              </Button>
            )}
          </div>

          {!hydrated && initialPlaytests.length === 0 ? (
            <CardGridSkeleton count={6} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No playtests match your filters"
              description="Try widening your search — clear a filter or two to see more open playtests."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateFilters(EMPTY_DISCOVER_FILTERS)}
                >
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              {featured && <FeaturedPlaytest playtest={featured} />}

              {visible.length > 0 && (
                <section className="space-y-5">
                  {featured && (
                    <h2 className="font-display text-lg font-semibold">
                      More open playtests
                    </h2>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {visible.map((playtest) => (
                      <PlaytestCard key={playtest.id} playtest={playtest} />
                    ))}
                  </div>
                </section>
              )}

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
