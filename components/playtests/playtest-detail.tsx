"use client";

import Link from "next/link";
import { CalendarClock, Clock, Compass, Gift, Target, Users } from "lucide-react";

import { formatDate, formatDeadline } from "@/lib/utils";
import { playtestCapacity } from "@/lib/domain";
import { FOCUS_LABELS, GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { PlaytestWithRelations } from "@/lib/types";
import { usePlaytest, useDeveloperProfile } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MetaStat, MetaStatGrid } from "@/components/ui/meta";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameCover } from "@/components/games/game-cover";
import { DeveloperCard } from "@/components/games/developer-card";
import { RequirementsList } from "@/components/playtests/requirements-list";
import { TaskList } from "@/components/playtests/task-list";
import { ApplyPanel } from "@/components/playtests/apply-panel";

/** Section wrapper — heading plus content, no card. Keeps the page reading. */
function Section({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string;
  icon?: typeof Target;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-8 first:border-0 first:pt-0">
      <div className="space-y-1.5">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          {Icon && <Icon className="size-4.5 text-secondary" aria-hidden />}
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function PlaytestDetail({
  playtestId,
  initialPlaytest,
}: {
  playtestId: string;
  initialPlaytest: PlaytestWithRelations | null;
}) {
  const hydrated = useHydrated();
  const fromStore = usePlaytest(playtestId);
  const playtest = hydrated ? fromStore : (initialPlaytest ?? undefined);
  const developer = useDeveloperProfile(playtest?.developerId);

  if (!hydrated && !initialPlaytest) {
    return (
      <Container className="py-12">
        <PageSkeleton />
      </Container>
    );
  }

  if (!playtest) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={Compass}
          title="Playtest not found"
          description="This playtest may have been closed or removed."
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/discover">Browse open playtests</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const { spotsLeft, isFull } = playtestCapacity(playtest);

  return (
    <div>
      {/* ---- Banner ------------------------------------------------------- */}
      <header className="relative border-b border-border">
        <div className="absolute inset-0" aria-hidden>
          <GameCover game={playtest.game} />
          {/* Two stacked scrims: one for overall legibility, one to anchor the
              text block at the bottom-left. */}
          <div className="absolute inset-0 bg-background/45" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/85 to-background/30" />
        </div>

        <Container className="relative flex min-h-[22rem] flex-col justify-end pb-10 pt-8 sm:min-h-[26rem] sm:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-auto text-xs text-muted-foreground"
          >
            <Link href="/discover" className="transition-colors hover:text-foreground">
              Discover
            </Link>
            <span className="mx-1.5 text-subtle-foreground">/</span>
            <span className="text-foreground">{playtest.game.title}</span>
          </nav>

          <div className="mt-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge kind="playtest" status={playtest.status} />
              {playtest.game.genres.map((g) => (
                <Badge key={g} tone="muted">
                  {GENRE_LABELS[g]}
                </Badge>
              ))}
              {playtest.requirements.ndaRequired && (
                <Badge tone="outline">NDA required</Badge>
              )}
            </div>

            <h1 className="text-display-sm">{playtest.game.title}</h1>

            <p className="text-lg leading-snug text-secondary">
              {playtest.title}
            </p>

            <p className="text-sm text-muted-foreground">
              {playtest.developer.name} · build {playtest.game.buildVersion} ·{" "}
              {playtest.requirements.platforms
                .map((p) => PLATFORM_LABELS[p])
                .join(", ")}
            </p>
          </div>
        </Container>
      </header>

      {/* ---- Key facts ---------------------------------------------------- */}
      <Container className="-mt-px py-8">
        <MetaStatGrid>
          <MetaStat label="Reward" value={playtest.reward} />
          <MetaStat
            label="Time commitment"
            value={`~${playtest.requirements.estimatedHours}h`}
            hint={`${playtest.tasks.length} tasks`}
          />
          <MetaStat
            label="Tester slots"
            value={isFull ? "Full" : spotsLeft}
            hint={`${playtest.acceptedTesters} of ${playtest.maxTesters} filled`}
          />
          <MetaStat
            label="Applications close"
            value={formatDate(playtest.closesAt)}
            hint={formatDeadline(playtest.closesAt)}
          />
        </MetaStatGrid>
      </Container>

      {/* ---- Body --------------------------------------------------------- */}
      <Container className="grid gap-12 pb-20 lg:grid-cols-[1fr_21rem] lg:gap-14">
        <div className="min-w-0 space-y-8">
          <Section title="About the game">
            <p className="text-base leading-relaxed text-muted-foreground">
              {playtest.game.description}
            </p>
          </Section>

          <Section
            title="What you'll be testing"
            icon={Target}
            description={playtest.summary}
          >
            <ul className="space-y-2.5">
              {playtest.goals.map((goal) => (
                <li
                  key={goal}
                  className="flex gap-3 rounded-lg border border-border bg-surface p-3.5 text-sm leading-relaxed"
                >
                  <span aria-hidden className="mt-0.5 text-secondary">
                    →
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {playtest.focusAreas.map((focus) => (
                <Badge key={focus} tone="primary">
                  {FOCUS_LABELS[focus]}
                </Badge>
              ))}
            </div>
          </Section>

          <Section
            title={`Testing tasks (${playtest.tasks.length})`}
            description="You'll work through these once accepted. Required tasks must be done before submitting feedback."
          >
            <TaskList tasks={playtest.tasks} />
          </Section>

          <Section
            title="Tester requirements"
            description="The developer reviews every applicant against these."
          >
            <RequirementsList
              requirements={playtest.requirements}
              playtest={playtest}
            />
          </Section>

          <Section title="About the developer">
            {developer ? (
              <DeveloperCard user={developer.user} profile={developer.profile} />
            ) : (
              <DeveloperCard user={playtest.developer} />
            )}
          </Section>
        </div>

        {/* ---- Apply rail ------------------------------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <ApplyPanel playtest={playtest} />

          <dl className="mt-5 space-y-3 px-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Gift className="size-3.5 text-subtle-foreground" aria-hidden />
              <dt className="sr-only">Reward</dt>
              <dd>{playtest.reward}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-subtle-foreground" aria-hidden />
              <dt className="sr-only">Time commitment</dt>
              <dd>~{playtest.requirements.estimatedHours} hours total</dd>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-3.5 text-subtle-foreground" aria-hidden />
              <dt className="sr-only">Applicants</dt>
              <dd>{playtest.applicantCount} testers have applied</dd>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-3.5 text-subtle-foreground" aria-hidden />
              <dt className="sr-only">Opened</dt>
              <dd>Opened {formatDate(playtest.opensAt)}</dd>
            </div>
          </dl>
        </aside>
      </Container>
    </div>
  );
}
