import type { Metadata } from "next";

import { DeveloperDashboard } from "@/components/developer/developer-dashboard";

export const metadata: Metadata = {
  title: "Developer dashboard",
  description: "Overview of your games and playtests.",
};

export default function DeveloperDashboardPage() {
  return <DeveloperDashboard />;
}
