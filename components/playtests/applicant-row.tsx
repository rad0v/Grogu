"use client";

import { useState } from "react";
import { Check, Gauge, MonitorSmartphone, Star, X } from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import { EXPERIENCE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { Application, TesterProfile, User } from "@/lib/types";
import { applicationsService } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetaItem, MetaRow } from "@/components/ui/meta";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";

/**
 * One applicant awaiting a decision.
 *
 * A card rather than a table row: the developer needs the pitch, the hardware,
 * and the reputation together to decide, and that never fits a row on mobile
 * without horizontal scrolling.
 */
export function ApplicantRow({
  application,
  tester,
  profile,
  spotsLeft,
}: {
  application: Application;
  tester: User;
  profile?: TesterProfile;
  spotsLeft: number;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState<"accepted" | "rejected" | null>(null);
  const pending = application.status === "pending";

  async function decide(decision: "accepted" | "rejected") {
    setBusy(decision);
    try {
      await applicationsService.decideApplication(application.id, decision);
      toast({
        title:
          decision === "accepted"
            ? `${tester.name} accepted`
            : `${tester.name} was not selected`,
        description:
          decision === "accepted"
            ? "They can now download the build and start testing."
            : undefined,
        tone: decision === "accepted" ? "success" : "info",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="space-y-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={tester.name}
            src={tester.avatarUrl}
            className="size-11 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{tester.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              @{tester.handle} · {tester.location}
            </p>
            <p className="text-xs text-subtle-foreground">
              Applied {formatRelativeTime(application.submittedAt)}
            </p>
          </div>
        </div>

        {pending ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => decide("rejected")}
              loading={busy === "rejected"}
              disabled={busy !== null}
            >
              <X /> Reject
            </Button>
            <Button
              size="sm"
              onClick={() => decide("accepted")}
              loading={busy === "accepted"}
              disabled={busy !== null || spotsLeft <= 0}
            >
              <Check /> Accept
            </Button>
          </div>
        ) : (
          <StatusBadge kind="application" status={application.status} />
        )}
      </div>

      {profile && (
        <MetaRow className="gap-x-5">
          <MetaItem
            icon={Gauge}
            label="Experience"
            value={EXPERIENCE_LABELS[profile.experienceLevel]}
            tone="strong"
          />
          <MetaItem
            icon={MonitorSmartphone}
            label="Platforms"
            value={profile.platforms
              .slice(0, 3)
              .map((p) => PLATFORM_LABELS[p])
              .join(", ")}
          />
          <MetaItem
            icon={Star}
            label="Reputation"
            value={`${profile.reputation}/100 · ${profile.completedPlaytests} completed`}
          />
        </MetaRow>
      )}

      <blockquote className="rounded-lg border border-border bg-elevated p-3.5 text-sm leading-relaxed text-muted-foreground">
        “{application.message}”
      </blockquote>

      {profile && profile.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.badges.map((badge) => (
            <Badge key={badge} tone="muted">
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {pending && spotsLeft <= 0 && (
        <p className="text-xs text-warning" role="status">
          All tester slots are full — reject someone or raise the tester limit to
          accept more.
        </p>
      )}
    </article>
  );
}
