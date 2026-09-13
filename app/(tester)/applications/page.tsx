import type { Metadata } from "next";

import { ApplicationsView } from "@/components/applications/applications-view";

export const metadata: Metadata = {
  title: "Applications",
  description: "Track the status of your playtest applications.",
};

export default function ApplicationsPage() {
  return <ApplicationsView />;
}
