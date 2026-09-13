import {
  APPLICATION_STATUS_META,
  GAME_STATUS_LABELS,
  PLAYTEST_STATUS_META,
  TEST_STAGE_META,
} from "@/lib/constants";
import type {
  ApplicationStatus,
  GameStatus,
  PlaytestStatus,
  TestStage,
} from "@/lib/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const GAME_STATUS_TONE: Record<GameStatus, "muted" | "info" | "success"> = {
  "in-development": "muted",
  alpha: "info",
  beta: "info",
  released: "success",
};

/** Statuses that describe something happening right now get a live dot. */
const LIVE_PLAYTEST_STATUSES: PlaytestStatus[] = ["recruiting", "in-progress"];

type StatusBadgeProps = {
  /** Rendered on top of artwork — swaps to the translucent overlay tone. */
  overlay?: boolean;
  size?: BadgeProps["size"];
} & (
  | { kind: "playtest"; status: PlaytestStatus }
  | { kind: "application"; status: ApplicationStatus }
  | { kind: "test"; status: TestStage }
  | { kind: "game"; status: GameStatus }
);

/** One badge component for every domain status, so tone/label stay consistent. */
export function StatusBadge({ overlay, size, ...props }: StatusBadgeProps) {
  const shared = { size, className: overlay ? "border-white/10" : undefined };

  if (props.kind === "playtest") {
    const meta = PLAYTEST_STATUS_META[props.status];
    return (
      <Badge
        tone={overlay ? "overlay" : meta.tone}
        dot={LIVE_PLAYTEST_STATUSES.includes(props.status)}
        {...shared}
      >
        {meta.label}
      </Badge>
    );
  }

  if (props.kind === "application") {
    const meta = APPLICATION_STATUS_META[props.status];
    return (
      <Badge tone={overlay ? "overlay" : meta.tone} {...shared}>
        {meta.label}
      </Badge>
    );
  }

  if (props.kind === "test") {
    const meta = TEST_STAGE_META[props.status];
    return (
      <Badge
        tone={overlay ? "overlay" : meta.tone}
        dot={props.status === "in-progress"}
        {...shared}
      >
        {meta.label}
      </Badge>
    );
  }

  return (
    <Badge tone={overlay ? "overlay" : GAME_STATUS_TONE[props.status]} {...shared}>
      {GAME_STATUS_LABELS[props.status]}
    </Badge>
  );
}
