# Routes

All app data is mock/persisted client state. "Auth" is simulated.

## Marketing / public — `app/(marketing)/`

Shared layout: `SiteHeader` (session-aware) + `SiteFooter`.

| Route | User | Purpose |
| --- | --- | --- |
| `/` | Everyone | Landing: hero, featured playtests, how-it-works, why-testers, why-developers, platform stats, featured games, developer CTA, footer |
| `/how-it-works` | Everyone | The playtest loop, tester journey |
| `/developers` | Developers | Developer-focused pitch + feature breakdown |
| `/discover` | Everyone | Browse open playtests. Working search + genre/platform/time/NDA filters |
| `/playtests/[id]` | Everyone | Playtest detail: banner, goals, tasks, requirements, reward, developer, apply CTA. Apply requires a tester session |

## Auth — `app/(auth)/`

| Route | Purpose |
| --- | --- |
| `/login` | Demo-account buttons + email/password (mock). Honours `?next=`. Redirects if already signed in |
| `/signup` | Role selection (tester / developer) → role-specific form (RHF + Zod). Creates a mock account and signs in |

## Tester area — `app/(tester)/`

`AppShell` role `tester`. Top nav: Dashboard · Discover · Applications · My tests · Profile.

| Route | Purpose |
| --- | --- |
| `/dashboard` | Welcome, reputation + counts, continue-testing, recent applications, recommendations |
| `/applications` | All applications, tabbed by status; withdraw pending ones |
| `/tests` | Accepted playtests, split active / completed, with progress |
| `/tests/[id]` | Workspace: download build → task checklist → unlock feedback. Workflow stepper |
| `/tests/[id]/feedback` | Structured feedback form (ratings, summary, highlights, pain points, controls, bugs, recommend, hours) → marks the test complete |
| `/profile` | Public tester profile: reputation, completion rate, badges, testing history, preferences |

## Developer area — `app/(developer)/`

`AppShell` role `developer`. Top nav: Dashboard · My games · Playtests · Analytics.
Studio profile is `menuOnly` — reachable from the account menu and the mobile
drawer, but kept out of the top nav so the four primary destinations stay clear.

| Route | Purpose |
| --- | --- |
| `/developer/dashboard` | Studio stats, active playtests with roster + feedback progress, recent feedback |
| `/developer/games` | Game grid with per-game playtest / tester / feedback counts |
| `/developer/games/new` | Create-game form with live cover preview + accent picker |
| `/developer/games/[id]/edit` | Edit an owned game's details with the same validated form |
| `/developer/playtests` | All playtests, tabbed by status |
| `/developer/playtests/new` | 4-step create flow: game & info → requirements & reward → tasks → review. Save draft or publish |
| `/developer/playtests/[id]` | Manage: tabs for Overview / Applicants (accept–reject) / Testers / Feedback / Analytics. `?tab=` deep-links. Status control |
| `/developer/playtests/[id]/edit` | Edit an owned draft playtest; published and terminal states are locked |
| `/developer/analytics` | Cross-playtest feedback: ratings chart, sentiment donut, common pain points & bugs, qualitative feed. Scope selector |
| `/developer/profile` | Studio profile: details, stats, games |

## System

| Route | Purpose |
| --- | --- |
| `not-found` | Global 404 |

## Notes

- Route groups `(marketing)` / `(auth)` / `(tester)` / `(developer)` don't appear
  in URLs.
- `/discover` and `/playtests/[id]` are **public** (Steam-style): browsable
  without an account; applying redirects to `/login?next=…`.
- `/developer/...` keeps a literal `/developer` segment; the group only shares the
  layout.
- `/playtests/[id]` is prerendered for seed playtests (`generateStaticParams`);
  playtests created in a session render on demand from the store.
