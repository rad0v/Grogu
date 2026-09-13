import type { Metadata } from "next";

import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Submit feedback",
  description: "Structured feedback for the developer.",
};

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FeedbackForm playtestId={id} />;
}
