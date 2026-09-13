/** Mock playtest-workspace service (tester side). */

import type { Feedback, FeedbackInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay } from "./http";

export async function downloadBuild(
  playtestId: string,
  testerId: string,
): Promise<void> {
  await delay(900);
  useGroguStore.getState().setBuildDownloaded(playtestId, testerId);
}

export async function toggleTask(
  playtestId: string,
  testerId: string,
  taskId: string,
): Promise<void> {
  await delay(200);
  useGroguStore.getState().toggleTask(playtestId, testerId, taskId);
}

export async function submitFeedback(
  playtestId: string,
  testerId: string,
  input: FeedbackInput,
): Promise<Feedback> {
  await delay(800);
  return useGroguStore.getState().submitFeedback(playtestId, testerId, input);
}
