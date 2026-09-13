import type { Metadata } from "next";

import { TesterProfileView } from "@/components/tester/tester-profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your tester profile and reputation.",
};

export default function ProfilePage() {
  return <TesterProfileView />;
}
