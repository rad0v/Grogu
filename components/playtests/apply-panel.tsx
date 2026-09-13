"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LogIn, Lock } from "lucide-react";

import { formatDeadline } from "@/lib/utils";
import { isClosingSoon, playtestCapacity } from "@/lib/domain";
import { APPLICATION_STATUS_META } from "@/lib/constants";
import type { Application, PlaytestWithRelations } from "@/lib/types";
import { useSession } from "@/lib/hooks/use-session";
import { useTesterApplication } from "@/lib/hooks/use-grogu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ApplyDialog } from "@/components/playtests/apply-dialog";

/**
 * The right-rail call to action on the playtest detail page.
 *
 * Every branch ends in exactly one obvious next step — apply, sign in, open the
 * workspace, or an explanation of why none of those are available.
 */
export function ApplyPanel({ playtest }: { playtest: PlaytestWithRelations }) {
  const { session, isAuthenticated } = useSession();
  const application = useTesterApplication(session?.user.id, playtest.id);
  const [open, setOpen] = useState(false);

  const { spotsLeft, filledRatio, isFull } = playtestCapacity(playtest);
  const isOpen = playtest.status === "recruiting";
  const closingSoon = isClosingSoon(playtest.closesAt);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-elevated shadow-md">
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-base font-semibold">
            {isOpen ? "Applications open" : "Not recruiting"}
          </p>
          {isOpen && closingSoon && !isFull && (
            <Badge tone="warning">Closing soon</Badge>
          )}
        </div>

        {/* Roster fill — the single most decision-relevant number here. */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-foreground">
              {playtest.acceptedTesters}
              <span className="text-muted-foreground">
                /{playtest.maxTesters} testers
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              {isFull ? "Roster full" : `${spotsLeft} left`}
            </span>
          </div>
          <Progress
            value={filledRatio * 100}
            aria-label="Tester slots filled"
            indicatorClassName={isFull ? "bg-warning" : undefined}
          />
          <p className="text-xs text-muted-foreground">
            {formatDeadline(playtest.closesAt)}
          </p>
        </div>

        <PanelAction
          playtest={playtest}
          application={application}
          isAuthenticated={isAuthenticated}
          role={session?.role ?? null}
          isOpen={isOpen}
          spotsLeft={spotsLeft}
          onApply={() => setOpen(true)}
        />
      </div>

      <ApplyDialog playtest={playtest} open={open} onOpenChange={setOpen} />
    </div>
  );
}

/** A short status note rendered in the panel's action slot. */
function PanelNote({
  icon: Icon,
  children,
}: {
  icon: typeof Lock;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3 text-sm text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

function PanelAction({
  playtest,
  application,
  isAuthenticated,
  role,
  isOpen,
  spotsLeft,
  onApply,
}: {
  playtest: PlaytestWithRelations;
  application: Application | undefined;
  isAuthenticated: boolean;
  role: "tester" | "developer" | null;
  isOpen: boolean;
  spotsLeft: number;
  onApply: () => void;
}) {
  if (application && application.status !== "withdrawn") {
    const meta = APPLICATION_STATUS_META[application.status];
    const accepted = application.status === "accepted";

    return (
      <div className="space-y-3">
        <div
          className={`flex items-start gap-2.5 rounded-lg border p-3 text-sm ${
            accepted
              ? "border-success/30 bg-success/10"
              : "border-border bg-surface"
          }`}
        >
          {accepted && (
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-success"
              aria-hidden
            />
          )}
          <span className="text-muted-foreground">
            {accepted ? (
              <>
                <span className="font-medium text-foreground">You&apos;re in!</span>{" "}
                Your playtest workspace is ready.
              </>
            ) : (
              <>
                You applied to this playtest —{" "}
                <span className="font-medium text-foreground">{meta.label}</span>.
              </>
            )}
          </span>
        </div>

        <Button asChild variant={accepted ? "primary" : "secondary"} className="w-full">
          <Link href={accepted ? `/tests/${playtest.id}` : "/applications"}>
            {accepted ? "Open test workspace" : "View application"}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <PanelNote icon={Lock}>
        This playtest isn&apos;t accepting new applications.
      </PanelNote>
    );
  }

  if (spotsLeft === 0) {
    return (
      <div className="space-y-3">
        <PanelNote icon={Lock}>
          This playtest is currently full — every tester slot is taken.
        </PanelNote>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/discover">Find another playtest</Link>
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <Button asChild size="lg" className="w-full">
          <Link href={`/login?next=/playtests/${playtest.id}`}>
            <LogIn />
            Sign in to apply
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          New to Grogu?{" "}
          <Link href="/signup" className="text-secondary hover:underline">
            Create a tester account
          </Link>
        </p>
      </div>
    );
  }

  if (role === "developer") {
    return (
      <PanelNote icon={Lock}>
        You&apos;re signed in as a developer. Switch to a tester account to apply.
      </PanelNote>
    );
  }

  return (
    <div className="space-y-2.5">
      <Button size="lg" className="w-full" onClick={onApply}>
        Apply for playtest
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Takes about a minute · ~{playtest.requirements.estimatedHours}h of testing
      </p>
    </div>
  );
}
