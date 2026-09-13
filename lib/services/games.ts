/** Mock games service (developer side). */

import type { Game, NewGameInput, UpdateGameInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay, ServiceError } from "./http";

export async function createGame(input: NewGameInput): Promise<Game> {
  await delay(800);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError("Sign in as a developer to add a game.", "forbidden");
  }
  return store.createGame(store.session.user.id, input);
}

export async function updateGame(
  gameId: string,
  input: UpdateGameInput,
): Promise<Game> {
  await delay(800);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError("Sign in as a developer to edit a game.", "forbidden");
  }
  if (
    !store.games.some(
      (game) => game.id === gameId && game.developerId === store.session?.user.id,
    )
  ) {
    throw new ServiceError("Game not found.", "not-found");
  }
  return store.updateGame(store.session.user.id, gameId, input);
}
