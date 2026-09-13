"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { useTesterTests } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { TestProgressCard } from "@/components/tests/test-progress-card";

export function TestsListView() {
  const { user } = useSession();
  const tests = useTesterTests(user?.id);

  if (!user) return null;

  const active = tests.filter((t) => t.progress?.stage !== "completed");
  const completed = tests.filter((t) => t.progress?.stage === "completed");

  return (
    <div className="space-y-10">
      <PageHeader
        title="My tests"
        description="Playtests you've been accepted to. Work through the tasks, then submit feedback."
        actions={
          <Button asChild variant="secondary">
            <Link href="/discover">Find more playtests</Link>
          </Button>
        }
      />

      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="You're not on any playtests yet"
          description="When a developer accepts your application, the test workspace appears here."
          action={
            <Button asChild size="sm">
              <Link href="/discover">Browse playtests</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-10">
          <section className="space-y-5">
            <SectionTitle title={`Active (${active.length})`} />
            {active.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="Nothing active right now"
                description="Every playtest you've been accepted to is finished."
                action={
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/discover">Find another playtest</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {active.map((test) => (
                  <TestProgressCard key={test.playtest.id} test={test} />
                ))}
              </div>
            )}
          </section>

          {completed.length > 0 && (
            <section className="space-y-5">
              <SectionTitle title={`Completed (${completed.length})`} />
              <div className="space-y-3">
                {completed.map((test) => (
                  <TestProgressCard key={test.playtest.id} test={test} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
