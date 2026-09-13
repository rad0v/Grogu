/** Mock playtests service (developer side). */

import type {
  NewPlaytestInput,
  Playtest,
  PlaytestStatus,
  UpdatePlaytestInput,
} from "@/lib/types";
import { canTransitionPlaytestStatus } from "@/lib/domain";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay, ServiceError } from "./http";

export async function createPlaytest(
  input: NewPlaytestInput,
): Promise<Playtest> {
  await delay(900);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError(
      "Sign in as a developer to create a playtest.",
      "forbidden",
    );
  }
  if (
    !store.games.some(
      (game) =>
        game.id === input.gameId && game.developerId === store.session?.user.id,
    )
  ) {
    throw new ServiceError("Pick a game for this playtest.", "validation");
  }
  return store.createPlaytest(store.session.user.id, input);
}

export async function setPlaytestStatus(
  playtestId: string,
  status: PlaytestStatus,
): Promise<void> {
  await delay(400);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError("Sign in as a developer to manage playtests.", "forbidden");
  }
  const playtest = store.playtests.find(
    (candidate) => candidate.id === playtestId,
  );
  if (!playtest || playtest.developerId !== store.session.user.id) {
    throw new ServiceError("Playtest not found.", "not-found");
  }
  if (!canTransitionPlaytestStatus(playtest.status, status)) {
    throw new ServiceError(
      `A ${playtest.status} playtest cannot move to ${status}.`,
      "conflict",
    );
  }
  store.setPlaytestStatus(playtestId, status);
}

export async function updatePlaytest(
  playtestId: string,
  input: UpdatePlaytestInput,
): Promise<Playtest> {
  await delay(900);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError("Sign in as a developer to edit a playtest.", "forbidden");
  }
  const playtest = store.playtests.find(
    (candidate) => candidate.id === playtestId,
  );
  if (!playtest || playtest.developerId !== store.session.user.id) {
    throw new ServiceError("Playtest not found.", "not-found");
  }
  if (playtest.status !== "draft") {
    throw new ServiceError("Only draft playtests can be edited.", "conflict");
  }
  if (
    !store.games.some(
      (game) =>
        game.id === input.gameId && game.developerId === store.session?.user.id,
    )
  ) {
    throw new ServiceError("Pick one of your games.", "validation");
  }
  return store.updatePlaytest(store.session.user.id, playtestId, input);
}
