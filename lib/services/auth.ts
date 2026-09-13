/**
 * Mock authentication service. Frontend-only — there is no auth provider.
 *
 * `login` / `signup` accept demo credentials, build a {@link Session}, and hand
 * it to the client store. A real provider replaces exactly these three
 * functions; nothing else in the app knows auth is fake.
 */

import type {
  DeveloperProfile,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
  Session,
  TesterProfile,
  User,
  UserRole,
} from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay, ServiceError } from "./http";

/** Any password is accepted for the prototype; this is the demo hint shown in the UI. */
export const DEMO_PASSWORD = "playtest";

export const DEMO_ACCOUNTS: Record<UserRole, { email: string; label: string }> = {
  tester: { email: "priya.nair@example.com", label: "Priya Nair · Tester" },
  developer: { email: "mara@driftwoodgames.dev", label: "Mara Okafor · Developer" },
};

function makeSession(user: User): Session {
  return { user, role: user.role, issuedAt: Date.now() };
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginInput): Promise<Session> {
  await delay();
  if (password.trim().length < 6) {
    throw new ServiceError("Password must be at least 6 characters.", "invalid-credentials");
  }
  const normalized = email.trim().toLowerCase();
  const user = useGroguStore
    .getState()
    .users.find((u) => u.email.toLowerCase() === normalized);

  if (!user) {
    throw new ServiceError(
      "No account matches that email. Try a demo account below.",
      "invalid-credentials",
    );
  }

  const session = makeSession(user);
  useGroguStore.getState().setSession(session);
  return session;
}

export async function loginAsDemo(role: UserRole): Promise<Session> {
  return login({ email: DEMO_ACCOUNTS[role].email, password: DEMO_PASSWORD });
}

export interface TesterSignupInput {
  role: "tester";
  name: string;
  email: string;
  password: string;
  location: string;
  experienceLevel: ExperienceLevel;
  preferredGenres: GameGenre[];
  platforms: GamePlatform[];
  weeklyAvailabilityHours: number;
}

export interface DeveloperSignupInput {
  role: "developer";
  name: string;
  email: string;
  password: string;
  location: string;
  studioName: string;
  studioSize: DeveloperProfile["studioSize"];
  website: string;
}

export type SignupInput = TesterSignupInput | DeveloperSignupInput;

export async function signup(input: SignupInput): Promise<Session> {
  await delay(700);
  const store = useGroguStore.getState();
  const normalized = input.email.trim().toLowerCase();

  if (store.users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new ServiceError("An account with that email already exists.", "conflict");
  }

  const handle = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 16) || "grogu";
  const id = `${input.role}-${handle}-${Math.random().toString(36).slice(2, 6)}`;

  const user: User = {
    id,
    role: input.role,
    name: input.name.trim(),
    handle,
    email: input.email.trim(),
    location: input.location.trim(),
    bio:
      input.role === "tester"
        ? "New Grogu playtester."
        : `${(input as DeveloperSignupInput).studioName} on Grogu.`,
    joinedAt: new Date().toISOString(),
  };

  if (input.role === "tester") {
    const profile: TesterProfile = {
      userId: id,
      experienceLevel: input.experienceLevel,
      preferredGenres: input.preferredGenres,
      platforms: input.platforms,
      languages: ["English"],
      weeklyAvailabilityHours: input.weeklyAvailabilityHours,
      reputation: 50,
      completedPlaytests: 0,
      averageFeedbackRating: 0,
      badges: ["New tester"],
    };
    useGroguStore.setState((s) => ({
      users: [user, ...s.users],
      testerProfiles: [profile, ...s.testerProfiles],
    }));
  } else {
    const profile: DeveloperProfile = {
      userId: id,
      studioName: input.studioName.trim(),
      studioSize: input.studioSize,
      website: input.website.trim(),
      foundedYear: new Date().getFullYear(),
      gamesPublished: 0,
      activePlaytests: 0,
    };
    useGroguStore.setState((s) => ({
      users: [user, ...s.users],
      developerProfiles: [profile, ...s.developerProfiles],
    }));
  }

  const session = makeSession(user);
  useGroguStore.getState().setSession(session);
  return session;
}

export async function logout(): Promise<void> {
  await delay(150);
  useGroguStore.getState().setSession(null);
}

/** Synchronous read of the current session (store is the source of truth). */
export function getSession(): Session | null {
  return useGroguStore.getState().session;
}
