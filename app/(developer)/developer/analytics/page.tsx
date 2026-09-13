import type { Metadata } from "next";

import { AnalyticsView } from "@/components/developer/analytics-view";

export const metadata: Metadata = {
  title: "Feedback & analytics",
  description: "Aggregated feedback across your playtests.",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
