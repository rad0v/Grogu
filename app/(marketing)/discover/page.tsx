import type { Metadata } from "next";

import { getDiscoverablePlaytests } from "@/data";
import { Container } from "@/components/ui/container";
import { DiscoverExplorer } from "@/components/playtests/discover-explorer";

export const metadata: Metadata = {
  title: "Discover playtests",
  description:
    "Browse indie games looking for testers. Filter by genre, platform, and time commitment.",
};

export default async function DiscoverPage() {
  const playtests = await getDiscoverablePlaytests();

  return (
    <>
      <div className="surface-grid border-b border-border">
        <Container className="py-12 sm:py-16">
          <p className="text-label text-secondary">Discover</p>
          <h1 className="text-display-sm mt-3 max-w-2xl">
            Find your next playtest
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every playtest below is open for applications right now. Sign in as a
            tester to apply.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <DiscoverExplorer initialPlaytests={playtests} />
      </Container>
    </>
  );
}
