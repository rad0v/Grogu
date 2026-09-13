"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  Star,
} from "lucide-react";

import { greeting } from "@/lib/utils";
import { EMPTY_DISCOVER_FILTERS } from "@/lib/domain";
import {
  useApplicationsByTester,
  useDiscoverPlaytests,
  usePlaytests,
  useTesterProfile,
  useTesterTests,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { ApplicationCard } from "@/components/applications/application-card";
import { TestProgressCard } from "@/components/tests/test-progress-card";
import { PlaytestCard } from "@/components/playtests/playtest-card";

/**
 * The tester's home. Ordered by what needs doing: tests in flight first,
 * applications awaiting a decision second, discovery last.
 */
export function TesterDashboard() {
  const { user } = useSession();
  const profile = useTesterProfile(user?.id);
  const applications = useApplicationsByTester(user?.id);
  const allPlaytests = usePlaytests();
  const tests = useTesterTests(user?.id);
  const recommended = useDiscoverPlaytests(EMPTY_DISCOVER_FILTERS);

  if (!user) return null;

  const activeTests = tests.filter((t) => t.progress?.stage !== "completed");
  const completedTests = tests.filter((t) => t.progress?.stage === "completed");
  const pending = applications.filter((a) => a.status === "pending");
  const appliedPlaytestIds = new Set(applications.map((a) => a.playtestId));
  const suggestions = recommended
    .filter((p) => !appliedPlaytestIds.has(p.id))
    .slice(0, 3);

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={greeting()}
        title={user.name.split(" ")[0]}
        description="Your playtests, applications, and a few games that might suit you."
        actions={
          <Button asChild size="lg">
            <Link href="/discover">
              <Compass /> Discover playtests
            </Link>
          </Button>
        }
      />

      <StatCardGrid>
        <StatCard
          label="Reputation"
          value={profile ? profile.profile.reputation : "—"}
          hint={
            profile
              ? `${profile.profile.completedPlaytests} playtests completed`
              : undefined
          }
          icon={Star}
        />
        <StatCard
          label="Active tests"
          value={activeTests.length}
          icon={ClipboardList}
          emphasis={activeTests.length > 0}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          hint={pending.length > 0 ? `${pending.length} awaiting a decision` : "None pending"}
          icon={FileText}
        />
        <StatCard
          label="Completed"
          value={completedTests.length}
          icon={CheckCircle2}
        />
      </StatCardGrid>

      {/* ---- Active tests ------------------------------------------------- */}
      <section className="space-y-5">
        <SectionTitle
          title="Continue testing"
          description="Playtests you've been accepted to."
          action={
            activeTests.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/tests">
                  All tests <ArrowRight />
                </Link>
              </Button>
            )
          }
        />
        {activeTests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nothing in progress"
            description="Once a developer accepts you, your test workspace shows up here."
            action={
              <Button asChild size="sm" variant="secondary">
                <Link href="/discover">Browse playtests</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {activeTests.slice(0, 3).map((test) => (
              <TestProgressCard key={test.playtest.id} test={test} />
            ))}
          </div>
        )}
      </section>

      {/* ---- Applications ------------------------------------------------- */}
      <section className="space-y-5">
        <SectionTitle
          title="Recent applications"
          action={
            applications.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/applications">
                  View all <ArrowRight />
                </Link>
              </Button>
            )
          }
        />
        {applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="You haven't applied to any playtests yet"
            description="Applications you send will be tracked here with their status."
            action={
              <Button asChild size="sm" variant="secondary">
                <Link href="/discover">Find a playtest</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 3).map((application) => {
              const playtest = allPlaytests.find(
                (p) => p.id === application.playtestId,
              );
              if (!playtest) return null;
              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  playtest={playtest}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ---- Recommendations ---------------------------------------------- */}
      <section className="space-y-5">
        <SectionTitle
          title="Recommended for you"
          description="Open playtests you haven't applied to yet."
        />
        {suggestions.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Nothing new right now"
            description="You've applied to everything that's open. Check back soon."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {suggestions.map((playtest) => (
              <PlaytestCard key={playtest.id} playtest={playtest} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
