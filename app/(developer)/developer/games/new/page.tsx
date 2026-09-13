import type { Metadata } from "next";

import { GameForm } from "@/components/games/game-form";

export const metadata: Metadata = {
  title: "Add a game",
  description: "Add a new game to Grogu.",
};

export default function NewGamePage() {
  return <GameForm />;
}
