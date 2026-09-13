"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { FeedbackSentiment } from "@/lib/types";
import { SENTIMENT_COLORS } from "@/components/charts/chart-theme";

const LABELS: Record<FeedbackSentiment, string> = {
  positive: "Positive",
  neutral: "Mixed",
  negative: "Negative",
};

export function SentimentDonut({
  breakdown,
}: {
  breakdown: Record<FeedbackSentiment, number>;
}) {
  const total = breakdown.positive + breakdown.neutral + breakdown.negative;
  const data = (Object.keys(LABELS) as FeedbackSentiment[])
    .map((key) => ({ key, name: LABELS[key], value: breakdown[key] }))
    .filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No feedback yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="size-32 shrink-0 sm:size-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={44}
              outerRadius={68}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={SENTIMENT_COLORS[entry.key]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((entry) => (
          <li key={entry.key} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: SENTIMENT_COLORS[entry.key] }}
              aria-hidden
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-medium tabular-nums">
              {entry.value} ({Math.round((entry.value / total) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
