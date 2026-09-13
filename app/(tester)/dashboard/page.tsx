import type { Metadata } from "next";

import { TesterDashboard } from "@/components/tester/tester-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your tester dashboard.",
};

export default function DashboardPage() {
  return <TesterDashboard />;
}
