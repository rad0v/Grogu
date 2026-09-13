import type { Metadata } from "next";

import { getPlatformStats } from "@/data";
import { AudienceLanding } from "@/components/marketing/audience-landing";

export const metadata: Metadata = {
  title: "For gamers",
  description:
    "Find meaningful game playtests, play unreleased builds, and build a reputation for useful feedback.",
};

export default async function GameTestersPage() {
  const stats = await getPlatformStats();

  return <AudienceLanding kind="gametesters" stats={stats} />;
}