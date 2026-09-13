"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useParams } from "next/navigation";

import { PlaytestForm } from "@/components/playtests/playtest-form";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { usePlaytest } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";

export default function EditPlaytestPage() {
  const params = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const { user } = useSession();
  const playtest = usePlaytest(params.id);

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || playtest.developerId !== user.id) {
    return (
      <EmptyState
        icon={Lock}
        title="Playtest not found"
        description="This playtest doesn't exist or belongs to another studio."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/developer/playtests">Back to playtests</Link>
          </Button>
        }
      />
    );
  }

  if (playtest.status !== "draft") {
    return (
      <EmptyState
        icon={Lock}
        title="Editing is locked"
        description="Only draft playtests can be edited. This protects applications, tester progress, and feedback once a playtest is live."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href={`/developer/playtests/${playtest.id}`}>Back to manage</Link>
          </Button>
        }
      />
    );
  }

  return <PlaytestForm initialPlaytest={playtest} />;
}