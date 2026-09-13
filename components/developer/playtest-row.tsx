"use client";

import Link from "next/link";
import { MessageSquareText, UserCheck, Users } from "lucide-react";

import { cn, formatDeadline } from "@/lib/utils";
import type { PlaytestWithRelations } from "@/lib/types";
import { usePlaytestSummary } from "@/lib/hooks/use-grogu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameArt } from "@/components/games/game-cover";

/**
 * One playtest in a developer's list. Used by both the dashboard and the
 * Playtests page so a playtest looks and reads the same wherever it appears.
 *
 * The row leads with the thing that needs a decision — applicants waiting on
 * review — because that's the only part of a running playtest that blocks.
 */
export function DeveloperPlaytestRow({
  playtest,
  className,
}: {
  playtest: PlaytestWithRelations;
  className?: string;
}) {
  const summary = usePlaytestSummary(playtest.id, playtest.maxTesters);
  const manageHref = `/developer/playtests/${playtest.id}`;

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-surface p-4 transition-colors duration-[180ms] hover:border-border-strong",
        summary.pending > 0 && "border-warning/30",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <GameArt
          game={playtest.game}
          ratio="16/10"
          className="w-full shrink-0 rounded-lg sm:w-32"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge kind="playtest" status={playtest.status} />
                <span className="text-xs text-subtle-foreground">
                  {playtest.game.title} · {formatDeadline(playtest.closesAt)}
                </span>
              </div>
              <h3 className="font-medium leading-snug">
                <Link
                  href={manageHref}
                  className="transition-colors hover:text-secondary"
                >
                  {playtest.title}
                </Link>
              </h3>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {summary.pending > 0 && (
                <Button asChild size="sm" variant="secondary">
                  <Link href={`${manageHref}?tab=applicants`}>
                    <UserCheck /> {summary.pending} to review
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" variant="ghost">
                <Link href={manageHref}>Manage</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3 text-subtle-foreground" aria-hidden />
                  Roster
                </span>
                <span className="tabular-nums">
                  {summary.accepted}/{playtest.maxTesters}
                </span>
              </div>
              <Progress
                value={summary.rosterRatio * 100}
                aria-label="Roster filled"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MessageSquareText
                    className="size-3 text-subtle-foreground"
                    aria-hidden
                  />
                  Feedback in
                </span>
                <span className="tabular-nums">
                  {summary.feedbackCount}/{summary.accepted || "—"}
                </span>
              </div>
              <Progress
                value={summary.completionRatio * 100}
                indicatorClassName="bg-success"
                aria-label="Feedback completion"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
