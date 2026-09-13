import type { Metadata } from "next";

import { DeveloperProfileView } from "@/components/developer/developer-profile-view";

export const metadata: Metadata = {
  title: "Studio profile",
  description: "Your studio profile on Grogu.",
};

export default function DeveloperProfilePage() {
  return <DeveloperProfileView />;
}
