import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Game } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GameCard } from "@/components/games/game-card";

export function FeaturedGames({ games }: { games: Game[] }) {
  return (
    <section className="border-b border-border bg-surface/40 py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="In the catalogue"
            title="Studios building in the open"
            lead="A snapshot of the games currently being tested on Grogu."
          />
          <Link
            href="/discover"
            className={buttonVariants({ variant: "secondary" })}
          >
            Browse all
            <ArrowRight />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Container>
    </section>
  );
}
