import type { Metadata } from "next";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { HowItWorksAudience } from "@/components/marketing/how-it-works-audience";
import { DeveloperCta } from "@/components/marketing/audience-sections";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How playtesting on Grogu works for testers and developers, step by step.",
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksAudience />

      <HowItWorks />

      <DeveloperCta />
    </>
  );
}
