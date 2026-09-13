import type { Metadata } from "next";

import { GamesView } from "@/components/developer/games-view";

export const metadata: Metadata = {
  title: "Your games",
  description: "Manage the games you have on Grogu.",
};

export default function DeveloperGamesPage() {
  return <GamesView />;
}
