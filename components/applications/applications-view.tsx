"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

import type { ApplicationStatus } from "@/lib/types";
import { useApplicationsByTester, usePlaytests } from "@/lib/hooks/use-grogu";
import { applicationsService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { ApplicationCard } from "@/components/applications/application-card";
import { useSession } from "@/lib/hooks/use-session";

const TABS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Not selected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export function ApplicationsView() {
  const { user } = useSession();
  const applications = useApplicationsByTester(user?.id);
  const playtests = usePlaytests();
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  if (!user) return null;

  async function withdraw(id: string) {
    setWithdrawingId(id);
    try {
      await applicationsService.withdrawApplication(id);
    } finally {
      setWithdrawingId(null);
    }
  }

  const counts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <PageHeader
        title="Your applications"
        description="Every playtest you've applied to and where it stands."
        actions={
          <Button asChild variant="secondary">
            <Link href="/discover">Find more playtests</Link>
          </Button>
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Browse Discover and apply to a playtest — it'll show up here with its status."
          action={
            <Button asChild size="sm">
              <Link href="/discover">Browse playtests</Link>
            </Button>
          }
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {tab.value !== "all" && counts[tab.value] ? (
                  <span className="ml-1 text-xs text-muted-foreground">
                    {counts[tab.value]}
                  </span>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => {
            const list =
              tab.value === "all"
                ? applications
                : applications.filter((a) => a.status === tab.value);
            return (
              <TabsContent key={tab.value} value={tab.value} className="space-y-3">
                {list.length === 0 ? (
                  <EmptyState
                    title={`No ${tab.label.toLowerCase()} applications`}
                    description="Nothing to show in this tab yet."
                  />
                ) : (
                  list.map((application) => {
                    const playtest = playtests.find(
                      (p) => p.id === application.playtestId,
                    );
                    if (!playtest) return null;
                    return (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        playtest={playtest}
                        onWithdraw={() => withdraw(application.id)}
                        withdrawing={withdrawingId === application.id}
                      />
                    );
                  })
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
