import { formatRelativeTime } from "@/lib/utils";
import { testCompletion } from "@/lib/domain";
import { TEST_STAGE_META } from "@/lib/constants";
import type { Application, Playtest, TestProgress, User } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/avatar";

/** An accepted tester's progress, shown on the developer's "Testers" tab. */
export function TesterCard({
  tester,
  application,
  progress,
  playtest,
}: {
  tester: User;
  application: Application;
  progress: TestProgress | null;
  playtest: Playtest;
}) {
  const stage = progress?.stage ?? "not-started";
  const meta = TEST_STAGE_META[stage];
  const completion = testCompletion(progress, playtest);
  const done = stage === "completed";

  return (
    <article className="space-y-3.5 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={tester.name}
            src={tester.avatarUrl}
            className="size-9 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{tester.name}</p>
            <p className="truncate text-xs text-subtle-foreground">
              Accepted{" "}
              {application.decidedAt
                ? formatRelativeTime(application.decidedAt)
                : "recently"}
            </p>
          </div>
        </div>
        <StatusBadge kind="test" status={stage} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completion.done}/{completion.total} required tasks
          </span>
          <span>{meta.label}</span>
        </div>
        <Progress
          value={done ? 100 : meta.progress}
          aria-label={`${tester.name}: ${meta.label}`}
          indicatorClassName={done ? "bg-success" : undefined}
        />
      </div>
    </article>
  );
}
