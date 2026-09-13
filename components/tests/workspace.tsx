"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Download,
  ExternalLink,
  Gift,
  Lock,
  Target,
} from "lucide-react";

import { cn, formatDate, formatDeadline } from "@/lib/utils";
import { testCompletion } from "@/lib/domain";
import {
  usePlaytest,
  useTestProgress,
  useTesterApplication,
} from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";
import { testsService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { GameArt } from "@/components/games/game-cover";
import { TaskList } from "@/components/playtests/task-list";
import { WorkflowStepper } from "@/components/tests/workflow-stepper";

/** One numbered step of the workspace. Locked steps explain why they're locked. */
function Step({
  index,
  title,
  description,
  locked = false,
  action,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  locked?: boolean;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface p-5 transition-opacity duration-[180ms]",
        locked && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2.5 font-display text-base font-semibold">
            <span className="text-subtle-foreground tabular-nums">
              {index}
            </span>
            {title}
            {locked && (
              <Lock className="size-3.5 text-subtle-foreground" aria-hidden />
            )}
          </h2>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}

export function Workspace({ playtestId }: { playtestId: string }) {
  const hydrated = useHydrated();
  const { user } = useSession();
  const toast = useToast();
  const playtest = usePlaytest(playtestId);
  const application = useTesterApplication(user?.id, playtestId);
  const progress = useTestProgress(user?.id, playtestId);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || !application || application.status !== "accepted") {
    return (
      <EmptyState
        icon={Lock}
        title="You don't have access to this test"
        description="Only testers accepted to this playtest can open the workspace."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/tests">Back to my tests</Link>
          </Button>
        }
      />
    );
  }

  const stage = progress?.stage ?? "not-started";
  const completion = testCompletion(progress, playtest);
  const buildDownloaded = progress?.buildDownloaded ?? false;
  const requiredDone = completion.total > 0 && completion.done === completion.total;
  const feedbackSubmitted =
    stage === "completed" || stage === "feedback-submitted";
  const taskPct = requiredDone ? 100 : Math.round(completion.ratio * 100);

  async function handleDownload() {
    setDownloading(true);
    try {
      await testsService.downloadBuild(playtestId, user!.id);
      toast({
        title: "Build unlocked",
        description: "You can start working through the tasks now.",
      });
    } finally {
      setDownloading(false);
    }
  }

  async function handleToggle(taskId: string) {
    setPendingTaskId(taskId);
    try {
      await testsService.toggleTask(playtestId, user!.id, taskId);
    } finally {
      setPendingTaskId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "My tests", href: "/tests" },
          { label: playtest.game.title },
        ]}
        eyebrow={`${playtest.game.title} · ${playtest.developer.name}`}
        title={playtest.title}
        actions={<StatusBadge kind="test" status={stage} />}
      />

      {/* Compact banner — keeps the game present without stealing the page. */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <GameArt game={playtest.game} ratio="21/9" scrim className="max-h-44" />
        <dl className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-6 gap-y-1 p-4 text-xs text-white/85">
          <div className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden />
            <dt className="sr-only">Deadline</dt>
            <dd>{formatDeadline(playtest.closesAt)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Gift className="size-3.5" aria-hidden />
            <dt className="sr-only">Reward</dt>
            <dd>{playtest.reward}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Build</dt>
            <dd>Build {playtest.game.buildVersion}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <WorkflowStepper
          steps={[
            {
              label: "Get the build",
              hint: buildDownloaded ? "Downloaded" : "Not downloaded yet",
              done: buildDownloaded,
            },
            {
              label: "Complete the tasks",
              hint: `${completion.done} of ${completion.total} required`,
              done: requiredDone,
            },
            {
              label: "Submit feedback",
              hint: feedbackSubmitted ? "Submitted" : "Not submitted",
              done: feedbackSubmitted,
            },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 space-y-4">
          <Step
            index={1}
            title="Access the build"
            description={
              playtest.requirements.ndaRequired
                ? "This build is under NDA. Don't share it, stream it, or post screenshots."
                : "Download the current build and keep it updated during the test."
            }
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handleDownload}
                loading={downloading}
                disabled={buildDownloaded}
                variant={buildDownloaded ? "secondary" : "primary"}
              >
                {buildDownloaded ? (
                  <>
                    <CheckCircle2 /> Build downloaded
                  </>
                ) : (
                  <>
                    <Download /> Download build
                  </>
                )}
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a href={playtest.buildUrl} target="_blank" rel="noreferrer">
                  Build page <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-subtle-foreground">
              Build {playtest.game.buildVersion} · updated{" "}
              {formatDate(playtest.game.updatedAt)}
            </p>
          </Step>

          <Step
            index={2}
            title="Complete the testing tasks"
            locked={!buildDownloaded}
            action={
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {completion.done}/{completion.total} required
              </span>
            }
          >
            <div className="space-y-4">
              <Progress
                value={taskPct}
                aria-label={`${taskPct}% of required tasks complete`}
                indicatorClassName={requiredDone ? "bg-success" : undefined}
              />
              {buildDownloaded ? (
                <TaskList
                  tasks={playtest.tasks}
                  completedIds={progress?.completedTaskIds ?? []}
                  onToggle={handleToggle}
                  pendingId={pendingTaskId}
                />
              ) : (
                <p className="rounded-lg border border-border bg-elevated px-3.5 py-3 text-sm text-muted-foreground">
                  Download the build above to start checking off tasks.
                </p>
              )}
            </div>
          </Step>

          <Step
            index={3}
            title="Submit your feedback"
            locked={!requiredDone && !feedbackSubmitted}
          >
            {feedbackSubmitted ? (
              <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-3.5">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Feedback submitted</p>
                  <p className="text-muted-foreground">
                    Thanks — {playtest.developer.name} can see your report now.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {requiredDone
                    ? "You've finished the required tasks. Share your structured feedback — ratings, highlights, pain points, and bugs."
                    : "Finish the required tasks above to unlock the feedback form."}
                </p>
                {requiredDone ? (
                  <Button asChild size="lg">
                    <Link href={`/tests/${playtest.id}/feedback`}>
                      Start feedback <ArrowRight />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" disabled>
                    Start feedback <ArrowRight />
                  </Button>
                )}
              </div>
            )}
          </Step>
        </div>

        {/* ---- Context rail --------------------------------------------- */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Target className="size-4 text-secondary" aria-hidden />
              What they want to learn
            </h2>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
              {playtest.goals.map((goal) => (
                <li key={goal} className="flex gap-2">
                  <span aria-hidden className="text-secondary">
                    •
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 text-xs">
            <h2 className="text-sm font-semibold text-foreground">Deadline</h2>
            <p className="mt-1 text-muted-foreground">
              {formatDate(playtest.closesAt)} · {formatDeadline(playtest.closesAt)}
            </p>
            <h2 className="mt-4 text-sm font-semibold text-foreground">
              Need help?
            </h2>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              Everything the developer specified is on the{" "}
              <Link
                href={`/playtests/${playtest.id}`}
                className="text-secondary hover:underline"
              >
                playtest page
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
