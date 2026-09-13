# State Management & Mock Backend

Frontend-first phase: **there is no backend.** A single persisted Zustand store
is the mock database; a thin async service layer is the seam a real API will
replace.

## The store — `lib/store/grogu-store.ts`

One Zustand store, created with the `persist` middleware
(`localStorage`, key `grogu-store-v1`). It holds the entire dataset plus the
session:

| Slice | Seeded from |
| --- | --- |
| `session` | `null` (set by mock auth) |
| `users`, `testerProfiles`, `developerProfiles` | `data/users.ts` |
| `games` | `data/games.ts` |
| `playtests` | `data/playtests.ts` (counters re-derived on load) |
| `applications` | `data/applications.ts` |
| `feedback` | `data/feedback.ts` |
| `testProgress` | `data/test-progress.ts` |
| `notifications` | `data/notifications.ts` |

### Actions (mutations)

`setSession`, `applyToPlaytest`, `withdrawApplication`, `setBuildDownloaded`,
`toggleTask`, `submitFeedback`, `decideApplication`, `createGame`, `updateGame`,
`createPlaytest`, `updatePlaytest`, `setPlaytestStatus`, `markNotificationRead`,
`markAllNotificationsRead`, `resetDemo`.

Every action is a pure immutable update. Cross-entity effects are handled inline
(e.g. accepting an applicant also creates a notification for that tester and
re-derives the playtest's counters).

### Hydration

The store persists to `localStorage`, which rehydrates on the client after the
server has already rendered. Any UI that reads persisted state is gated on
`useHydrated()` (`lib/hooks/use-hydrated.ts`, built on
`useSyncExternalStore` + `persist.onFinishHydration`) so the first client render
matches the server HTML. Public pages pass server-seeded data as a prop and use
it until `useHydrated()` is true.

### Reset

`resetDemo()` (User menu → "Reset demo data") reseeds every slice and clears the
session — useful when a demo run has drifted.

## Reads — `lib/hooks/*`

- `use-session.ts` — `useSession()`, `useRequireRole(role)`, `homePathForRole()`
- `use-hydrated.ts` — `useHydrated()`
- `use-grogu.ts` — one selector hook per view need (`usePlaytests`,
  `useDiscoverPlaytests`, `useApplicationsByTester`, `useTesterTests`,
  `usePlaytestApplicants`, `useAcceptedTesters`, `useDeveloperFeedback`,
  `usePlaytestAnalytics`, `useDeveloperStats`, …). Each selects stable raw
  arrays from the store and derives with `useMemo` — no `useShallow` needed.

Join / filter / aggregate logic lives once in `lib/domain.ts` and is shared by
these hooks and the server-side `data/index.ts`.

## Writes & auth — `lib/services/*`

Async functions that add ~200–900ms of simulated latency (so the UI exercises
real loading states), then call a store action. They throw `ServiceError` with a
`code` the UI can branch on.

| Module | Functions |
| --- | --- |
| `auth.ts` (`lib/mock-auth.ts` re-exports) | `login`, `loginAsDemo`, `signup`, `logout`, `getSession` |
| `applications.ts` | `applyToPlaytest`, `withdrawApplication`, `decideApplication` |
| `tests.ts` | `downloadBuild`, `toggleTask`, `submitFeedback` |
| `games.ts` | `createGame`, `updateGame` |
| `playtests.ts` | `createPlaytest`, `updatePlaytest`, `setPlaytestStatus` |
| `notifications.ts` | `markRead`, `markAllRead` |

## Mock authentication

Frontend-only. A "session" is `{ user, role, issuedAt }` held in the store and
persisted. **No provider, no token, no password check beyond length.**

- **Demo accounts** (one click on `/login`):
  `priya.nair@example.com` (tester) · `mara@driftwoodgames.dev` (developer).
- **Email login**: any email present in the seed `users` + any 6+ char password.
- **Signup**: pick tester or developer, fill the role-specific form → a new
  `User` (+ profile) is created and you're signed in.
- Role determines the redirect target and which `AppShell` you can enter.

To make auth real, replace the three functions in `lib/services/auth.ts` and
nothing else — the rest of the app only sees `useSession()`.

## The full demo workflow this enables

```
Tester signs up / logs in
  → Discover → Playtest detail → Apply            (application: pending)
Developer logs in
  → Manage playtest → Applicants → Accept         (application: accepted, tester notified)
Tester
  → My tests → workspace: download build, tick tasks
  → Feedback form → submit                        (test: completed, developer notified)
Developer
  → Manage playtest → Feedback / Analytics update
```

All of it runs on mock state and survives refresh.

Playtest lifecycle rules are frontend-only and enforced by the domain/service
boundary: drafts can be edited, `recruiting` is the published/open state,
active or completed playtests are locked for editing, and `completed` or
`closed` playtests may move to terminal `archived` status.
