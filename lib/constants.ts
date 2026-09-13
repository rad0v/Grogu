/**
 * App-wide constants: brand metadata, navigation config, and human-readable
 * labels for the domain unions in `types.ts`. Keeping these here avoids magic
 * strings in components and gives us one place to localise later.
 */

import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Compass,
  FileText,
  Gamepad2,
  Gift,
  LayoutDashboard,
  LineChart,
  ListChecks,
  UserRound,
} from "lucide-react";

import type {
  ApplicationStatus,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
  GameStatus,
  NotificationType,
  PlaytestFocus,
  PlaytestStatus,
  TaskType,
  TestStage,
} from "@/lib/types";

export const SITE = {
  name: "Grogu",
  fullName: "Project Grogu",
  description:
    "Grogu connects indie game developers with dedicated playtesters — structured playtests, actionable feedback, and a reputation system that rewards good testing.",
  url: "https://grogu.example.com",
} as const;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface AppNavItem extends NavItem {
  icon: LucideIcon;
  /** Match child routes too (e.g. /discover also active on /playtests/[id]). */
  match?: string[];
  /** Reachable from the account menu / mobile drawer, but not the top nav. */
  menuOnly?: boolean;
}

export const MARKETING_NAV: NavItem[] = [
  { label: "Discover", href: "/discover" },
  { label: "How it works", href: "/how-it-works#top" },
  { label: "For developers", href: "/developers" },
  { label: "For gamers", href: "/gametesters" },
];

export const TESTER_NAV: AppNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
    match: ["/playtests"],
  },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "My tests", href: "/tests", icon: ClipboardList },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export const DEVELOPER_NAV: AppNavItem[] = [
  { label: "Dashboard", href: "/developer/dashboard", icon: LayoutDashboard },
  { label: "My games", href: "/developer/games", icon: Gamepad2 },
  { label: "Playtests", href: "/developer/playtests", icon: ListChecks },
  { label: "Analytics", href: "/developer/analytics", icon: LineChart },
  {
    label: "Studio profile",
    href: "/developer/profile",
    icon: UserRound,
    menuOnly: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Domain labels                                                              */
/* -------------------------------------------------------------------------- */

export const GENRE_LABELS: Record<GameGenre, string> = {
  action: "Action",
  adventure: "Adventure",
  rpg: "RPG",
  strategy: "Strategy",
  puzzle: "Puzzle",
  simulation: "Simulation",
  roguelike: "Roguelike",
  platformer: "Platformer",
  shooter: "Shooter",
  horror: "Horror",
};

export const GENRE_OPTIONS = Object.keys(GENRE_LABELS) as GameGenre[];

export const PLATFORM_LABELS: Record<GamePlatform, string> = {
  pc: "PC",
  mac: "macOS",
  linux: "Linux",
  web: "Browser",
  mobile: "Mobile",
  console: "Console",
};

export const PLATFORM_OPTIONS = Object.keys(PLATFORM_LABELS) as GamePlatform[];

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  casual: "Casual",
  regular: "Regular",
  hardcore: "Hardcore",
  professional: "Professional",
};

export const EXPERIENCE_OPTIONS = Object.keys(
  EXPERIENCE_LABELS,
) as ExperienceLevel[];

export const FOCUS_LABELS: Record<PlaytestFocus, string> = {
  onboarding: "Onboarding",
  "difficulty-balance": "Difficulty & balance",
  "level-design": "Level design",
  performance: "Performance",
  narrative: "Narrative",
  "ui-ux": "UI / UX",
  multiplayer: "Multiplayer",
  general: "General impressions",
};

export const FOCUS_OPTIONS = Object.keys(FOCUS_LABELS) as PlaytestFocus[];

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  "in-development": "In development",
  alpha: "Alpha",
  beta: "Beta",
  released: "Released",
};

export const STUDIO_SIZE_LABELS: Record<string, string> = {
  solo: "Solo",
  small: "Small (2–10)",
  mid: "Mid-size (11–50)",
  large: "Large (50+)",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  objective: "Objective",
  survey: "Survey",
  "bug-report": "Bug report",
  "free-play": "Free play",
};

export type BadgeTone =
  | "default"
  | "muted"
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline";

/** Badge tone maps to a semantic colour token (see `components/ui/badge`). */
export const PLAYTEST_STATUS_META: Record<
  PlaytestStatus,
  { label: string; tone: BadgeTone }
> = {
  draft: { label: "Draft", tone: "muted" },
  recruiting: { label: "Recruiting", tone: "success" },
  "in-progress": { label: "In progress", tone: "info" },
  review: { label: "In review", tone: "warning" },
  completed: { label: "Completed", tone: "muted" },
  closed: { label: "Closed", tone: "muted" },
  archived: { label: "Archived", tone: "muted" },
};

export const APPLICATION_STATUS_META: Record<
  ApplicationStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: { label: "Pending", tone: "warning" },
  accepted: { label: "Accepted", tone: "success" },
  rejected: { label: "Not selected", tone: "destructive" },
  withdrawn: { label: "Withdrawn", tone: "muted" },
};

export const TEST_STAGE_META: Record<
  TestStage,
  { label: string; tone: BadgeTone; progress: number }
> = {
  "not-started": { label: "Not started", tone: "muted", progress: 0 },
  "in-progress": { label: "In progress", tone: "info", progress: 40 },
  "tasks-complete": { label: "Tasks complete", tone: "primary", progress: 75 },
  "feedback-submitted": {
    label: "Feedback submitted",
    tone: "primary",
    progress: 90,
  },
  completed: { label: "Completed", tone: "success", progress: 100 },
};

export const NOTIFICATION_META: Record<
  NotificationType,
  { tone: BadgeTone }
> = {
  "application-accepted": { tone: "success" },
  "application-rejected": { tone: "destructive" },
  "application-received": { tone: "info" },
  "feedback-received": { tone: "primary" },
  "playtest-published": { tone: "success" },
  "test-reminder": { tone: "warning" },
  system: { tone: "muted" },
};

/** Rating dimensions shown in the feedback UI, in display order. */
export const RATING_DIMENSIONS = [
  { key: "fun", label: "Fun", hint: "How enjoyable was it to play?" },
  { key: "difficulty", label: "Difficulty", hint: "1 = far too easy, 5 = far too hard" },
  { key: "clarity", label: "Clarity", hint: "Did you understand what to do?" },
  { key: "performance", label: "Performance", hint: "Frame rate, load times, stability" },
  { key: "polish", label: "Polish", hint: "Overall finish and presentation" },
] as const;
