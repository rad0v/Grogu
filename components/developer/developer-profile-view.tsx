"use client";

import Link from "next/link";
import {
  Building2,
  Gamepad2,
  Globe,
  MapPin,
  MessageSquareText,
  Users,
} from "lucide-react";

import { formatDate } from "@/lib/utils";
import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import {
  useDeveloperGames,
  useDeveloperPlaytests,
  useDeveloperProfile,
  useDeveloperStats,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { MetaItem, MetaRow } from "@/components/ui/meta";
import { UserAvatar } from "@/components/ui/avatar";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameArt } from "@/components/games/game-cover";

/**
 * The studio's public face — what a tester reads before deciding whether a
 * playtest is worth their evening.
 */
export function DeveloperProfileView() {
  const { user } = useSession();
  const data = useDeveloperProfile(user?.id);
  const stats = useDeveloperStats(user?.id);
  const games = useDeveloperGames(user?.id);
  const playtests = useDeveloperPlaytests(user?.id);

  if (!user || !data) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="Sign in as a developer to view your studio profile."
      />
    );
  }

  const { profile } = data;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Studio profile"
        description="This is what testers see on your playtests."
      />

      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <UserAvatar
            name={profile.studioName}
            className="size-20 shrink-0 text-xl"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-2xl font-semibold">
                {profile.studioName}
              </h2>
              <Badge tone="primary" size="md">
                <Building2 /> Studio
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Led by {user.name} · joined {formatDate(user.joinedAt)}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          </div>
        </div>

        <MetaRow className="mt-6 border-t border-border pt-5">
          <MetaItem
            icon={Building2}
            label="Studio size"
            value={`${STUDIO_SIZE_LABELS[profile.studioSize]} · founded ${profile.foundedYear}`}
          />
          <MetaItem icon={MapPin} label="Location" value={user.location} />
          {profile.website && (
            <MetaItem
              icon={Globe}
              label="Website"
              value={profile.website.replace(/^https?:\/\//, "")}
            />
          )}
        </MetaRow>
      </section>

      <StatCardGrid>
        <StatCard label="Games" value={stats.games} icon={Gamepad2} />
        <StatCard label="Playtests run" value={playtests.length} />
        <StatCard
          label="Testers worked with"
          value={stats.acceptedTesters}
          icon={Users}
        />
        <StatCard
          label="Feedback received"
          value={stats.feedbackCount}
          icon={MessageSquareText}
        />
      </StatCardGrid>

      <section className="space-y-5">
        <SectionTitle
          title="Games"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/developer/games">Manage games</Link>
            </Button>
          }
        />
        {games.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="Nothing here yet."
            description="Add a game to start running playtests."
            action={
              <Button asChild size="sm">
                <Link href="/developer/games/new">Add a game</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {games.map((game) => (
              <li
                key={game.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3"
              >
                <GameArt
                  game={game}
                  ratio="16/10"
                  className="w-24 shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{game.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {game.tagline}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge kind="game" status={game.status} />
                  <span className="hidden text-xs text-subtle-foreground sm:inline">
                    {playtests.filter((p) => p.gameId === game.id).length}{" "}
                    playtests
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
