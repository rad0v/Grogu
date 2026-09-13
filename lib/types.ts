/**
 * Project Grogu — domain models.
 *
 * These types are the single source of truth for the shape of Grogu data.
 * Mock data in `data/` implements them today; a real API layer will return
 * the same shapes later, so pages and components should only ever import
 * from here — never redeclare an entity inline.
 */

export type ID = string;
export type ISODateString = string;

/* -------------------------------------------------------------------------- */
/*  Shared enums / unions                                                      */
/* -------------------------------------------------------------------------- */

export type UserRole = "tester" | "developer";

export type GamePlatform = "pc" | "mac" | "linux" | "web" | "mobile" | "console";

export type GameGenre =
  | "action"
  | "adventure"
  | "rpg"
  | "strategy"
  | "puzzle"
  | "simulation"
  | "roguelike"
  | "platformer"
  | "shooter"
  | "horror";

export type GameStatus = "in-development" | "alpha" | "beta" | "released";

export type PlaytestStatus =
  | "draft"
  | "recruiting"
  | "in-progress"
  | "review"
  | "completed"
  | "closed"
  | "archived";

export type PlaytestFocus =
  | "onboarding"
  | "difficulty-balance"
  | "level-design"
  | "performance"
  | "narrative"
  | "ui-ux"
  | "multiplayer"
  | "general";

export type ExperienceLevel = "casual" | "regular" | "hardcore" | "professional";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type TaskType = "objective" | "survey" | "bug-report" | "free-play";

export type TaskStatus = "not-started" | "in-progress" | "submitted";

export type FeedbackSentiment = "positive" | "neutral" | "negative";

/* -------------------------------------------------------------------------- */
/*  Users                                                                      */
/* -------------------------------------------------------------------------- */

export interface User {
  id: ID;
  role: UserRole;
  name: string;
  handle: string;
  email: string;
  /** Optional — the UI renders an initials avatar when absent. */
  avatarUrl?: string;
  location: string;
  bio: string;
  joinedAt: ISODateString;
}

export interface TesterProfile {
  userId: ID;
  experienceLevel: ExperienceLevel;
  /** Genres the tester enjoys and is credible testing. */
  preferredGenres: GameGenre[];
  platforms: GamePlatform[];
  /** Spoken/written languages, used to match narrative playtests. */
  languages: string[];
  /** Weekly hours the tester can commit. */
  weeklyAvailabilityHours: number;
  /** 0–100 reputation score derived from completed playtests + feedback quality. */
  reputation: number;
  completedPlaytests: number;
  averageFeedbackRating: number;
  /** Short, human-readable strengths shown on the public profile. */
  badges: string[];
}

export interface DeveloperProfile {
  userId: ID;
  studioName: string;
  studioSize: "solo" | "small" | "mid" | "large";
  website: string;
  foundedYear: number;
  gamesPublished: number;
  activePlaytests: number;
}

/* -------------------------------------------------------------------------- */
/*  Games                                                                      */
/* -------------------------------------------------------------------------- */

export interface Game {
  id: ID;
  developerId: ID;
  title: string;
  tagline: string;
  description: string;
  genres: GameGenre[];
  platforms: GamePlatform[];
  status: GameStatus;
  /** Optional — the UI renders procedural cover art from `accent` when absent. */
  coverImageUrl?: string;
  /** Accent hue (0–360) used to generate the game's cover art + card treatment. */
  accentHue: number;
  buildVersion: string;
  updatedAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Playtests                                                                  */
/* -------------------------------------------------------------------------- */

export interface TesterRequirements {
  minExperienceLevel: ExperienceLevel;
  platforms: GamePlatform[];
  /** Optional genre familiarity the developer wants. */
  preferredGenres: GameGenre[];
  languages: string[];
  minReputation: number;
  estimatedHours: number;
  ndaRequired: boolean;
}

export interface PlaytestTask {
  id: ID;
  title: string;
  description: string;
  type: TaskType;
  required: boolean;
  estimatedMinutes: number;
}

export interface Playtest {
  id: ID;
  gameId: ID;
  developerId: ID;
  title: string;
  summary: string;
  goals: string[];
  focusAreas: PlaytestFocus[];
  status: PlaytestStatus;
  requirements: TesterRequirements;
  tasks: PlaytestTask[];
  /** What testers get. Free-text for the prototype (e.g. "Steam key + credit"). */
  reward: string;
  /** Cash portion of the reward, in whole Indian rupees, when applicable. */
  cashReward?: number;
  maxTesters: number;
  acceptedTesters: number;
  applicantCount: number;
  buildUrl: string;
  opensAt: ISODateString;
  /** Applications close on this date. */
  closesAt: ISODateString;
  createdAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Applications                                                               */
/* -------------------------------------------------------------------------- */

export interface Application {
  id: ID;
  playtestId: ID;
  testerId: ID;
  status: ApplicationStatus;
  /** Tester's pitch to the developer. */
  message: string;
  submittedAt: ISODateString;
  decidedAt: ISODateString | null;
  /** Developer's private note about the decision. */
  decisionNote: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Feedback                                                                   */
/* -------------------------------------------------------------------------- */

export interface FeedbackRatings {
  /** All ratings are on a 1–5 scale. */
  fun: number;
  difficulty: number;
  clarity: number;
  performance: number;
  polish: number;
}

export interface FeedbackAnswer {
  taskId: ID;
  question: string;
  answer: string;
}

export interface Feedback {
  id: ID;
  playtestId: ID;
  testerId: ID;
  ratings: FeedbackRatings;
  sentiment: FeedbackSentiment;
  /** Free-form summary written by the tester. */
  summary: string;
  highlights: string[];
  painPoints: string[];
  bugs: string[];
  answers: FeedbackAnswer[];
  wouldRecommend: boolean;
  hoursPlayed: number;
  submittedAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Composed view models                                                       */
/* -------------------------------------------------------------------------- */

/** A playtest joined with its game + developer, ready for list/detail views. */
export interface PlaytestWithRelations extends Playtest {
  game: Game;
  developer: User;
}

/** Aggregated numbers shown on a developer's playtest analytics view. */
export interface PlaytestAnalytics {
  playtestId: ID;
  responseRate: number;
  averageRatings: FeedbackRatings;
  sentimentBreakdown: Record<FeedbackSentiment, number>;
  totalBugs: number;
  averageHoursPlayed: number;
}

/* -------------------------------------------------------------------------- */
/*  Tester test progress (workspace workflow)                                  */
/* -------------------------------------------------------------------------- */

export type TestStage =
  | "not-started"
  | "in-progress"
  | "tasks-complete"
  | "feedback-submitted"
  | "completed";

/** One tester's progress through one playtest they were accepted to. */
export interface TestProgress {
  id: ID;
  playtestId: ID;
  testerId: ID;
  stage: TestStage;
  completedTaskIds: ID[];
  buildDownloaded: boolean;
  startedAt: ISODateString | null;
  completedAt: ISODateString | null;
  feedbackId: ID | null;
}

/** A playtest joined with the current tester's application + progress. */
export interface TesterTest {
  playtest: PlaytestWithRelations;
  application: Application;
  progress: TestProgress | null;
}

/* -------------------------------------------------------------------------- */
/*  Notifications                                                              */
/* -------------------------------------------------------------------------- */

export type NotificationType =
  | "application-accepted"
  | "application-rejected"
  | "application-received"
  | "feedback-received"
  | "playtest-published"
  | "test-reminder"
  | "system";

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  body: string;
  /** In-app link the notification points to, if any. */
  href: string | null;
  read: boolean;
  createdAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Mock session                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Frontend-only session. Produced by `lib/services/auth` and held in the
 * persisted client store. A real auth provider replaces the producer only.
 */
export interface Session {
  user: User;
  role: UserRole;
  /** Epoch ms — used to show a friendly "signed in" time, nothing security-related. */
  issuedAt: number;
}

/* -------------------------------------------------------------------------- */
/*  Form inputs (create flows)                                                 */
/* -------------------------------------------------------------------------- */

export interface NewGameInput {
  title: string;
  tagline: string;
  description: string;
  genres: GameGenre[];
  platforms: GamePlatform[];
  status: GameStatus;
  buildVersion: string;
  accentHue: number;
}

export type UpdateGameInput = NewGameInput;

export interface NewPlaytestInput {
  gameId: ID;
  title: string;
  summary: string;
  goals: string[];
  focusAreas: PlaytestFocus[];
  requirements: TesterRequirements;
  tasks: Omit<PlaytestTask, "id">[];
  reward: string;
  maxTesters: number;
  closesAt: ISODateString;
  publish: boolean;
}

export interface UpdatePlaytestInput {
  gameId: ID;
  title: string;
  summary: string;
  goals: string[];
  focusAreas: PlaytestFocus[];
  requirements: TesterRequirements;
  tasks: Array<Omit<PlaytestTask, "id"> & { id?: ID }>;
  reward: string;
  maxTesters: number;
  closesAt: ISODateString;
}

/** Payload the tester feedback form produces. */
export interface FeedbackInput {
  ratings: FeedbackRatings;
  sentiment: FeedbackSentiment;
  summary: string;
  highlights: string[];
  painPoints: string[];
  bugs: string[];
  answers: FeedbackAnswer[];
  wouldRecommend: boolean;
  hoursPlayed: number;
}

/** Payload the tester application form produces. */
export interface ApplicationInput {
  message: string;
  device: string;
  experienceNote: string;
  agreedToTerms: boolean;
}
