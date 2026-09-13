import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export default function TesterLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="tester" roleLabel="Tester">
      {children}
    </AppShell>
  );
}
