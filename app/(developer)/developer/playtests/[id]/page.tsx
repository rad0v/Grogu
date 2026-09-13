import { Suspense } from "react";
import type { Metadata } from "next";

import { PageSkeleton } from "@/components/ui/states";
import { ManagePlaytest } from "@/components/developer/manage-playtest";

export const metadata: Metadata = {
  title: "Manage playtest",
  description: "Review applicants, testers, feedback, and analytics.",
};

export default async function ManagePlaytestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ManagePlaytest playtestId={id} />
    </Suspense>
  );
}
