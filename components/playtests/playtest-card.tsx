import Link from "next/link";
import { Clock, Gift, Users } from "lucide-react";

import { cn, formatDeadline } from "@/lib/utils";
import { isClosingSoon, playtestCapacity } from "@/lib/domain";
import { GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { PlaytestWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MetaItem, MetaRow } from "@/components/ui/meta";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameArt } from "@/components/games/game-cover";

/**
 * Playtest summary card — the primary unit on Discover and dashboards.
 *
 * Reads game-first: artwork, then the game's identity over the scrim, then what
 * the test actually asks of you. The whole card is one link target, with the
 * heading carrying the accessible name.
 */
export function PlaytestCard({
  playtest,
  href,
  className,
}: {
  playtest: PlaytestWithRelations;
  href?: string;
  className?: string;
}) {
  const link = href ?? `/playtests/${playtest.id}`;
  const { spotsLeft, isFull, isNearlyFull } = playtestCapacity(playtest);
  const closingSoon = isClosingSoon(playtest.closesAt);

  return (
    <article
      className={cn(
        "lift group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface",
        "hover:border-border-strong focus-within:border-border-strong",
        className,
      )}
    >
      <GameArt game={playtest.game} ratio="16/9" scrim>
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
          <StatusBadge kind="playtest" status={playtest.status} overlay />
          <div className="flex gap-1.5">
            {playtest.requirements.ndaRequired && (
              <Badge tone="overlay">NDA</Badge>
            )}
            {isFull ? (
              <Badge tone="overlay">Full</Badge>
            ) : (
              closingSoon && <Badge tone="overlay">Closing soon</Badge>
            )}
          </div>
        </div>

        {/* Game identity sits on the art — this is a game first, a task second. */}
        <div className="absolute inset-x-4 bottom-3">
          <h3 className="font-display text-lg font-semibold leading-tight text-white">
            {playtest.game.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-white/70">
            {playtest.game.genres.map((g) => GENRE_LABELS[g]).join(" • ")}
            {" · "}
            {playtest.requirements.platforms
              .slice(0, 2)
              .map((p) => PLATFORM_LABELS[p])
              .join(", ")}
          </p>
        </div>
      </GameArt>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <p className="text-label text-subtle-foreground">PLAYTEST FOCUS</p>
          <h4 className="font-medium leading-snug">
            <Link href={link} className="transition-colors hover:text-secondary">
              {/* Stretched link makes the whole card clickable without a div-button. */}
              <span className="absolute inset-0" aria-hidden />
              <span className="line-clamp-1">{playtest.title.split(" — ")[1] ?? playtest.title}</span>
            </Link>
          </h4>
        </div>

        <MetaRow className="mt-auto border-t border-border pt-3">
          <MetaItem
            icon={Gift}
            label="Reward"
            value={playtest.reward.split(/[+·]/)[0].trim()}
            tone="strong"
            className="min-w-0 basis-full sm:basis-auto"
          />
          <MetaItem
            icon={Clock}
            label="Time"
            value={`~${playtest.requirements.estimatedHours}h`}
          />
          <MetaItem
            icon={Users}
            label="Open spots"
            value={isFull ? "Full" : `${spotsLeft} slots left`}
            tone={isFull ? "warning" : isNearlyFull ? "warning" : "default"}
          />
        </MetaRow>

        <p className="text-xs text-subtle-foreground">
          {formatDeadline(playtest.closesAt)}
        </p>
      </div>
    </article>
  );
}
