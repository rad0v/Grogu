import Link from "next/link";
import {
  BarChart3,
  Check,
  ClipboardList,
  Filter,
  Gamepad2,
  Gift,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CountUp } from "@/components/marketing/count-up";

interface Reason {
  icon: LucideIcon;
  title: string;
  body: string;
}

const DEVELOPER_REASONS: Reason[] = [
  {
    icon: ClipboardList,
    title: "Define the playtest once",
    body: "Goals, focus areas, tester requirements, and a task checklist. Testers know exactly what's expected before they apply.",
  },
  {
    icon: Filter,
    title: "Pick the right testers",
    body: "Review applicants side by side with experience level, platforms, reputation, and their pitch. Accept or reject in one click.",
  },
  {
    icon: Users,
    title: "Track the roster",
    body: "See who's downloaded the build, who's working through tasks, and who's submitted feedback — without chasing anyone.",
  },
  {
    icon: BarChart3,
    title: "Feedback you can act on",
    body: "Structured reports roll up into rating breakdowns, sentiment, recurring pain points, and a bug list.",
  },
];

const TESTER_REASONS: Reason[] = [
  {
    icon: Gamepad2,
    title: "Play games before anyone else",
    body: "Unreleased builds from indie studios, across PC, console, browser, and mobile — with the developer actually listening.",
  },
  {
    icon: Gift,
    title: "Know the reward upfront",
    body: "Every listing states what you get — a key, a gift card, credits — alongside the time it will take. No surprises.",
  },
  {
    icon: Trophy,
    title: "Build a tester reputation",
    body: "Thorough, on-time feedback raises your score and unlocks playtests with higher requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Structure instead of guesswork",
    body: "Clear tasks and a guided feedback form, so you always know what the developer needs from you.",
  },
];

function ReasonList({
  reasons,
  accent,
}: {
  reasons: Reason[];
  accent: "primary" | "secondary";
}) {
  return (
    <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      {reasons.map((reason) => (
        <li key={reason.title} className="flex gap-4">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg",
              accent === "primary"
                ? "border border-primary-line bg-primary-soft text-secondary"
                : "border border-border bg-elevated text-secondary",
            )}
          >
            <reason.icon className="size-4" aria-hidden />
          </span>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">{reason.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {reason.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** "Why developers use Grogu" — the studio side of the pitch. */
export function WhyDevelopers() {
  return (
    <section className="border-b border-border bg-surface/40 py-20">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="For developers"
            title="Stop recruiting testers in Discord threads"
            lead="Publish a playtest, choose your testers, and get feedback that's already structured for triage."
          />
          <Link
            href="/developers"
            className={buttonVariants({ variant: "secondary" })}
          >
            Grogu for studios
          </Link>
        </div>
        <ReasonList reasons={DEVELOPER_REASONS} accent="primary" />
      </Container>
    </section>
  );
}

/** "Why playtesters use Grogu" — the player side of the pitch. */
export function WhyTesters() {
  return (
    <section className="border-b border-border py-20">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="For playtesters"
            title="Get paid attention for playing carefully"
            lead="Grogu is built for players who write the paragraph nobody else writes — and want that to count for something."
          />
          <Link
            href="/discover"
            className={buttonVariants({ variant: "secondary" })}
          >
            Find a playtest
          </Link>
        </div>
        <ReasonList reasons={TESTER_REASONS} accent="secondary" />
      </Container>
    </section>
  );
}

/** Social proof band, driven by the seeded catalogue rather than invented numbers. */
export function PlatformStats({
  stats,
}: {
  stats: {
    games: number;
    activePlaytests: number;
    testers: number;
    feedbackSubmitted: number;
  };
}) {
  const figures = [
    { label: "Games in testing", value: stats.games },
    { label: "Active playtests", value: stats.activePlaytests },
    { label: "Verified testers", value: stats.testers },
    { label: "Feedback reports", value: stats.feedbackSubmitted },
  ];

  return (
    <section className="border-b border-border py-16">
      <Container>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label}>
              <dd className="font-display text-4xl font-semibold tabular-nums sm:text-5xl">
                <CountUp value={figure.value} />
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">
                {figure.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

const CTA_POINTS = [
  "Define tester requirements once — Grogu handles the matching",
  "Review applicants side by side with reputation and platform data",
  "Feedback arrives structured, with per-task answers and repro steps",
];

/** Closing call to action for studios. */
export function DeveloperCta() {
  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-elevated">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/12 blur-3xl"
          />
          <div className="relative grid gap-10 p-8 md:grid-cols-2 md:gap-14 md:p-12">
            <div className="flex flex-col gap-5">
              <h2 className="text-display-sm">Run your next playtest on Grogu</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Set up a game, publish a playtest, and get a focused group of
                testers who understand the assignment — without living in a
                spreadsheet.
              </p>
              <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  Create a developer account
                </Link>
                <Link
                  href="/developers"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  See how it works
                </Link>
              </div>
            </div>

            <ul className="flex flex-col justify-center gap-4">
              {CTA_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="size-3" aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
