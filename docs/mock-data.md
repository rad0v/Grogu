# Mock Data

Seed data is realistic and internally consistent, typed by `lib/types.ts`. At
runtime the seed is loaded into the persisted client store
(`lib/store/grogu-store.ts`), which is the mutable source of truth — see
`docs/state-management.md`.

## Seed files — `data/`

| File | Exports | Contents |
| --- | --- | --- |
| `users.ts` | `users`, `testerProfiles`, `developerProfiles` | 3 developers, 6 testers + a profile each |
| `games.ts` | `games` | 6 games across the 3 developers |
| `playtests.ts` | `playtests` | 6 playtests (one per game) covering every relevant status |
| `applications.ts` | `applications` | 21 applications |
| `feedback.ts` | `feedback` | 9 feedback reports (for in-progress / review / completed playtests) |
| `test-progress.ts` | `testProgress` | Workspace progress for the demo tester's accepted tests |
| `notifications.ts` | `notifications` | Seeded for the two demo accounts |
| `index.ts` | async accessors | Read by **Server Components** only (landing, discover, playtest detail) |

## Demo accounts

| Role | User id | Email |
| --- | --- | --- |
| Tester | `tester-1` (Priya Nair) | `priya.nair@example.com` |
| Developer | `dev-1` (Mara Okafor, Driftwood Games) | `mara@driftwoodgames.dev` |

Both have pre-seeded applications, tests, feedback, and notifications so every
screen has content on first load.

## Entities & relationships

```
User(developer) 1─* Game            Game.developerId
User(developer) 1─* Playtest        Playtest.developerId
Game            1─* Playtest        Playtest.gameId
Playtest        1─* Application     Application.playtestId
User(tester)    1─* Application     Application.testerId
Playtest        1─* Feedback        Feedback.playtestId
User(tester)    1─* Feedback        Feedback.testerId
Playtest        1─* TestProgress    (per accepted tester)
Playtest        1─1 PlaytestTask[]  (embedded)
User            1─1 Tester/DeveloperProfile
User            1─* Notification
```

Composed view models (`lib/types.ts`): `PlaytestWithRelations`, `TesterTest`,
`PlaytestAnalytics`, `Session`.

## Consistency

- Playtest counters (`applicantCount`, `acceptedTesters`) are **re-derived** from
  applications when the store seeds and on every mutation — authored values are
  a fallback only.
- Every `testerId` is a `role:"tester"` user; every `developerId` a
  `role:"developer"` user.
- `Feedback` exists only for playtests that are `in-progress` / `review` /
  `completed`.
- Dates are ISO strings; "today" in the dataset ≈ **2026-09-08**.

## How it's consumed

**Server Components** (`app/(marketing)/*`) call the `async` accessors in
`data/index.ts` directly for the initial render.

**Client Components** call selector hooks in `lib/hooks/use-grogu.ts`, which read
the store. Writes go through `lib/services/*`, which call store actions.

## Replacing with an API

`data/index.ts` accessors and `lib/services/*` functions are all `async` and
return domain types. Replace their bodies with `fetch` calls; move client reads
to TanStack Query behind the same `lib/hooks/*` names. Nothing in `components/`
changes.
