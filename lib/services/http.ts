/**
 * Shared helpers for the mock service layer.
 *
 * Every function in `lib/services/*` is the seam between the UI and "the
 * backend". Today they read/write the client store (`lib/store/grogu-store`)
 * after a small artificial delay so the UI exercises real loading states.
 * Swap the bodies for `fetch` calls when the API exists — signatures stay.
 */

/** Simulate network latency. */
export function delay(ms = 450) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** A predictable error type the UI can branch on. */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | "not-found"
      | "invalid-credentials"
      | "conflict"
      | "forbidden"
      | "validation" = "validation",
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
