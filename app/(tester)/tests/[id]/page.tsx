import type { Metadata } from "next";

import { Workspace } from "@/components/tests/workspace";

export const metadata: Metadata = {
  title: "Test workspace",
  description: "Complete testing tasks and submit feedback.",
};

export default async function TestWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Workspace playtestId={id} />;
}
