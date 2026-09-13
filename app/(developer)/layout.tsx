import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="developer" roleLabel="Developer">
      {children}
    </AppShell>
  );
}
