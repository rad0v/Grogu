import type { Metadata } from "next";

import { RewardsView } from "@/components/tester/rewards-view";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Track rewards across your Grogu playtests.",
};

export default function RewardsPage() {
  return <RewardsView />;
}