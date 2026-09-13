import Link from "next/link";
import { ArrowRight, CalendarClock, Download } from "lucide-react";

import { cn, formatDeadline } from "@/lib/utils";
import { testCompletion } from "@/lib/domain";
import { TEST_STAGE_META } from "@/lib/constants";
import type { TesterTest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameArt } from "@/components/games/game-cover";

/** Row for one of a tester's accepted tests (dashboard + My tests). */
export function TestProgressCard({
  test,
  className,
}: {
  test: TesterTest;
  className?: string;
}) {
  const { playtest, progress } = test;
  const stage = progress?.stage ?? "not-started";
  const meta = TEST_STAGE_META[stage];
  const completion = testCompletion(progress, playtest);
  const done = stage === "completed";
  const pct = done ? 100 : Math.round(completion.ratio * 100);
  const href = `/tests/${playtest.id}`;

  return (
    <article
      className={cn(
        "lift group relative flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 hover:border-border-strong sm:flex-row sm:items-center",
        className,
      )}
    >
      <GameArt
        game={playtest.game}
        ratio="16/10"
        className="w-full shrink-0 rounded-lg sm:w-40"
      />

      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge kind="test" status={stage} />
          <span className="text-xs text-subtle-foreground">
            {playtest.game.title}
          </span>
        </div>

        <h3 className="font-medium leading-snug">
          <Link href={href} className="transition-colors hover:text-secondary">
            <span className="absolute inset-0" aria-hidden />
            <span className="line-clamp-1">{playtest.title}</span>
          </Link>
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completion.done}/{completion.total} required tasks
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <Progress
            value={pct}
            aria-label={`${meta.label} — ${pct}% complete`}
            indicatorClassName={done ? "bg-success" : undefined}
          />
        </div>

        {!done && (
          <p className="flex items-center gap-1.5 text-xs text-subtle-foreground">
            <CalendarClock className="size-3" aria-hidden />
            {formatDeadline(playtest.closesAt)}
          </p>
        )}
      </div>

      <div className="relative shrink-0">
        <Button asChild size="sm" variant={done ? "secondary" : "primary"}>
          <Link href={href}>
            {done ? (
              "View report"
            ) : progress?.buildDownloaded ? (
              <>
                Continue <ArrowRight />
              </>
            ) : (
              <>
                <Download /> Start testing
              </>
            )}
          </Link>
        </Button>
      </div>
    </article>
  );
}
