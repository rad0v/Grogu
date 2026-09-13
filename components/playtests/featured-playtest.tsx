import Link from "next/link";
import { ArrowRight, CalendarClock, Clock, Gift, Users } from "lucide-react";

import { cn, formatDeadline } from "@/lib/utils";
import { playtestCapacity } from "@/lib/domain";
import { FOCUS_LABELS, GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { PlaytestWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MetaItem, MetaRow } from "@/components/ui/meta";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameArt } from "@/components/games/game-cover";

/**
 * Wide, editorial treatment of a single playtest — used to lead the Discover
 * page. Same information as `PlaytestCard`, given room to breathe so the top of
 * the page has a clear focal point instead of an undifferentiated grid.
 */
export function FeaturedPlaytest({
  playtest,
  className,
}: {
  playtest: PlaytestWithRelations;
  className?: string;
}) {
  const { spotsLeft, isFull } = playtestCapacity(playtest);

  return (
    <article
      className={cn(
        "grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-2",
        className,
      )}
    >
      <GameArt
        game={playtest.game}
        ratio="16/9"
        scrim
        className="lg:h-full lg:aspect-auto"
      >
        <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
          <StatusBadge kind="playtest" status={playtest.status} overlay />
          {playtest.requirements.ndaRequired && <Badge tone="overlay">NDA</Badge>}
        </div>
        <div className="absolute inset-x-5 bottom-4 lg:hidden">
          <p className="font-display text-2xl font-semibold text-white">
            {playtest.game.title}
          </p>
        </div>
      </GameArt>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-label text-secondary">Featured playtest</p>
          <p className="hidden font-display text-2xl font-semibold lg:block">
            {playtest.game.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {playtest.game.genres.map((g) => GENRE_LABELS[g]).join(" • ")} ·{" "}
            {playtest.requirements.platforms
              .map((p) => PLATFORM_LABELS[p])
              .join(", ")}{" "}
            · {playtest.developer.name}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold leading-snug">{playtest.title}</h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {playtest.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {playtest.focusAreas.slice(0, 3).map((focus) => (
            <Badge key={focus} tone="primary">
              {FOCUS_LABELS[focus]}
            </Badge>
          ))}
        </div>

        <MetaRow className="gap-x-6 border-t border-border pt-4 text-sm">
          <MetaItem
            icon={Gift}
            label="Reward"
            value={playtest.reward}
            tone="strong"
            className="basis-full"
          />
          <MetaItem
            icon={Clock}
            label="Time commitment"
            value={`~${playtest.requirements.estimatedHours}h`}
          />
          <MetaItem
            icon={Users}
            label="Slots"
            value={isFull ? "Full" : `${spotsLeft} slots left`}
            tone={isFull ? "warning" : "default"}
          />
          <MetaItem
            icon={CalendarClock}
            label="Deadline"
            value={formatDeadline(playtest.closesAt)}
          />
        </MetaRow>

        <Link
          href={`/playtests/${playtest.id}`}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "mt-auto w-full sm:w-fit",
          )}
        >
          View playtest
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}
