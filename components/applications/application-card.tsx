import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn, formatRelativeTime } from "@/lib/utils";
import { APPLICATION_STATUS_META } from "@/lib/constants";
import type { Application, PlaytestWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameArt } from "@/components/games/game-cover";

export function ApplicationCard({
  application,
  playtest,
  onWithdraw,
  withdrawing,
  className,
}: {
  application: Application;
  playtest: PlaytestWithRelations;
  onWithdraw?: () => void;
  withdrawing?: boolean;
  className?: string;
}) {
  const meta = APPLICATION_STATUS_META[application.status];
  const accepted = application.status === "accepted";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-surface p-4 transition-colors duration-[180ms] sm:flex-row sm:items-center",
        accepted ? "border-success/30" : "border-border hover:border-border-strong",
        className,
      )}
    >
      <Link
        href={`/playtests/${playtest.id}`}
        className="shrink-0 overflow-hidden rounded-lg sm:w-36"
        aria-label={`${playtest.game.title} playtest page`}
      >
        <GameArt game={playtest.game} ratio="16/10" />
      </Link>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <span className="text-xs text-subtle-foreground">
            Applied {formatRelativeTime(application.submittedAt)}
          </span>
        </div>
        <h3 className="font-medium leading-snug">
          <Link
            href={`/playtests/${playtest.id}`}
            className="transition-colors hover:text-secondary"
          >
            {playtest.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">
          {playtest.game.title} · {playtest.developer.name}
        </p>
        {application.status === "rejected" && application.decisionNote && (
          <p className="mt-2 rounded-md border border-border bg-elevated px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {application.decisionNote}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        {accepted && (
          <Button asChild size="sm">
            <Link href={`/tests/${playtest.id}`}>
              Open test <ArrowRight />
            </Link>
          </Button>
        )}
        {application.status === "pending" && onWithdraw && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onWithdraw}
            loading={withdrawing}
          >
            Withdraw
          </Button>
        )}
        {(application.status === "rejected" ||
          application.status === "withdrawn") && (
          <Button asChild size="sm" variant="secondary">
            <Link href="/discover">Find more</Link>
          </Button>
        )}
      </div>
    </article>
  );
}
