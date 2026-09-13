"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { FeedbackRatings } from "@/lib/types";
import { RATING_DIMENSIONS } from "@/lib/constants";
import { CHART_COLORS } from "@/components/charts/chart-theme";

export function RatingsBarChart({ ratings }: { ratings: FeedbackRatings }) {
  const data = RATING_DIMENSIONS.map((dim) => ({
    name: dim.label,
    value: Math.round(ratings[dim.key] * 10) / 10,
  }));

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={56}>
            <LabelList
              dataKey="value"
              position="top"
              fill={CHART_COLORS.secondary}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
