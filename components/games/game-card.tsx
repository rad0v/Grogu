import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { Game } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameArt } from "@/components/games/game-cover";

/**
 * Game card for catalogue-style surfaces (marketing "Featured games").
 *
 * Playtest-specific detail belongs on `PlaytestCard`; this one is about the
 * game itself, so it stays quiet: art, name, genre/platform line, tagline.
 */
export function GameCard({
  game,
  href,
  className,
}: {
  game: Game;
  href?: string;
  className?: string;
}) {
  const body = (
    <>
      <GameArt game={game} ratio="16/9" scrim>
        <div className="absolute right-3 top-3">
          <StatusBadge kind="game" status={game.status} overlay />
        </div>
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold text-white">
              {game.title}
            </h3>
            <p className="truncate text-xs text-white/70">
              {game.genres.map((g) => GENRE_LABELS[g]).join(" • ")}
              {" · "}
              {game.platforms.map((p) => PLATFORM_LABELS[p]).join(", ")}
            </p>
          </div>
          {href && (
            <ArrowUpRight
              className="size-4 shrink-0 text-white/60 transition-transform duration-[180ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
              aria-hidden
            />
          )}
        </div>
      </GameArt>

      <p className="p-4 text-sm leading-relaxed text-muted-foreground">
        {game.tagline}
      </p>
    </>
  );

  const shell = cn(
    "lift group flex flex-col overflow-hidden rounded-xl border border-border bg-surface hover:border-border-strong",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={shell}>
        {body}
      </Link>
    );
  }

  return <article className={shell}>{body}</article>;
}
