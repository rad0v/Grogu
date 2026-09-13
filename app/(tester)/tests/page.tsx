import type { Metadata } from "next";

import { TestsListView } from "@/components/tests/tests-list-view";

export const metadata: Metadata = {
  title: "My tests",
  description: "Playtests you've been accepted to.",
};

export default function TestsPage() {
  return <TestsListView />;
}
