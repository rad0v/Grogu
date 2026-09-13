import type { Metadata } from "next";

import { PlaytestsView } from "@/components/developer/playtests-view";

export const metadata: Metadata = {
  title: "Playtests",
  description: "All your playtests across every game.",
};

export default function DeveloperPlaytestsPage() {
  return <PlaytestsView />;
}
