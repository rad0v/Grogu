import { Suspense } from "react";
import type { Metadata } from "next";

import { PageSkeleton } from "@/components/ui/states";
import { PlaytestForm } from "@/components/playtests/playtest-form";

export const metadata: Metadata = {
  title: "Create a playtest",
  description: "Set up a new playtest for one of your games.",
};

export default function NewPlaytestPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PlaytestForm />
    </Suspense>
  );
}
