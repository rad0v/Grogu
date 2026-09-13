"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { averageRatings, overallRating } from "@/lib/domain";
import { RATING_DIMENSIONS } from "@/lib/constants";
import {
  useDeveloperFeedback,
  useDeveloperPlaytests,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { RatingsBarChart } from "@/components/charts/ratings-bar-chart";
import { SentimentDonut } from "@/components/charts/sentiment-donut";
import { FeedbackCard } from "@/components/feedback/feedback-card";
import { RatingBar, RatingStars } from "@/components/feedback/rating";

/** Count repeated free-text entries, most frequent first. */
function tally(items: string[]) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = item.toLowerCase();
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Ranked free-text list with occurrence counts. */
function IssueList({
  items,
  tone,
  emptyLabel,
}: {
  items: { text: string; count: number }[];
  tone: "warning" | "destructive";
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const max = items[0].count;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.text} className="space-y-1.5">
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-muted-foreground first-letter:uppercase">
              {item.text}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-subtle-foreground">
              ×{item.count}
            </span>
          </div>
          {/* Bar makes the relative frequency readable without a chart. */}
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className={
                tone === "warning" ? "h-full bg-warning/70" : "h-full bg-destructive/70"
              }
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AnalyticsView() {
  const { user } = useSession();
  const playtests = useDeveloperPlaytests(user?.id);
  const allFeedback = useDeveloperFeedback(user?.id);
  const [scope, setScope] = useState<string>("all");

  const rows = useMemo(
    () =>
      scope === "all"
        ? allFeedback
        : allFeedback.filter((f) => f.playtest.id === scope),
    [allFeedback, scope],
  );

  if (!user) return null;

  const feedbackEntries = rows.map((r) => r.feedback);
  const avg = averageRatings(feedbackEntries);
  const overall = overallRating(avg);
  const sentiment = {
    positive: feedbackEntries.filter((f) => f.sentiment === "positive").length,
    neutral: feedbackEntries.filter((f) => f.sentiment === "neutral").length,
    negative: feedbackEntries.filter((f) => f.sentiment === "negative").length,
  };
  const painPoints = tally(feedbackEntries.flatMap((f) => f.painPoints));
  const bugs = tally(feedbackEntries.flatMap((f) => f.bugs));
  const recommendRate = feedbackEntries.length
    ? Math.round(
        (feedbackEntries.filter((f) => f.wouldRecommend).length /
          feedbackEntries.length) *
          100,
      )
    : 0;

  // Response volume per playtest, so a low overall score can be traced back.
  const volume = playtests
    .map((p) => ({
      playtest: p,
      count: allFeedback.filter((f) => f.playtest.id === p.id).length,
    }))
    .filter((v) => v.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxVolume = volume[0]?.count ?? 1;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Feedback & analytics"
        description="What your testers are saying, aggregated across playtests."
        actions={
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-full sm:w-64" aria-label="Filter by playtest">
              <SelectValue>
                {scope === "all"
                  ? "All playtests"
                  : (playtests.find((p) => p.id === scope)?.title ??
                    "All playtests")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All playtests</SelectItem>
              {playtests.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {feedbackEntries.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No feedback to analyse yet"
          description="Analytics appear once your testers start submitting feedback."
          action={
            <Button asChild size="sm" variant="secondary">
              <Link href="/developer/playtests">View playtests</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* ---- Headline ------------------------------------------------ */}
          <section className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-8">
            <div className="shrink-0">
              <p className="text-label text-subtle-foreground">
                Overall experience
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-6xl font-semibold tabular-nums">
                  {overall.toFixed(1)}
                </span>
                <span className="text-lg text-subtle-foreground">/ 5</span>
              </div>
              <div className="mt-2">
                <RatingStars value={overall} size="md" />
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Averaged across{" "}
              <span className="font-medium text-foreground">
                {feedbackEntries.length}
              </span>{" "}
              {feedbackEntries.length === 1 ? "report" : "reports"} from your
              testers.{" "}
              <span className="font-medium text-foreground">
                {recommendRate}%
              </span>{" "}
              would recommend the build as it stands.
            </p>
          </section>

          <StatCardGrid>
            <StatCard label="Responses" value={feedbackEntries.length} />
            <StatCard label="Avg enjoyment" value={avg.fun.toFixed(1)} />
            <StatCard label="Would recommend" value={`${recommendRate}%`} />
            <StatCard
              label="Bugs reported"
              value={feedbackEntries.reduce((n, f) => n + f.bugs.length, 0)}
            />
          </StatCardGrid>

          {/* ---- Category scores ---------------------------------------- */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="Category scores"
              description="Every dimension testers rate, 1–5."
            >
              <div className="space-y-4">
                {RATING_DIMENSIONS.map((dim) => (
                  <RatingBar
                    key={dim.key}
                    label={dim.label}
                    value={avg[dim.key]}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Sentiment">
              <SentimentDonut breakdown={sentiment} />
            </Panel>
          </div>

          <Panel
            title="Ratings at a glance"
            description="The same scores, side by side."
          >
            <RatingsBarChart ratings={avg} />
          </Panel>

          {/* ---- Issues -------------------------------------------------- */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="Common issues"
              description="Pain points more than one tester raised."
            >
              <IssueList
                items={painPoints}
                tone="warning"
                emptyLabel="No pain points reported."
              />
            </Panel>
            <Panel
              title="Reported bugs"
              description="Ranked by how often they came up."
            >
              <IssueList
                items={bugs}
                tone="destructive"
                emptyLabel="No bugs reported."
              />
            </Panel>
          </div>

          {/* ---- Volume -------------------------------------------------- */}
          {scope === "all" && volume.length > 1 && (
            <Panel
              title="Feedback volume"
              description="Where your reports are coming from."
            >
              <ul className="space-y-3">
                {volume.map(({ playtest, count }) => (
                  <li key={playtest.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <Link
                        href={`/developer/playtests/${playtest.id}?tab=feedback`}
                        className="truncate text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {playtest.title}
                      </Link>
                      <span className="shrink-0 text-xs tabular-nums text-subtle-foreground">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / maxVolume) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* ---- Written feedback ---------------------------------------- */}
          <section className="space-y-5">
            <SectionTitle
              title="Recent written feedback"
              description="The reports behind the numbers."
            />
            <div className="space-y-3">
              {rows.slice(0, 8).map((row) => (
                <FeedbackCard
                  key={row.feedback.id}
                  feedback={row.feedback}
                  tester={row.tester}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
