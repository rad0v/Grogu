"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  GENRE_LABELS,
  GENRE_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
} from "@/lib/constants";
import type { DiscoverFilters } from "@/lib/domain";
import { EMPTY_DISCOVER_FILTERS } from "@/lib/domain";
import type { GameGenre, GamePlatform } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

const HOUR_OPTIONS = [2, 5, 10] as const;

/** True when anything is narrowing the result set. */
export function hasActiveFilters(filters: DiscoverFilters) {
  return (
    filters.search !== "" ||
    filters.genres.length > 0 ||
    filters.platforms.length > 0 ||
    filters.ndaOnly ||
    filters.maxHours != null
  );
}

/** Number of active filters, for the mobile "Filters (n)" trigger. */
export function activeFilterCount(filters: DiscoverFilters) {
  return (
    filters.genres.length +
    filters.platforms.length +
    (filters.ndaOnly ? 1 : 0) +
    (filters.maxHours != null ? 1 : 0)
  );
}

/** Pill toggle. One style for every filter chip on the page. */
function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-[120ms] focus-visible:outline-none",
        active
          ? "border-primary-line bg-primary-soft text-secondary"
          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3 border-t border-border pt-5 first:border-0 first:pt-0">
      <legend className="text-label text-subtle-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

/**
 * Discover filter rail. No card wrapper — it sits in the page margin and is
 * separated by hairlines, so the results grid stays the only framed thing.
 */
export function DiscoverFilterPanel({
  filters,
  onChange,
}: {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
}) {
  return (
    <div className="space-y-5">
      <FilterGroup legend="Genre">
        {GENRE_OPTIONS.map((genre: GameGenre) => (
          <FilterChip
            key={genre}
            active={filters.genres.includes(genre)}
            onClick={() =>
              onChange({ ...filters, genres: toggle(filters.genres, genre) })
            }
          >
            {GENRE_LABELS[genre]}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Platform">
        {PLATFORM_OPTIONS.map((platform: GamePlatform) => (
          <FilterChip
            key={platform}
            active={filters.platforms.includes(platform)}
            onClick={() =>
              onChange({
                ...filters,
                platforms: toggle(filters.platforms, platform),
              })
            }
          >
            {PLATFORM_LABELS[platform]}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Time commitment">
        {HOUR_OPTIONS.map((hours) => {
          const active = filters.maxHours === hours;
          return (
            <FilterChip
              key={hours}
              active={active}
              onClick={() =>
                onChange({ ...filters, maxHours: active ? null : hours })
              }
            >
              Up to {hours}h
            </FilterChip>
          );
        })}
      </FilterGroup>

      <div className="border-t border-border pt-5">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="nda-only"
            checked={filters.ndaOnly}
            onCheckedChange={(checked) =>
              onChange({ ...filters, ndaOnly: checked === true })
            }
          />
          <Label
            htmlFor="nda-only"
            className="cursor-pointer text-sm font-normal text-muted-foreground"
          >
            Only playtests requiring an NDA
          </Label>
        </div>
      </div>

      {hasActiveFilters(filters) && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onChange(EMPTY_DISCOVER_FILTERS)}
        >
          <X /> Clear all filters
        </Button>
      )}
    </div>
  );
}
