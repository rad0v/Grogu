"use client";

import Link from "next/link";
import { Gamepad2, Pencil, Plus } from "lucide-react";

import { GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { Game } from "@/lib/types";
import {
  useDeveloperGames,
  useDeveloperPlaytests,
} from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useSession } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { GameArt } from "@/components/games/game-cover";

interface GameRollup {
  playtests: number;
  active: number;
  testers: number;
  feedback: number;
}

function GameManagementCard({
  game,
  rollup,
}: {
  game: Game;
  rollup: GameRollup;
}) {
  return (
    <article className="lift flex flex-col overflow-hidden rounded-xl border border-border bg-surface hover:border-border-strong">
      <GameArt game={game} ratio="16/9" scrim>
        <div className="absolute right-3 top-3 flex gap-1.5">
          {rollup.active > 0 && (
            <Badge tone="overlay" dot>
              {rollup.active} active
            </Badge>
          )}
          <StatusBadge kind="game" status={game.status} overlay />
        </div>
        <div className="absolute inset-x-4 bottom-3">
          <h3 className="truncate font-display text-lg font-semibold text-white">
            {game.title}
          </h3>
          <p className="truncate text-xs text-white/70">
            {game.genres.map((g) => GENRE_LABELS[g]).join(" • ")} ·{" "}
            {game.platforms.map((p) => PLATFORM_LABELS[p]).join(", ")}
          </p>
        </div>
      </GameArt>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {game.tagline}
        </p>

        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border text-center [&>*]:bg-elevated [&>*]:px-2 [&>*]:py-2.5">
          <div>
            <dd className="font-display text-base font-semibold tabular-nums">
              {rollup.playtests}
            </dd>
            <dt className="text-label mt-1 text-subtle-foreground">Tests</dt>
          </div>
          <div>
            <dd className="font-display text-base font-semibold tabular-nums">
              {rollup.testers}
            </dd>
            <dt className="text-label mt-1 text-subtle-foreground">Testers</dt>
          </div>
          <div>
            <dd className="font-display text-base font-semibold tabular-nums">
              {rollup.feedback}
            </dd>
            <dt className="text-label mt-1 text-subtle-foreground">Reports</dt>
          </div>
        </dl>

        <div className="mt-auto flex gap-2">
          <Button asChild size="sm" variant="secondary" className="flex-1">
            <Link href={`/developer/playtests/new?game=${game.id}`}>
              New playtest
            </Link>
          </Button>
          {rollup.playtests > 0 && (
            <Button asChild size="sm" variant="ghost">
              <Link href="/developer/playtests">View playtests</Link>
            </Button>
          )}
          <Button
            asChild
            size="icon-sm"
            variant="ghost"
            aria-label={`Edit ${game.title}`}
          >
            <Link href={`/developer/games/${game.id}/edit`}>
              <Pencil />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function GamesView() {
  const { user } = useSession();
  const games = useDeveloperGames(user?.id);
  const playtests = useDeveloperPlaytests(user?.id);
  const applications = useGroguStore((s) => s.applications);
  const feedback = useGroguStore((s) => s.feedback);

  if (!user) return null;

  return (
    <div className="space-y-10">
      <PageHeader
        title="My games"
        description="Every game you've registered on Grogu. Add a game before creating its playtest."
        actions={
          <Button asChild>
            <Link href="/developer/games/new">
              <Plus /> Add new game
            </Link>
          </Button>
        }
      />

      {games.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="Nothing here yet."
          description="Add your first game to start recruiting playtesters."
          action={
            <Button asChild size="sm">
              <Link href="/developer/games/new">Add a game</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => {
            const gamePlaytests = playtests.filter((p) => p.gameId === game.id);
            const playtestIds = new Set(gamePlaytests.map((p) => p.id));
            return (
              <GameManagementCard
                key={game.id}
                game={game}
                rollup={{
                  playtests: gamePlaytests.length,
                  active: gamePlaytests.filter(
                    (p) =>
                      p.status === "recruiting" || p.status === "in-progress",
                  ).length,
                  testers: applications.filter(
                    (a) =>
                      playtestIds.has(a.playtestId) && a.status === "accepted",
                  ).length,
                  feedback: feedback.filter((f) =>
                    playtestIds.has(f.playtestId),
                  ).length,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
