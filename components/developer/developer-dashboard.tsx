"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  ListChecks,
  MessageSquareText,
  Plus,
  Users,
} from "lucide-react";

import { formatRelativeTime, greeting } from "@/lib/utils";
import {
  useDeveloperFeedback,
  useDeveloperPlaytests,
  useDeveloperProfile,
  useDeveloperStats,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { UserAvatar } from "@/components/ui/avatar";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { DeveloperPlaytestRow } from "@/components/developer/playtest-row";
import { RatingStars } from "@/components/feedback/rating";

/**
 * The studio's command centre. Ordered by what's blocking: anything waiting on
 * the developer's decision first, then what testers are saying.
 */
export function DeveloperDashboard() {
  const { user } = useSession();
  const profile = useDeveloperProfile(user?.id);
  const stats = useDeveloperStats(user?.id);
  const playtests = useDeveloperPlaytests(user?.id);
  const feedback = useDeveloperFeedback(user?.id);

  if (!user) return null;

  const active = playtests.filter(
    (p) => p.status === "recruiting" || p.status === "in-progress",
  );

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={greeting()}
        title={profile?.profile.studioName ?? `${user.name.split(" ")[0]}'s studio`}
        description="Your games, active playtests, and the feedback coming in."
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href="/developer/games/new">
                <Gamepad2 /> Add game
              </Link>
            </Button>
            <Button asChild>
              <Link href="/developer/playtests/new">
                <Plus /> New playtest
              </Link>
            </Button>
          </>
        }
      />

      <StatCardGrid>
        <StatCard label="Games" value={stats.games} icon={Gamepad2} />
        <StatCard
          label="Active playtests"
          value={stats.activePlaytests}
          icon={ListChecks}
        />
        <StatCard
          label="Testers"
          value={stats.acceptedTesters}
          icon={Users}
          hint={
            stats.pendingApplicants > 0
              ? `${stats.pendingApplicants} awaiting review`
              : "No applicants pending"
          }
          emphasis={stats.pendingApplicants > 0}
        />
        <StatCard
          label="Feedback received"
          value={stats.feedbackCount}
          icon={MessageSquareText}
        />
      </StatCardGrid>

      {/* ---- Active playtests ------------------------------------------ */}
      <section className="space-y-5">
        <SectionTitle
          title="Active playtests"
          description="Recruiting or in progress right now."
          action={
            playtests.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/developer/playtests">
                  All playtests <ArrowRight />
                </Link>
              </Button>
            )
          }
        />

        {active.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nothing here yet."
            description="Create a playtest to start recruiting testers for one of your games."
            action={
              <Button asChild size="sm">
                <Link href="/developer/playtests/new">New playtest</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {active.map((playtest) => (
              <DeveloperPlaytestRow key={playtest.id} playtest={playtest} />
            ))}
          </div>
        )}
      </section>

      {/* ---- Recent feedback ------------------------------------------- */}
      <section className="space-y-5">
        <SectionTitle
          title="Recent feedback"
          description="The latest reports from your testers."
          action={
            feedback.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/developer/analytics">
                  View analytics <ArrowRight />
                </Link>
              </Button>
            )
          }
        />

        {feedback.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title="No feedback yet"
            description="Reports from your testers will appear here as they submit them."
          />
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
            {feedback.slice(0, 5).map(({ feedback: f, playtest, tester }) => (
              <li
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {tester && (
                    <UserAvatar
                      name={tester.name}
                      src={tester.avatarUrl}
                      className="size-8 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      <span className="font-medium">
                        {tester?.name ?? "A tester"}
                      </span>{" "}
                      <span className="text-muted-foreground">on</span>{" "}
                      <Link
                        href={`/developer/playtests/${playtest.id}?tab=feedback`}
                        className="text-secondary hover:underline"
                      >
                        {playtest.title}
                      </Link>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.summary}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <RatingStars value={f.ratings.fun} />
                  <span className="text-xs text-subtle-foreground">
                    {formatRelativeTime(f.submittedAt)}
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
