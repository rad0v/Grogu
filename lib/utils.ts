import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Used by every UI primitive so callers can override styles predictably.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a compact, locale-aware string (e.g. 12_400 -> "12.4K"). */
export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Format an ISO date string as "Mar 14, 2026". */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

/** Relative day count helper used for playtest deadlines. */
export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** "3 days ago", "in 2 hours", "just now". */
export function formatRelativeTime(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  for (const [unit, unitSeconds] of RELATIVE_UNITS) {
    if (abs >= unitSeconds) {
      return formatter.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return "just now";
}

/** Deadline phrasing: "Closes in 5 days", "Closed", "Closes today". */
export function formatDeadline(iso: string) {
  const days = daysUntil(iso);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  return `Closes in ${days} days`;
}

/**
 * Time-of-day greeting. Call only from client components — it reads the
 * viewer's clock, so rendering it on the server would risk a hydration
 * mismatch.
 */
export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
