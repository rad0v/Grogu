/**
 * Server-side seed accessors.
 *
 * Used by Server Components (landing, /discover, /playtests/[id]) for the
 * initial render. Client Components read live state through `lib/hooks/*` over
 * the persisted store instead; mutations go through `lib/services/*`.
 *
 * These are `async` on purpose: the signatures already match a network layer,
 * so swapping the bodies for `fetch(...)` later needs no call-site changes.
 */

import type {
  Application,
  Feedback,
  Game,
  Playtest,
  PlaytestAnalytics,
  PlaytestWithRelations,
  User,
} from "@/lib/types";

import { applications } from "./applications";
import { feedback } from "./feedback";
import { games } from "./games";
import { playtests } from "./playtests";
import { developerProfiles, testerProfiles, users } from "./users";

/* -------------------------------------------------------------------------- */
/*  Games                                                                      */
/* -------------------------------------------------------------------------- */

export async function getGames(): Promise<Game[]> {
  return games;
}

export async function getGameById(id: string): Promise<Game | undefined> {
  return games.find((g) => g.id === id);
}

/** Games surfaced on the marketing landing page. */
export async function getFeaturedGames(limit = 3): Promise<Game[]> {
  const recruitingGameIds = new Set(
    playtests.filter((p) => p.status === "recruiting").map((p) => p.gameId),
  );
  return [...games]
    .sort((a, b) => {
      const aHot = recruitingGameIds.has(a.id) ? 1 : 0;
      const bHot = recruitingGameIds.has(b.id) ? 1 : 0;
      if (aHot !== bHot) return bHot - aHot;
      return b.updatedAt.localeCompare(a.updatedAt);
    })
    .slice(0, limit);
}

export async function getGamesByDeveloper(developerId: string): Promise<Game[]> {
  return games.filter((g) => g.developerId === developerId);
}

/* -------------------------------------------------------------------------- */
/*  Users                                                                      */
/* -------------------------------------------------------------------------- */

export async function getUserById(id: string): Promise<User | undefined> {
  return users.find((u) => u.id === id);
}

export async function getTesterProfile(userId: string) {
  const user = users.find((u) => u.id === userId && u.role === "tester");
  const profile = testerProfiles.find((p) => p.userId === userId);
  if (!user || !profile) return undefined;
  return { user, profile };
}

export async function getDeveloperProfile(userId: string) {
  const user = users.find((u) => u.id === userId && u.role === "developer");
  const profile = developerProfiles.find((p) => p.userId === userId);
  if (!user || !profile) return undefined;
  return { user, profile };
}

/* -------------------------------------------------------------------------- */
/*  Playtests                                                                  */
/* -------------------------------------------------------------------------- */

function joinPlaytest(playtest: Playtest): PlaytestWithRelations | undefined {
  const game = games.find((g) => g.id === playtest.gameId);
  const developer = users.find((u) => u.id === playtest.developerId);
  if (!game || !developer) return undefined;
  return { ...playtest, game, developer };
}

export async function getPlaytests(options?: {
  status?: Playtest["status"];
}): Promise<PlaytestWithRelations[]> {
  return playtests
    .filter((p) => (options?.status ? p.status === options.status : true))
    .map(joinPlaytest)
    .filter((p): p is PlaytestWithRelations => Boolean(p));
}

/** Open playtests a tester can currently apply to. */
export async function getDiscoverablePlaytests(): Promise<
  PlaytestWithRelations[]
> {
  return (await getPlaytests({ status: "recruiting" })).sort((a, b) =>
    a.closesAt.localeCompare(b.closesAt),
  );
}

export async function getPlaytestById(
  id: string,
): Promise<PlaytestWithRelations | undefined> {
  const match = playtests.find((p) => p.id === id);
  return match ? joinPlaytest(match) : undefined;
}

export async function getPlaytestsByDeveloper(
  developerId: string,
): Promise<PlaytestWithRelations[]> {
  return (await getPlaytests()).filter((p) => p.developerId === developerId);
}

/* -------------------------------------------------------------------------- */
/*  Applications                                                               */
/* -------------------------------------------------------------------------- */

export async function getApplicationsByTester(
  testerId: string,
): Promise<Application[]> {
  return applications
    .filter((a) => a.testerId === testerId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getApplicationsForPlaytest(
  playtestId: string,
): Promise<Application[]> {
  return applications.filter((a) => a.playtestId === playtestId);
}

/* -------------------------------------------------------------------------- */
/*  Feedback + analytics                                                       */
/* -------------------------------------------------------------------------- */

export async function getFeedbackForPlaytest(
  playtestId: string,
): Promise<Feedback[]> {
  return feedback.filter((f) => f.playtestId === playtestId);
}

export async function getPlaytestAnalytics(
  playtestId: string,
): Promise<PlaytestAnalytics | undefined> {
  const playtest = playtests.find((p) => p.id === playtestId);
  if (!playtest) return undefined;

  const responses = feedback.filter((f) => f.playtestId === playtestId);
  const responseCount = responses.length || 1;

  const sum = responses.reduce(
    (acc, f) => ({
      fun: acc.fun + f.ratings.fun,
      difficulty: acc.difficulty + f.ratings.difficulty,
      clarity: acc.clarity + f.ratings.clarity,
      performance: acc.performance + f.ratings.performance,
      polish: acc.polish + f.ratings.polish,
    }),
    { fun: 0, difficulty: 0, clarity: 0, performance: 0, polish: 0 },
  );

  const round = (n: number) => Math.round((n / responseCount) * 10) / 10;

  return {
    playtestId,
    responseRate:
      playtest.acceptedTesters > 0
        ? Math.round((responses.length / playtest.acceptedTesters) * 100)
        : 0,
    averageRatings: {
      fun: round(sum.fun),
      difficulty: round(sum.difficulty),
      clarity: round(sum.clarity),
      performance: round(sum.performance),
      polish: round(sum.polish),
    },
    sentimentBreakdown: {
      positive: responses.filter((f) => f.sentiment === "positive").length,
      neutral: responses.filter((f) => f.sentiment === "neutral").length,
      negative: responses.filter((f) => f.sentiment === "negative").length,
    },
    totalBugs: responses.reduce((acc, f) => acc + f.bugs.length, 0),
    averageHoursPlayed:
      Math.round(
        (responses.reduce((acc, f) => acc + f.hoursPlayed, 0) / responseCount) *
          10,
      ) / 10,
  };
}

/* -------------------------------------------------------------------------- */
/*  Landing-page aggregate stats                                               */
/* -------------------------------------------------------------------------- */

export async function getPlatformStats() {
  return {
    games: games.length,
    activePlaytests: playtests.filter(
      (p) => p.status === "recruiting" || p.status === "in-progress",
    ).length,
    testers: users.filter((u) => u.role === "tester").length,
    feedbackSubmitted: feedback.length,
  };
}
