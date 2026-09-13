"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock3,
  Gift,
  Hourglass,
  LockKeyhole,
  Smartphone,
} from "lucide-react";

import type { Application } from "@/lib/types";
import { useApplicationsByTester, usePlaytests, useTesterTests } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { formatDeadline } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/states";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

type RewardState =
  | "pending"
  | "ready"
  | "in-progress"
  | "earned"
  | "not-awarded"
  | "withdrawn";

const MIN_WITHDRAWAL = 500;

function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

interface RewardRow {
  application: Application;
  playtest: ReturnType<typeof usePlaytests>[number];
  state: RewardState;
  progress: number;
}

const STATE_META: Record<
  RewardState,
  { label: string; tone: "default" | "success" | "warning" | "muted" | "primary" | "info"; description: string }
> = {
  pending: {
    label: "Awaiting approval",
    tone: "warning",
    description: "The developer is reviewing your application.",
  },
  ready: {
    label: "Ready to start",
    tone: "info",
    description: "You were accepted. Complete the test to unlock this reward.",
  },
  "in-progress": {
    label: "In progress",
    tone: "primary",
    description: "Finish the required tasks and submit your feedback.",
  },
  earned: {
    label: "Ready to claim",
    tone: "success",
    description: "Your test is complete and the reward is ready for the next step.",
  },
  "not-awarded": {
    label: "Not awarded",
    tone: "muted",
    description: "This application was not selected for the playtest.",
  },
  withdrawn: {
    label: "Withdrawn",
    tone: "muted",
    description: "This application is no longer active.",
  },
};

function rewardState(
  application: Application,
  progressStage: string | undefined,
): RewardState {
  if (application.status === "pending") return "pending";
  if (application.status === "rejected") return "not-awarded";
  if (application.status === "withdrawn") return "withdrawn";
  if (!progressStage || progressStage === "not-started") return "ready";
  if (progressStage === "completed") return "earned";
  return "in-progress";
}

function StateIcon({ state }: { state: RewardState }) {
  if (state === "earned") return <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />;
  if (state === "pending") return <Hourglass className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />;
  if (state === "not-awarded" || state === "withdrawn") {
    return <LockKeyhole className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />;
  }
  return <Clock3 className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />;
}

export function RewardsView() {
  const { user } = useSession();
  const [upiId, setUpiId] = useState("");
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);
  const applications = useApplicationsByTester(user?.id);
  const playtests = usePlaytests();
  const tests = useTesterTests(user?.id);

  if (!user) return null;

  const rewards = applications.flatMap<RewardRow>((application) => {
    const playtest = playtests.find((item) => item.id === application.playtestId);
    if (!playtest) return [];
    const test = tests.find((item) => item.playtest.id === playtest.id);
    const state = rewardState(application, test?.progress?.stage);
    const progress = state === "earned" ? 100 : test?.progress?.stage === "feedback-submitted" ? 85 : test?.progress?.stage === "in-progress" ? 45 : state === "ready" ? 10 : 0;
    return [{ application, playtest, state, progress }];
  });

  const earned = rewards.filter((reward) => reward.state === "earned");
  const active = rewards.filter((reward) => ["ready", "in-progress"].includes(reward.state));
  const waiting = rewards.filter((reward) => reward.state === "pending");
  const earnedCash = earned.reduce(
    (total, reward) => total + (reward.playtest.cashReward ?? 0),
    0,
  );
  const isValidUpi = /^[\w.-]+@[\w.-]+$/.test(upiId.trim());
  const canWithdraw = earnedCash >= MIN_WITHDRAWAL && isValidUpi;

  function requestWithdrawal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canWithdraw) setWithdrawalRequested(true);
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Tester rewards"
        title="Track what your testing unlocks"
        description="See the reward attached to every application, from first review to completed feedback."
        actions={
          <Button asChild variant="secondary">
            <Link href="/discover">
              Find more playtests <ArrowRight />
            </Link>
          </Button>
        }
      />

      <StatCardGrid>
        <StatCard label="Ready to claim" value={earned.length} icon={CheckCircle2} emphasis={earned.length > 0} />
        <StatCard label="In progress" value={active.length} icon={Clock3} />
        <StatCard label="Awaiting approval" value={waiting.length} icon={Hourglass} />
        <StatCard label="Reward tracks" value={rewards.length} icon={Gift} hint="Across your applications" />
      </StatCardGrid>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-secondary">
                <Banknote className="size-4" aria-hidden />
              </span>
              <p className="text-label text-secondary">UPI WITHDRAWAL</p>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Move earned rewards to your UPI
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Only completed cash rewards are withdrawable. You need at least {formatRupees(MIN_WITHDRAWAL)} in your balance before requesting a payout.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-label text-subtle-foreground">AVAILABLE UPI BALANCE</p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">{formatRupees(earnedCash)}</p>
              </div>
              <div>
                <p className="text-label text-subtle-foreground">MINIMUM</p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">{formatRupees(MIN_WITHDRAWAL)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={requestWithdrawal} className="rounded-lg border border-border-strong/70 bg-elevated p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <div>
                <p className="text-sm font-medium text-foreground">Your UPI ID</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Example: player@upi</p>
              </div>
            </div>
            <Input
              value={upiId}
              onChange={(event) => {
                setUpiId(event.target.value);
                setWithdrawalRequested(false);
              }}
              placeholder="name@upi"
              inputMode="email"
              aria-label="UPI ID"
              aria-invalid={upiId.length > 0 && !isValidUpi}
              className="mt-4"
            />
            <Button type="submit" className="mt-3 w-full" disabled={!canWithdraw}>
              Request {formatRupees(earnedCash)} withdrawal
              <ArrowRight />
            </Button>
            {withdrawalRequested ? (
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-success">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Withdrawal request recorded for the prototype. A real payout service will replace this flow later.
              </p>
            ) : earnedCash < MIN_WITHDRAWAL ? (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Complete more cash-reward playtests to unlock withdrawals.
              </p>
            ) : !isValidUpi ? (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Enter a valid UPI ID to enable the withdrawal request.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      {rewards.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="No rewards to track yet"
          description="Apply to a playtest and its reward status will appear here from the moment you send your application."
          action={
            <Button asChild size="sm">
              <Link href="/discover">Browse playtests</Link>
            </Button>
          }
        />
      ) : (
        <section className="space-y-5">
          <SectionTitle
            title="Your reward tracks"
            description="Rewards are tied to each playtest's requirements and completion state."
          />
          <div className="space-y-3">
            {rewards.map((reward) => (
              <RewardCard key={reward.application.id} reward={reward} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RewardCard({ reward }: { reward: RewardRow }) {
  const meta = STATE_META[reward.state];
  const isAccepted = reward.application.status === "accepted";
  const href = isAccepted ? `/tests/${reward.playtest.id}` : "/applications";

  return (
    <article className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={meta.tone} dot={reward.state === "in-progress"}>
              {meta.label}
            </Badge>
            {isAccepted && <StatusBadge kind="application" status={reward.application.status} />}
            <span className="text-xs text-subtle-foreground">{reward.playtest.game.title}</span>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold leading-snug">{reward.playtest.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
          </div>
          {isAccepted && (
            <div className="max-w-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Test completion</span>
                <span className="tabular-nums">{reward.progress}%</span>
              </div>
              <Progress value={reward.progress} indicatorClassName={reward.state === "earned" ? "bg-success" : undefined} aria-label={`${reward.playtest.title} reward progress`} />
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-border pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex items-start gap-2.5">
            <StateIcon state={reward.state} />
            <div className="min-w-0">
              <p className="text-label text-subtle-foreground">REWARD</p>
              <p className="mt-1 text-sm font-medium text-foreground">{reward.playtest.reward}</p>
            </div>
          </div>
          <p className="text-xs text-subtle-foreground">{formatDeadline(reward.playtest.closesAt)}</p>
          <Button asChild size="sm" variant={reward.state === "earned" ? "primary" : "secondary"}>
            <Link href={href}>
              {reward.state === "earned" ? "View completed test" : isAccepted ? "Open test workspace" : "View application"}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}