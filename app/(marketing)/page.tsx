import {
  getDiscoverablePlaytests,
  getPlatformStats,
} from "@/data";
import { Hero } from "@/components/marketing/hero";
import { PlatformWorkflowShowcase } from "@/components/marketing/platform-workflow-showcase";
import { FeaturedPlaytests } from "@/components/marketing/featured-playtests";
import { PlatformStats } from "@/components/marketing/audience-sections";
import { ClosingCta } from "@/components/marketing/closing-cta";

export default async function LandingPage() {
  const [stats, openPlaytests] = await Promise.all([
    getPlatformStats(),
    getDiscoverablePlaytests(),
  ]);

  return (
    <>
      <Hero stats={stats} />

      <PlatformWorkflowShowcase />

      <FeaturedPlaytests playtests={openPlaytests.slice(0, 3)} />

      <PlatformStats stats={stats} />

      <ClosingCta />
    </>
  );
}
