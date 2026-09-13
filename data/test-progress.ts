import type { TestProgress } from "@/lib/types";

/**
 * Mock workspace progress for accepted testers. Seeded for the demo tester
 * (`tester-1`); the store creates/updates entries as the workspace flow runs.
 */
export const testProgress: TestProgress[] = [
  {
    id: "tp-1",
    playtestId: "pt-1",
    testerId: "tester-1",
    stage: "in-progress",
    completedTaskIds: ["pt-1-t1"],
    buildDownloaded: true,
    startedAt: "2026-09-05T14:00:00Z",
    completedAt: null,
    feedbackId: null,
  },
  {
    id: "tp-2",
    playtestId: "pt-2",
    testerId: "tester-1",
    stage: "feedback-submitted",
    completedTaskIds: ["pt-2-t1", "pt-2-t2"],
    buildDownloaded: true,
    startedAt: "2026-08-22T10:00:00Z",
    completedAt: null,
    feedbackId: "fb-9",
  },
  {
    id: "tp-3",
    playtestId: "pt-6",
    testerId: "tester-1",
    stage: "completed",
    completedTaskIds: ["pt-6-t1", "pt-6-t2"],
    buildDownloaded: true,
    startedAt: "2026-07-23T09:00:00Z",
    completedAt: "2026-08-01T16:30:00Z",
    feedbackId: "fb-3",
  },
];
