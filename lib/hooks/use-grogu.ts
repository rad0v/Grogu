"use client";

/**
 * Reactive selector hooks over the client store. Components use these for reads;
 * mutations go through `lib/services/*`. Each hook selects stable raw arrays and
 * derives with `useMemo`, so no `useShallow` gymnastics are needed.
 */

import { useMemo } from "react";

import type {
  Application,
  DeveloperProfile,
  Feedback,
  Game,
  Notification,
  PlaytestWithRelations,
  TestProgress,
  TesterProfile,
  User,
} from "@/lib/types";
import {
  buildTesterTests,
  computeAnalytics,
  type DiscoverFilters,
  joinPlaytest,
  joinPlaytests,
  matchesDiscoverFilters,
} from "@/lib/domain";
import { useGroguStore } from "@/lib/store/grogu-store";

export function useGames(): Game[] {
  return useGroguStore((s) => s.games);
}

export function useGame(id: string | undefined): Game | undefined {
  const games = useGames();
  return useMemo(() => games.find((g) => g.id === id), [games, id]);
}

export function useDeveloperGames(developerId: string | undefined): Game[] {
  const games = useGames();
  return useMemo(
    () =>
      games
        .filter((g) => g.developerId === developerId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [games, developerId],
  );
}

export function usePlaytests(): PlaytestWithRelations[] {
  const playtests = useGroguStore((s) => s.playtests);
  const games = useGroguStore((s) => s.games);
  const users = useGroguStore((s) => s.users);
  return useMemo(
    () => joinPlaytests(playtests, games, users),
    [playtests, games, users],
  );
}

export function usePlaytest(
  id: string | undefined,
): PlaytestWithRelations | undefined {
  const playtests = useGroguStore((s) => s.playtests);
  const games = useGroguStore((s) => s.games);
  const users = useGroguStore((s) => s.users);
  return useMemo(() => {
    const match = playtests.find((p) => p.id === id);
    return match ? joinPlaytest(match, games, users) : undefined;
  }, [playtests, games, users, id]);
}

export function useDiscoverPlaytests(
  filters: DiscoverFilters,
): PlaytestWithRelations[] {
  const all = usePlaytests();
  return useMemo(
    () =>
      all
        .filter((p) => p.status === "recruiting")
        .filter((p) => matchesDiscoverFilters(p, filters))
        .sort((a, b) => a.closesAt.localeCompare(b.closesAt)),
    [all, filters],
  );
}

export function useDeveloperPlaytests(
  developerId: string | undefined,
): PlaytestWithRelations[] {
  const all = usePlaytests();
  return useMemo(
    () =>
      all
        .filter((p) => p.developerId === developerId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [all, developerId],
  );
}

export function useApplicationsByTester(
  testerId: string | undefined,
): Application[] {
  const applications = useGroguStore((s) => s.applications);
  return useMemo(
    () =>
      applications
        .filter((a) => a.testerId === testerId)
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [applications, testerId],
  );
}

export function useApplicationsForPlaytest(playtestId: string | undefined): Application[] {
  const applications = useGroguStore((s) => s.applications);
  return useMemo(
    () => applications.filter((a) => a.playtestId === playtestId),
    [applications, playtestId],
  );
}

export function useTesterApplication(
  testerId: string | undefined,
  playtestId: string | undefined,
): Application | undefined {
  const applications = useGroguStore((s) => s.applications);
  return useMemo(
    () =>
      applications.find(
        (a) => a.testerId === testerId && a.playtestId === playtestId,
      ),
    [applications, testerId, playtestId],
  );
}

export function useTesterTests(testerId: string | undefined) {
  const applications = useGroguStore((s) => s.applications);
  const progress = useGroguStore((s) => s.testProgress);
  const playtests = usePlaytests();
  return useMemo(
    () =>
      testerId
        ? buildTesterTests(testerId, applications, playtests, progress)
        : [],
    [testerId, applications, playtests, progress],
  );
}

export function useTestProgress(
  testerId: string | undefined,
  playtestId: string | undefined,
) {
  const progress = useGroguStore((s) => s.testProgress);
  return useMemo(
    () =>
      progress.find(
        (p) => p.testerId === testerId && p.playtestId === playtestId,
      ) ?? null,
    [progress, testerId, playtestId],
  );
}

export function useFeedbackForPlaytest(playtestId: string | undefined): Feedback[] {
  const feedback = useGroguStore((s) => s.feedback);
  return useMemo(
    () =>
      feedback
        .filter((f) => f.playtestId === playtestId)
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [feedback, playtestId],
  );
}

export function usePlaytestAnalytics(playtestId: string | undefined) {
  const playtests = useGroguStore((s) => s.playtests);
  const feedback = useGroguStore((s) => s.feedback);
  return useMemo(() => {
    const playtest = playtests.find((p) => p.id === playtestId);
    if (!playtest) return undefined;
    return computeAnalytics(
      playtest,
      feedback.filter((f) => f.playtestId === playtestId),
    );
  }, [playtests, feedback, playtestId]);
}

export function useNotifications(userId: string | undefined): Notification[] {
  const notifications = useGroguStore((s) => s.notifications);
  return useMemo(
    () =>
      notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [notifications, userId],
  );
}

export function useUser(userId: string | undefined): User | undefined {
  const users = useGroguStore((s) => s.users);
  return useMemo(() => users.find((u) => u.id === userId), [users, userId]);
}

export function useTesterProfile(
  userId: string | undefined,
): { user: User; profile: TesterProfile } | undefined {
  const users = useGroguStore((s) => s.users);
  const profiles = useGroguStore((s) => s.testerProfiles);
  return useMemo(() => {
    const user = users.find((u) => u.id === userId);
    const profile = profiles.find((p) => p.userId === userId);
    return user && profile ? { user, profile } : undefined;
  }, [users, profiles, userId]);
}

export function useDeveloperProfile(
  userId: string | undefined,
): { user: User; profile: DeveloperProfile } | undefined {
  const users = useGroguStore((s) => s.users);
  const profiles = useGroguStore((s) => s.developerProfiles);
  return useMemo(() => {
    const user = users.find((u) => u.id === userId);
    const profile = profiles.find((p) => p.userId === userId);
    return user && profile ? { user, profile } : undefined;
  }, [users, profiles, userId]);
}

export interface ApplicantView {
  application: Application;
  tester: User;
  profile?: TesterProfile;
}

/** Applicants for a playtest, joined with tester + profile, newest first. */
export function usePlaytestApplicants(
  playtestId: string | undefined,
): ApplicantView[] {
  const applications = useGroguStore((s) => s.applications);
  const users = useGroguStore((s) => s.users);
  const profiles = useGroguStore((s) => s.testerProfiles);
  return useMemo(() => {
    const list: ApplicantView[] = [];
    for (const application of applications) {
      if (application.playtestId !== playtestId) continue;
      const tester = users.find((u) => u.id === application.testerId);
      if (!tester) continue;
      list.push({
        application,
        tester,
        profile: profiles.find((p) => p.userId === tester.id),
      });
    }
    return list.sort((a, b) =>
      b.application.submittedAt.localeCompare(a.application.submittedAt),
    );
  }, [applications, users, profiles, playtestId]);
}

export interface AcceptedTesterView {
  application: Application;
  tester: User;
  progress: TestProgress | null;
}

export function useAcceptedTesters(
  playtestId: string | undefined,
): AcceptedTesterView[] {
  const applications = useGroguStore((s) => s.applications);
  const users = useGroguStore((s) => s.users);
  const progress = useGroguStore((s) => s.testProgress);
  return useMemo(() => {
    const list: AcceptedTesterView[] = [];
    for (const application of applications) {
      if (application.playtestId !== playtestId || application.status !== "accepted") {
        continue;
      }
      const tester = users.find((u) => u.id === application.testerId);
      if (!tester) continue;
      list.push({
        application,
        tester,
        progress:
          progress.find(
            (p) =>
              p.playtestId === playtestId && p.testerId === application.testerId,
          ) ?? null,
      });
    }
    return list;
  }, [applications, users, progress, playtestId]);
}

/** All feedback across a developer's playtests, joined with tester + playtest. */
export function useDeveloperFeedback(developerId: string | undefined) {
  const playtests = useDeveloperPlaytests(developerId);
  const feedback = useGroguStore((s) => s.feedback);
  const users = useGroguStore((s) => s.users);
  return useMemo(() => {
    const byId = new Map(playtests.map((p) => [p.id, p]));
    return feedback
      .filter((f) => byId.has(f.playtestId))
      .map((entry) => ({
        feedback: entry,
        playtest: byId.get(entry.playtestId)!,
        tester: users.find((u) => u.id === entry.testerId),
      }))
      .sort((a, b) =>
        b.feedback.submittedAt.localeCompare(a.feedback.submittedAt),
      );
  }, [playtests, feedback, users]);
}

/** Aggregate stats for a developer's dashboard. */
export function useDeveloperStats(developerId: string | undefined) {
  const games = useDeveloperGames(developerId);
  const playtests = useDeveloperPlaytests(developerId);
  const applications = useGroguStore((s) => s.applications);
  const feedback = useGroguStore((s) => s.feedback);
  return useMemo(() => {
    const playtestIds = new Set(playtests.map((p) => p.id));
    const relevantApps = applications.filter((a) => playtestIds.has(a.playtestId));
    const relevantFeedback = feedback.filter((f) => playtestIds.has(f.playtestId));
    return {
      games: games.length,
      activePlaytests: playtests.filter(
        (p) => p.status === "recruiting" || p.status === "in-progress",
      ).length,
      pendingApplicants: relevantApps.filter((a) => a.status === "pending").length,
      acceptedTesters: relevantApps.filter((a) => a.status === "accepted").length,
      feedbackCount: relevantFeedback.length,
    };
  }, [games, playtests, applications, feedback]);
}

export interface PlaytestSummary {
  applicants: number;
  pending: number;
  accepted: number;
  feedbackCount: number;
  completed: number;
  /** 0–1 of the roster filled. */
  rosterRatio: number;
  /** 0–1 of accepted testers who have finished. */
  completionRatio: number;
}

/**
 * Roll-up counts for one playtest, as shown on the developer's list rows and
 * dashboard. Kept here so both views agree on what "completed" means.
 */
export function usePlaytestSummary(playtestId: string, maxTesters: number): PlaytestSummary {
  const applications = useGroguStore((s) => s.applications);
  const feedback = useGroguStore((s) => s.feedback);
  const progress = useGroguStore((s) => s.testProgress);

  return useMemo(() => {
    const mine = applications.filter((a) => a.playtestId === playtestId);
    const accepted = mine.filter((a) => a.status === "accepted");
    const completed = accepted.filter(
      (a) =>
        progress.find(
          (p) => p.playtestId === playtestId && p.testerId === a.testerId,
        )?.stage === "completed",
    ).length;

    return {
      applicants: mine.length,
      pending: mine.filter((a) => a.status === "pending").length,
      accepted: accepted.length,
      feedbackCount: feedback.filter((f) => f.playtestId === playtestId).length,
      completed,
      rosterRatio: Math.min(1, accepted.length / Math.max(1, maxTesters)),
      completionRatio: accepted.length ? completed / accepted.length : 0,
    };
  }, [applications, feedback, progress, playtestId, maxTesters]);
}
