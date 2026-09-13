"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarClock,
  ExternalLink,
  Gift,
  Lock,
  MessageSquareText,
  Pencil,
  Users,
} from "lucide-react";

import { formatDate, formatDeadline } from "@/lib/utils";
import { computeAnalytics, PLAYTEST_STATUS_TRANSITIONS } from "@/lib/domain";
import { FOCUS_LABELS, PLAYTEST_STATUS_META } from "@/lib/constants";
import type { PlaytestStatus } from "@/lib/types";
import {
  useAcceptedTesters,
  useFeedbackForPlaytest,
  usePlaytest,
  usePlaytestApplicants,
} from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";
import { playtestsService } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { MetaItem, MetaRow } from "@/components/ui/meta";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { GameArt } from "@/components/games/game-cover";
import { ApplicantRow } from "@/components/playtests/applicant-row";
import { TesterCard } from "@/components/dashboard/tester-card";
import { FeedbackCard } from "@/components/feedback/feedback-card";
import { RatingBar } from "@/components/feedback/rating";
import { RatingsBarChart } from "@/components/charts/ratings-bar-chart";
import { SentimentDonut } from "@/components/charts/sentiment-donut";

const TABS = ["overview", "applicants", "testers", "feedback", "analytics"] as const;

/** Bordered panel used inside tabs, where a frame genuinely helps grouping. */
function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-surface p-5 ${className ?? ""}`}>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ManagePlaytest({ playtestId }: { playtestId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const toast = useToast();
  const { user } = useSession();
  const playtest = usePlaytest(playtestId);
  const applicants = usePlaytestApplicants(playtestId);
  const acceptedTesters = useAcceptedTesters(playtestId);
  const feedback = useFeedbackForPlaytest(playtestId);
  const users = useGroguStore((s) => s.users);
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const tabParam = searchParams.get("tab");
  const tab = TABS.includes(tabParam as (typeof TABS)[number])
    ? (tabParam as (typeof TABS)[number])
    : "overview";

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || playtest.developerId !== user.id) {
    return (
      <EmptyState
        icon={Lock}
        title="Playtest not found"
        description="This playtest doesn't exist or belongs to another studio."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/developer/playtests">Back to playtests</Link>
          </Button>
        }
      />
    );
  }

  const pending = applicants.filter((a) => a.application.status === "pending");
  const spotsLeft = Math.max(0, playtest.maxTesters - acceptedTesters.length);
  const analytics = computeAnalytics(playtest, feedback);
  const completedCount = acceptedTesters.filter(
    (t) => t.progress?.stage === "completed",
  ).length;
  const editable = playtest.status === "draft";

  async function changeStatus(status: PlaytestStatus) {
    setStatusBusy(true);
    setStatusError(null);
    try {
      await playtestsService.setPlaytestStatus(playtestId, status);
      toast({
        title: `Playtest ${PLAYTEST_STATUS_META[status].label.toLowerCase()}`,
      });
    } catch (error) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Couldn't update playtest status.",
      );
    } finally {
      setStatusBusy(false);
    }
  }

  function setTab(value: string) {
    router.replace(`/developer/playtests/${playtestId}?tab=${value}`, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Playtests", href: "/developer/playtests" },
          { label: playtest.game.title },
        ]}
        eyebrow={playtest.game.title}
        title={playtest.title}
        description={playtest.summary}
        actions={
          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Select
              value={playtest.status}
              onValueChange={(v) => changeStatus(v as PlaytestStatus)}
              disabled={statusBusy}
            >
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Playtest status"
              >
                <SelectValue>
                  {PLAYTEST_STATUS_META[playtest.status].label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[
                  playtest.status,
                  ...PLAYTEST_STATUS_TRANSITIONS[playtest.status],
                ].map((status) => (
                  <SelectItem key={status} value={status}>
                    {PLAYTEST_STATUS_META[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {editable && (
              <Button asChild variant="secondary">
                <Link href={`/developer/playtests/${playtest.id}/edit`}>
                  <Pencil /> Edit draft
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost">
              <Link href={`/playtests/${playtest.id}`}>
                Public page <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      {/* Banner keeps the game present while managing it. */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <GameArt game={playtest.game} ratio="21/9" scrim className="max-h-40" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4">
          <StatusBadge kind="playtest" status={playtest.status} overlay />
          {playtest.focusAreas.map((f) => (
            <Badge key={f} tone="overlay">
              {FOCUS_LABELS[f]}
            </Badge>
          ))}
        </div>
      </div>

      {statusError && (
        <p
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {statusError}
        </p>
      )}

      {!editable && playtest.status !== "archived" && (
        <p className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3.5 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden />
          This playtest is{" "}
          {PLAYTEST_STATUS_META[playtest.status].label.toLowerCase()}. Editing is
          locked to protect tester applications and progress.
        </p>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applicants">
            Applicants
            {pending.length > 0 && (
              <span className="rounded-full bg-warning/20 px-1.5 text-[10px] font-semibold text-warning">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="testers">
            Testers ({acceptedTesters.length})
          </TabsTrigger>
          <TabsTrigger value="feedback">Feedback ({feedback.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ---- Overview ------------------------------------------------ */}
        <TabsContent value="overview" className="space-y-6">
          <StatCardGrid>
            <StatCard
              label="Testers"
              value={`${acceptedTesters.length}/${playtest.maxTesters}`}
              icon={Users}
              hint={spotsLeft > 0 ? `${spotsLeft} spots left` : "Roster full"}
            />
            <StatCard
              label="Pending applicants"
              value={pending.length}
              emphasis={pending.length > 0}
              hint={pending.length > 0 ? "Waiting on your review" : undefined}
            />
            <StatCard
              label="Feedback in"
              value={`${feedback.length}/${acceptedTesters.length || "—"}`}
              icon={MessageSquareText}
              hint={`${analytics.responseRate}% response rate`}
            />
            <StatCard label="Completed" value={completedCount} />
          </StatCardGrid>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Details">
              <MetaRow className="flex-col items-start gap-3 text-sm">
                <MetaItem
                  icon={CalendarClock}
                  label="Schedule"
                  value={`${formatDeadline(playtest.closesAt)} · opened ${formatDate(playtest.opensAt)}`}
                />
                <MetaItem icon={Gift} label="Reward" value={playtest.reward} />
                <MetaItem
                  icon={Users}
                  label="Applicants"
                  value={`${applicants.length} applied in total`}
                />
              </MetaRow>
            </Panel>

            <Panel title="Progress">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Roster filled</span>
                    <span className="tabular-nums">
                      {acceptedTesters.length}/{playtest.maxTesters}
                    </span>
                  </div>
                  <Progress
                    value={
                      (acceptedTesters.length /
                        Math.max(1, playtest.maxTesters)) *
                      100
                    }
                    aria-label="Roster filled"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Feedback completion</span>
                    <span className="tabular-nums">
                      {completedCount}/{acceptedTesters.length || 0}
                    </span>
                  </div>
                  <Progress
                    value={
                      acceptedTesters.length
                        ? (completedCount / acceptedTesters.length) * 100
                        : 0
                    }
                    indicatorClassName="bg-success"
                    aria-label="Feedback completion"
                  />
                </div>
              </div>
            </Panel>
          </div>

          <Panel title="What you're testing for">
            <ul className="space-y-2.5">
              {playtest.goals.map((goal) => (
                <li
                  key={goal}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span aria-hidden className="text-secondary">
                    →
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>

        {/* ---- Applicants ---------------------------------------------- */}
        <TabsContent value="applicants" className="space-y-4">
          {applicants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="Share the public playtest page to attract testers."
              action={
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/playtests/${playtest.id}`}>
                    Open public page
                  </Link>
                </Button>
              }
            />
          ) : (
            <>
              <SectionTitle
                title={`${pending.length} awaiting review`}
                description={
                  spotsLeft > 0
                    ? `${spotsLeft} tester ${spotsLeft === 1 ? "spot" : "spots"} left to fill.`
                    : "Every tester slot is full."
                }
              />
              <div className="space-y-3">
                {applicants.map(({ application, tester, profile }) => (
                  <ApplicantRow
                    key={application.id}
                    application={application}
                    tester={tester}
                    profile={profile}
                    spotsLeft={spotsLeft}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* ---- Testers -------------------------------------------------- */}
        <TabsContent value="testers" className="space-y-4">
          {acceptedTesters.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No testers accepted yet"
              description="Accept applicants from the Applicants tab to build your roster."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {acceptedTesters.map(({ application, tester, progress }) => (
                <TesterCard
                  key={application.id}
                  tester={tester}
                  application={application}
                  progress={progress}
                  playtest={playtest}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Feedback ------------------------------------------------- */}
        <TabsContent value="feedback" className="space-y-3">
          {feedback.length === 0 ? (
            <EmptyState
              icon={MessageSquareText}
              title="No feedback submitted yet"
              description="Testers submit feedback after completing the required tasks."
            />
          ) : (
            feedback.map((entry) => (
              <FeedbackCard
                key={entry.id}
                feedback={entry}
                tester={users.find((u) => u.id === entry.testerId)}
              />
            ))
          )}
        </TabsContent>

        {/* ---- Analytics ------------------------------------------------ */}
        <TabsContent value="analytics" className="space-y-6">
          {feedback.length === 0 ? (
            <EmptyState
              icon={MessageSquareText}
              title="Analytics unlock with feedback"
              description="Once testers submit feedback you'll see rating breakdowns and sentiment here."
            />
          ) : (
            <>
              <StatCardGrid>
                <StatCard label="Responses" value={feedback.length} />
                <StatCard
                  label="Avg enjoyment"
                  value={analytics.averageRatings.fun.toFixed(1)}
                />
                <StatCard label="Bugs reported" value={analytics.totalBugs} />
                <StatCard
                  label="Avg hours played"
                  value={analytics.averageHoursPlayed.toFixed(1)}
                />
              </StatCardGrid>

              <div className="grid gap-6 lg:grid-cols-2">
                <Panel title="Average ratings">
                  <RatingsBarChart ratings={analytics.averageRatings} />
                </Panel>
                <Panel title="Sentiment">
                  <SentimentDonut breakdown={analytics.sentimentBreakdown} />
                </Panel>
              </div>

              <Panel title="Rating detail">
                <div className="grid gap-5 sm:grid-cols-2">
                  <RatingBar label="Fun" value={analytics.averageRatings.fun} />
                  <RatingBar
                    label="Difficulty"
                    value={analytics.averageRatings.difficulty}
                  />
                  <RatingBar
                    label="Clarity"
                    value={analytics.averageRatings.clarity}
                  />
                  <RatingBar
                    label="Performance"
                    value={analytics.averageRatings.performance}
                  />
                  <RatingBar
                    label="Polish"
                    value={analytics.averageRatings.polish}
                  />
                </div>
              </Panel>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
