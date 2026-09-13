import type { Metadata } from "next";
import { getPlatformStats } from "@/data";
import { AudienceLanding } from "@/components/marketing/audience-landing";

export const metadata: Metadata = {
  title: "For developers",
  description:
    "Run structured playtests, review applicants, and get feedback you can act on.",
};

export default async function DevelopersPage() {
  const stats = await getPlatformStats();

  return <AudienceLanding kind="developers" stats={stats} />;
}
