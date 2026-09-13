/**
 * Mock service layer — the single seam between the UI and "the backend".
 *
 * Frontend-first: every function here reads/writes the persisted client store
 * (`lib/store/grogu-store`) after a small artificial delay. When the API lands,
 * replace the bodies with `fetch` calls (or move reads into TanStack Query);
 * the exported signatures and the calling components stay the same.
 */

export * as authService from "./auth";
export * as applicationsService from "./applications";
export * as testsService from "./tests";
export * as gamesService from "./games";
export * as playtestsService from "./playtests";
export * as notificationsService from "./notifications";
export { ServiceError } from "./http";
