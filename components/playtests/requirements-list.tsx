import {
  CalendarClock,
  Clock,
  Gauge,
  Gift,
  Globe,
  MonitorSmartphone,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatDate } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";
import type { Playtest, TesterRequirements } from "@/lib/types";

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden />
      <div className="min-w-0">
        <dt className="text-label text-subtle-foreground">{label}</dt>
        <dd className="mt-1 text-sm text-foreground">{value}</dd>
      </div>
    </div>
  );
}

/**
 * What a developer expects from applicants. A two-column grid of small tiles
 * rather than a long divided list — testers scan this to decide whether they
 * qualify, so every requirement needs to be findable at a glance.
 */
export function RequirementsList({
  requirements,
  playtest,
}: {
  requirements: TesterRequirements;
  playtest: Playtest;
}) {
  return (
    <dl className="grid gap-2.5 sm:grid-cols-2">
      <Row icon={Gift} label="Reward" value={playtest.reward} />
      <Row
        icon={Gauge}
        label="Experience"
        value={`${EXPERIENCE_LABELS[requirements.minExperienceLevel]} or above`}
      />
      <Row
        icon={MonitorSmartphone}
        label="Platforms"
        value={requirements.platforms.map((p) => PLATFORM_LABELS[p]).join(", ")}
      />
      {requirements.preferredGenres.length > 0 && (
        <Row
          icon={Star}
          label="Genre familiarity"
          value={requirements.preferredGenres.map((g) => GENRE_LABELS[g]).join(", ")}
        />
      )}
      <Row
        icon={Globe}
        label="Languages"
        value={requirements.languages.join(", ")}
      />
      <Row
        icon={Star}
        label="Minimum reputation"
        value={`${requirements.minReputation} / 100`}
      />
      <Row
        icon={Clock}
        label="Estimated time"
        value={`~${requirements.estimatedHours} hours total`}
      />
      <Row
        icon={CalendarClock}
        label="Applications close"
        value={formatDate(playtest.closesAt)}
      />
      <Row
        icon={ShieldCheck}
        label="NDA"
        value={requirements.ndaRequired ? "Required before access" : "Not required"}
      />
    </dl>
  );
}
