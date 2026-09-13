"use client";

import { Check, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { TASK_TYPE_LABELS } from "@/lib/constants";
import type { PlaytestTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Playtest task list. Read-only on the details page; pass `completedIds` +
 * `onToggle` for the interactive workspace checklist.
 */
export function TaskList({
  tasks,
  completedIds,
  onToggle,
  pendingId,
}: {
  tasks: PlaytestTask[];
  completedIds?: string[];
  onToggle?: (taskId: string) => void;
  pendingId?: string | null;
}) {
  const interactive = typeof onToggle === "function";

  return (
    <ol className="space-y-2.5">
      {tasks.map((task, index) => {
        const done = completedIds?.includes(task.id) ?? false;
        return (
          <li
            key={task.id}
            className={cn(
              "flex gap-3.5 rounded-lg border p-4 transition-colors duration-[180ms]",
              done
                ? "border-success/35 bg-success/6"
                : "border-border bg-surface",
              interactive && !done && "hover:border-border-strong",
            )}
          >
            {interactive ? (
              <Checkbox
                className="mt-0.5 size-4.5"
                checked={done}
                disabled={pendingId === task.id}
                onCheckedChange={() => onToggle?.(task.id)}
                aria-label={`Mark "${task.title}" ${done ? "incomplete" : "complete"}`}
              />
            ) : (
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold tabular-nums",
                  done
                    ? "border-success bg-success text-success-foreground"
                    : "border-border-strong text-subtle-foreground",
                )}
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
            )}

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    done && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </p>
                <Badge tone="muted">{TASK_TYPE_LABELS[task.type]}</Badge>
                {task.required ? (
                  <Badge tone="outline">Required</Badge>
                ) : (
                  <Badge tone="muted">Optional</Badge>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-subtle-foreground">
                <Clock className="size-3" aria-hidden />~{task.estimatedMinutes} min
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
