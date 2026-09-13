"use client";

import { Award, CheckCircle2, Gamepad2, Star, TrendingUp } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { overallRating } from "@/lib/domain";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useTesterProfile, useTesterTests } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/ui/avatar";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { RatingStars } from "@/components/feedback/rating";

/** Labelled group of tags — platforms, genres. */
function SkillGroup({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div>
      <p className="text-label text-subtle-foreground">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {values.map((value) => (
          <Badge key={value} tone="muted" size="md">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/**
 * The tester's public-facing portfolio — this is what a developer reads before
 * accepting an application, so it leads with credibility: reputation, volume,
 * reliability, and the actual history behind those numbers.
 */
export function TesterProfileView() {
  const { user } = useSession();
  const data = useTesterProfile(user?.id);
  const tests = useTesterTests(user?.id);
  const feedback = useGroguStore((s) => s.feedback);

  if (!user || !data) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="Sign in as a tester to view your profile."
      />
    );
  }

  const { profile } = data;
  const myFeedback = feedback
    .filter((f) => f.testerId === user.id)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const completed = tests.filter((t) => t.progress?.stage === "completed");
  const completionRate =
    tests.length > 0 ? Math.round((completed.length / tests.length) * 100) : 100;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Tester profile"
        description="This is what developers see when they review your application."
      />

      {/* ---- Identity ------------------------------------------------- */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <UserAvatar
            name={user.name}
            src={user.avatarUrl}
            className="size-20 text-xl"
          />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-2xl font-semibold">{user.name}</h2>
              <Badge tone="primary" size="md">
                <Gamepad2 /> Game tester
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              @{user.handle} · {user.location} · joined{" "}
              {formatDate(user.joinedAt)}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          </div>

          {/* Reputation is the headline number for a tester. */}
          <div className="shrink-0 rounded-xl border border-primary-line bg-primary-soft px-6 py-4 text-center">
            <p className="font-display text-4xl font-semibold tabular-nums text-secondary">
              {profile.reputation}
            </p>
            <p className="text-label mt-1.5 text-subtle-foreground">
              Reputation
            </p>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Reputation progress</span>
            <span className="tabular-nums">{profile.reputation} / 100</span>
          </div>
          <Progress value={profile.reputation} className="mt-2" />
        </div>
      </section>

      {/* ---- Numbers -------------------------------------------------- */}
      <StatCardGrid>
        <StatCard
          label="Playtests joined"
          value={tests.length}
          icon={Gamepad2}
        />
        <StatCard
          label="Completed"
          value={profile.completedPlaytests}
          icon={CheckCircle2}
        />
        <StatCard
          label="Completion rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
        />
        <StatCard
          label="Avg feedback rating"
          value={profile.averageFeedbackRating.toFixed(1)}
          hint={EXPERIENCE_LABELS[profile.experienceLevel]}
          icon={Star}
        />
      </StatCardGrid>

      <div className="grid gap-10 lg:grid-cols-[1fr_19rem]">
        {/* ---- History ------------------------------------------------ */}
        <section className="min-w-0 space-y-5">
          <SectionTitle
            title="Testing history"
            description="Playtests you've completed and the reports you filed."
          />
          {myFeedback.length === 0 ? (
            <EmptyState
              icon={Gamepad2}
              title="No completed playtests yet"
              description="Finish a playtest and submit feedback to start building your history."
            />
          ) : (
            <ul className="space-y-3">
              {myFeedback.map((f) => {
                const playtest = tests.find(
                  (t) => t.playtest.id === f.playtestId,
                )?.playtest;
                return (
                  <li
                    key={f.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {playtest?.title ?? "Playtest"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {playtest?.game.title ?? ""} · {f.hoursPlayed}h played ·
                        submitted {formatDate(f.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <RatingStars value={overallRating(f.ratings)} />
                      <Badge
                        tone={
                          f.sentiment === "positive"
                            ? "success"
                            : f.sentiment === "negative"
                              ? "destructive"
                              : "muted"
                        }
                      >
                        {f.sentiment}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ---- Credentials -------------------------------------------- */}
        <aside className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Badges</h2>
            {profile.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Badges unlock as you complete playtests.
              </p>
            ) : (
              <ul className="space-y-2">
                {profile.badges.map((badge) => (
                  <li
                    key={badge}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 py-2.5"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary-soft text-secondary">
                      <Award className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-sm font-medium">{badge}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-5 border-t border-border pt-8">
            <h2 className="font-display text-lg font-semibold">Skills</h2>
            <SkillGroup
              label="Platforms"
              values={profile.platforms.map((p) => PLATFORM_LABELS[p])}
            />
            <SkillGroup
              label="Genres"
              values={profile.preferredGenres.map((g) => GENRE_LABELS[g])}
            />
            <SkillGroup label="Languages" values={profile.languages} />
            <div>
              <p className="text-label text-subtle-foreground">Availability</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {profile.weeklyAvailabilityHours} hours per week
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
