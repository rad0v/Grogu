/**
 * Mock authentication — public entry point.
 *
 * Frontend-only: there is NO auth provider, database, or token. A "session" is
 * a {@link Session} object held in the persisted client store. This file just
 * re-exports the mock auth service so the swap-in point is obvious: replace
 * `lib/services/auth.ts` with a real provider and keep this surface.
 */

export {
  login,
  loginAsDemo,
  signup,
  logout,
  getSession,
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
} from "@/lib/services/auth";
export type {
  LoginInput,
  SignupInput,
  TesterSignupInput,
  DeveloperSignupInput,
} from "@/lib/services/auth";
