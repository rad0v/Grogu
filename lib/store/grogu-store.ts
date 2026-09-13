"use client";

/**
 * Grogu client store — the mock "database" for the frontend prototype.
 *
 * This is the single source of mutable truth while there is no backend. It is
 * seeded from `data/` and persisted to localStorage so demo flows survive
 * navigation and refresh.
 *
 * Backend integration later: keep the selector hooks and the `lib/services/*`
 * signatures; replace the service bodies (and this store's actions) with API
 * calls, or move server state into TanStack Query. UI components never import
 * this file directly — they go through `lib/hooks/*` and `lib/services/*`.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  Application,
  ApplicationInput,
  DeveloperProfile,
  Feedback,
  FeedbackInput,
  Game,
  NewGameInput,
  NewPlaytestInput,
  Notification,
  Playtest,
  PlaytestStatus,
  UpdateGameInput,
  UpdatePlaytestInput,
  Session,
  TestProgress,
  TesterProfile,
  User,
} from "@/lib/types";

import { applications as seedApplications } from "@/data/applications";
import { feedback as seedFeedback } from "@/data/feedback";
import { games as seedGames } from "@/data/games";
import { notifications as seedNotifications } from "@/data/notifications";
import { playtests as seedPlaytests } from "@/data/playtests";
import { testProgress as seedTestProgress } from "@/data/test-progress";
import {
  developerProfiles as seedDeveloperProfiles,
  testerProfiles as seedTesterProfiles,
  users as seedUsers,
} from "@/data/users";
import { canTransitionPlaytestStatus } from "@/lib/domain";

const now = () => new Date().toISOString();

function newId(prefix: string) {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

function clone<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
}

interface SeedCollections {
  users: User[];
  testerProfiles: TesterProfile[];
  developerProfiles: DeveloperProfile[];
  games: Game[];
  playtests: Playtest[];
  applications: Application[];
  feedback: Feedback[];
  notifications: Notification[];
  testProgress: TestProgress[];
}

function freshSeed(): SeedCollections {
  const seed = clone({
    users: seedUsers,
    testerProfiles: seedTesterProfiles,
    developerProfiles: seedDeveloperProfiles,
    games: seedGames,
    playtests: seedPlaytests,
    applications: seedApplications,
    feedback: seedFeedback,
    notifications: seedNotifications,
    testProgress: seedTestProgress,
  });
  // Keep the denormalised playtest counters honest against the seed applications.
  seed.playtests = seed.playtests.map((p) =>
    withPlaytestCounts(p, seed.applications),
  );
  return seed;
}

/** Recompute the denormalised counters kept on a playtest. */
function withPlaytestCounts(playtest: Playtest, applications: Application[]): Playtest {
  const mine = applications.filter((a) => a.playtestId === playtest.id);
  return {
    ...playtest,
    applicantCount: mine.filter((a) => a.status !== "withdrawn").length,
    acceptedTesters: mine.filter((a) => a.status === "accepted").length,
  };
}

export interface GroguState extends SeedCollections {
  session: Session | null;

  /* session */
  setSession: (session: Session | null) => void;

  /* tester */
  applyToPlaytest: (playtestId: string, input: ApplicationInput) => Application;
  withdrawApplication: (applicationId: string) => void;
  setBuildDownloaded: (playtestId: string, testerId: string) => void;
  toggleTask: (playtestId: string, testerId: string, taskId: string) => void;
  submitFeedback: (
    playtestId: string,
    testerId: string,
    input: FeedbackInput,
  ) => Feedback;

  /* developer */
  decideApplication: (
    applicationId: string,
    decision: "accepted" | "rejected",
    note?: string,
  ) => void;
  createGame: (developerId: string, input: NewGameInput) => Game;
  updateGame: (
    developerId: string,
    gameId: string,
    input: UpdateGameInput,
  ) => Game;
  createPlaytest: (developerId: string, input: NewPlaytestInput) => Playtest;
  updatePlaytest: (
    developerId: string,
    playtestId: string,
    input: UpdatePlaytestInput,
  ) => Playtest;
  setPlaytestStatus: (playtestId: string, status: PlaytestStatus) => void;

  /* notifications */
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;

  /* demo */
  resetDemo: () => void;
}

export const useGroguStore = create<GroguState>()(
  persist(
    (set, get) => ({
      ...freshSeed(),
      session: null,

      setSession: (session) => set({ session }),

      applyToPlaytest: (playtestId, input) => {
        const session = get().session;
        if (!session) throw new Error("Not signed in");
        const application: Application = {
          id: newId("app"),
          playtestId,
          testerId: session.user.id,
          status: "pending",
          message: input.message,
          submittedAt: now(),
          decidedAt: null,
          decisionNote: null,
        };
        set((state) => {
          const applications = [application, ...state.applications];
          const playtest = state.playtests.find((p) => p.id === playtestId);
          const dev = playtest?.developerId;
          const notification: Notification | null =
            playtest && dev
              ? {
                  id: newId("notif"),
                  userId: dev,
                  type: "application-received",
                  title: `New applicant for ${playtest.title}`,
                  body: `${session.user.name} applied to your playtest.`,
                  href: `/developer/playtests/${playtestId}`,
                  read: false,
                  createdAt: now(),
                }
              : null;
          return {
            applications,
            playtests: state.playtests.map((p) =>
              p.id === playtestId ? withPlaytestCounts(p, applications) : p,
            ),
            notifications: notification
              ? [notification, ...state.notifications]
              : state.notifications,
          };
        });
        return application;
      },

      withdrawApplication: (applicationId) =>
        set((state) => {
          const applications = state.applications.map((a) =>
            a.id === applicationId
              ? { ...a, status: "withdrawn" as const, decidedAt: now() }
              : a,
          );
          const target = applications.find((a) => a.id === applicationId);
          return {
            applications,
            playtests: state.playtests.map((p) =>
              p.id === target?.playtestId
                ? withPlaytestCounts(p, applications)
                : p,
            ),
          };
        }),

      setBuildDownloaded: (playtestId, testerId) =>
        set((state) => ({
          testProgress: upsertProgress(
            state.testProgress,
            playtestId,
            testerId,
            (p) => ({
              ...p,
              buildDownloaded: true,
              stage: p.stage === "not-started" ? "in-progress" : p.stage,
              startedAt: p.startedAt ?? now(),
            }),
          ),
        })),

      toggleTask: (playtestId, testerId, taskId) =>
        set((state) => {
          const playtest = state.playtests.find((p) => p.id === playtestId);
          const requiredIds = new Set(
            (playtest?.tasks ?? []).filter((t) => t.required).map((t) => t.id),
          );
          return {
            testProgress: upsertProgress(
              state.testProgress,
              playtestId,
              testerId,
              (p) => {
                const has = p.completedTaskIds.includes(taskId);
                const completedTaskIds = has
                  ? p.completedTaskIds.filter((id) => id !== taskId)
                  : [...p.completedTaskIds, taskId];
                const allRequiredDone = [...requiredIds].every((id) =>
                  completedTaskIds.includes(id),
                );
                let stage = p.stage;
                if (p.stage === "not-started" || p.stage === "in-progress") {
                  stage = allRequiredDone ? "tasks-complete" : "in-progress";
                } else if (p.stage === "tasks-complete" && !allRequiredDone) {
                  stage = "in-progress";
                }
                return {
                  ...p,
                  completedTaskIds,
                  stage,
                  startedAt: p.startedAt ?? now(),
                };
              },
            ),
          };
        }),

      submitFeedback: (playtestId, testerId, input) => {
        const feedbackEntry: Feedback = {
          id: newId("fb"),
          playtestId,
          testerId,
          submittedAt: now(),
          ...input,
        };
        set((state) => {
          const playtest = state.playtests.find((p) => p.id === playtestId);
          const devNotification: Notification | null =
            playtest != null
              ? {
                  id: newId("notif"),
                  userId: playtest.developerId,
                  type: "feedback-received",
                  title: `New feedback for ${playtest.title}`,
                  body: `A tester submitted feedback (${input.hoursPlayed}h played).`,
                  href: `/developer/playtests/${playtestId}`,
                  read: false,
                  createdAt: now(),
                }
              : null;
          return {
            feedback: [feedbackEntry, ...state.feedback],
            testProgress: upsertProgress(
              state.testProgress,
              playtestId,
              testerId,
              (p) => ({
                ...p,
                stage: "completed",
                feedbackId: feedbackEntry.id,
                completedAt: now(),
                startedAt: p.startedAt ?? now(),
              }),
            ),
            notifications: devNotification
              ? [devNotification, ...state.notifications]
              : state.notifications,
          };
        });
        return feedbackEntry;
      },

      decideApplication: (applicationId, decision, note) =>
        set((state) => {
          const applications = state.applications.map((a) =>
            a.id === applicationId
              ? {
                  ...a,
                  status: decision,
                  decidedAt: now(),
                  decisionNote: note ?? a.decisionNote,
                }
              : a,
          );
          const target = applications.find((a) => a.id === applicationId);
          const playtest = state.playtests.find(
            (p) => p.id === target?.playtestId,
          );
          let testProgress = state.testProgress;
          if (decision === "accepted" && target && playtest) {
            testProgress = upsertProgress(
              testProgress,
              target.playtestId,
              target.testerId,
              (p) => p,
            );
          }
          const notification: Notification | null =
            target && playtest
              ? {
                  id: newId("notif"),
                  userId: target.testerId,
                  type:
                    decision === "accepted"
                      ? "application-accepted"
                      : "application-rejected",
                  title:
                    decision === "accepted"
                      ? `You're in: ${playtest.title}`
                      : `Update on ${playtest.title}`,
                  body:
                    decision === "accepted"
                      ? "Your application was accepted. Open the test workspace to get started."
                      : note ||
                        "Your application wasn't selected this time. Keep an eye on Discover for more playtests.",
                  href:
                    decision === "accepted"
                      ? `/tests/${target.playtestId}`
                      : "/discover",
                  read: false,
                  createdAt: now(),
                }
              : null;
          return {
            applications,
            testProgress,
            playtests: state.playtests.map((p) =>
              p.id === target?.playtestId
                ? withPlaytestCounts(p, applications)
                : p,
            ),
            notifications: notification
              ? [notification, ...state.notifications]
              : state.notifications,
          };
        }),

      createGame: (developerId, input) => {
        const game: Game = {
          id: newId("game"),
          developerId,
          ...input,
          updatedAt: now(),
        };
        set((state) => ({ games: [game, ...state.games] }));
        return game;
      },

      updateGame: (developerId, gameId, input) => {
        const existing = get().games.find(
          (game) => game.id === gameId && game.developerId === developerId,
        );
        if (!existing) throw new Error("Game not found");
        const updated = { ...existing, ...input, updatedAt: now() };
        set((state) => ({
          games: state.games.map((game) =>
            game.id === gameId ? updated : game,
          ),
        }));
        return updated;
      },

      createPlaytest: (developerId, input) => {
        const playtest: Playtest = {
          id: newId("pt"),
          gameId: input.gameId,
          developerId,
          title: input.title,
          summary: input.summary,
          goals: input.goals,
          focusAreas: input.focusAreas,
          status: input.publish ? "recruiting" : "draft",
          requirements: input.requirements,
          tasks: input.tasks.map((t, i) => ({ ...t, id: `${newId("task")}-${i}` })),
          reward: input.reward,
          maxTesters: input.maxTesters,
          acceptedTesters: 0,
          applicantCount: 0,
          buildUrl: "https://builds.grogu.example.com/preview",
          opensAt: now(),
          closesAt: input.closesAt,
          createdAt: now(),
        };
        set((state) => {
          const notification: Notification | null = input.publish
            ? {
                id: newId("notif"),
                userId: developerId,
                type: "playtest-published",
                title: `${playtest.title} is live`,
                body: "Your playtest is now visible on Discover and open for applications.",
                href: `/developer/playtests/${playtest.id}`,
                read: false,
                createdAt: now(),
              }
            : null;
          return {
            playtests: [playtest, ...state.playtests],
            notifications: notification
              ? [notification, ...state.notifications]
              : state.notifications,
          };
        });
        return playtest;
      },

      updatePlaytest: (developerId, playtestId, input) => {
        const existing = get().playtests.find(
          (playtest) =>
            playtest.id === playtestId && playtest.developerId === developerId,
        );
        if (!existing) throw new Error("Playtest not found");
        if (existing.status !== "draft") {
          throw new Error("Only draft playtests can be edited");
        }
        const existingTaskIds = new Set(existing.tasks.map((task) => task.id));
        const tasks = input.tasks.map((task, index) => ({
          ...task,
          id:
            task.id && existingTaskIds.has(task.id)
              ? task.id
              : `${newId("task")}-${index}`,
        }));
        const updated: Playtest = {
          ...existing,
          ...input,
          status: "draft",
          tasks,
        };
        set((state) => ({
          playtests: state.playtests.map((playtest) =>
            playtest.id === playtestId ? updated : playtest,
          ),
        }));
        return updated;
      },

      setPlaytestStatus: (playtestId, status) =>
        set((state) => {
          const existing = state.playtests.find((p) => p.id === playtestId);
          if (!existing || !canTransitionPlaytestStatus(existing.status, status)) {
            return state;
          }
          return {
            playtests: state.playtests.map((p) =>
              p.id === playtestId ? { ...p, status } : p,
            ),
          };
        }),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllNotificationsRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n,
          ),
        })),

      resetDemo: () => set({ ...freshSeed(), session: null }),
    }),
    {
      name: "grogu-store-v1",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState, version) => {
        if (version >= 2) return persistedState;

        const state = persistedState as Partial<GroguState>;
        const seedById = new Map(seedPlaytests.map((playtest) => [playtest.id, playtest]));

        return {
          ...state,
          playtests: state.playtests?.map((playtest) => {
            const seed = seedById.get(playtest.id);
            const legacyReward = playtest.reward.includes("$");
            const missingCashAmount = playtest.cashReward == null && seed?.cashReward != null;

            return legacyReward || missingCashAmount
              ? {
                  ...playtest,
                  reward: seed?.reward ?? playtest.reward,
                  cashReward: seed?.cashReward ?? playtest.cashReward,
                }
              : playtest;
          }),
        };
      },
      partialize: (state) => ({
        session: state.session,
        users: state.users,
        testerProfiles: state.testerProfiles,
        developerProfiles: state.developerProfiles,
        games: state.games,
        playtests: state.playtests,
        applications: state.applications,
        feedback: state.feedback,
        notifications: state.notifications,
        testProgress: state.testProgress,
      }),
    },
  ),
);

/** Create-or-update a tester's progress row for a playtest. */
function upsertProgress(
  list: TestProgress[],
  playtestId: string,
  testerId: string,
  update: (p: TestProgress) => TestProgress,
): TestProgress[] {
  const existing = list.find(
    (p) => p.playtestId === playtestId && p.testerId === testerId,
  );
  if (existing) {
    return list.map((p) => (p === existing ? update(p) : p));
  }
  const base: TestProgress = {
    id: newId("tp"),
    playtestId,
    testerId,
    stage: "not-started",
    completedTaskIds: [],
    buildDownloaded: false,
    startedAt: null,
    completedAt: null,
    feedbackId: null,
  };
  return [update(base), ...list];
}
