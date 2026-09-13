/** Mock applications service — see `lib/services/http.ts` for the pattern. */

import type { Application, ApplicationInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay, ServiceError } from "./http";

export async function applyToPlaytest(
  playtestId: string,
  input: ApplicationInput,
): Promise<Application> {
  await delay(700);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "tester") {
    throw new ServiceError("Sign in as a tester to apply.", "forbidden");
  }
  const existing = store.applications.find(
    (a) =>
      a.playtestId === playtestId &&
      a.testerId === store.session!.user.id &&
      a.status !== "withdrawn",
  );
  if (existing) {
    throw new ServiceError("You've already applied to this playtest.", "conflict");
  }
  return store.applyToPlaytest(playtestId, input);
}

export async function withdrawApplication(applicationId: string): Promise<void> {
  await delay();
  useGroguStore.getState().withdrawApplication(applicationId);
}

export async function decideApplication(
  applicationId: string,
  decision: "accepted" | "rejected",
  note?: string,
): Promise<void> {
  await delay(500);
  useGroguStore.getState().decideApplication(applicationId, decision, note);
}
