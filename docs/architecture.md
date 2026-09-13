# Architecture

Project Grogu frontend — a game playtesting platform prototype connecting indie
**developers** with **playtesters**.

**Phase: frontend-first.** There is no backend. Authentication, persistence, and
every mutation are simulated on the client. The code is structured so the mock
layer can be swapped for a real API without touching pages or components.

## Stack

| Concern         | Choice                                            |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)                |
| Language        | TypeScript (strict)                               |
| Styling         | Tailwind CSS v4 (CSS-first `@theme`)              |
| UI primitives   | Radix UI + hand-rolled, shadcn/ui-compatible      |
| Icons           | lucide-react                                      |
| Forms           | React Hook Form + Zod (`@hookform/resolvers`)     |
| Client state    | Zustand (persisted) — the mock "database"         |
| Charts          | Recharts                                          |
| Package manager | npm                                               |

## Layers

```
components/**            UI. Reads via hooks, writes via services. Never touches the store directly.
        │
lib/hooks/**             Reactive selector hooks over the store (reads).
lib/services/**          Async mock service layer (writes + auth). THE SEAM.
        │
lib/store/grogu-store    Zustand store — the single source of mutable truth, persisted to localStorage.
        │
data/**                  Seed data (typed by lib/types). Also read directly by Server Components.
lib/domain.ts            Pure join / filter / aggregate helpers (no React, no store).
lib/types.ts             Domain models — the single source of entity shapes.
```

Rule of thumb: **components call `lib/hooks/*` to read and `lib/services/*` to
write.** Only the store and `data/index.ts` import raw seed arrays.

## App Router structure

Routes live at the repo root in `app/` (no `src/`). Route **groups** attach a
shared layout without adding a URL segment:

```
app/
  layout.tsx                 Root: <html>, fonts, metadata
  not-found.tsx

  (marketing)/               Public — SiteHeader + SiteFooter (session-aware)
    page.tsx                 "/"  Landing
    how-it-works/  developers/
    discover/                "/discover"          (public browse)
    playtests/[id]/          "/playtests/[id]"    (public detail + apply)

  (auth)/                     Split layout — form + game-art panel
    login/  signup/

  (tester)/                   AppShell role="tester" — top nav, route-guarded
    dashboard/  applications/  profile/
    tests/  tests/[id]/  tests/[id]/feedback/

  (developer)/                AppShell role="developer" — top nav, route-guarded
    developer/dashboard/  developer/games/  developer/games/new/
    developer/playtests/  developer/playtests/new/  developer/playtests/[id]/
    developer/analytics/  developer/profile/
```

`AppShell` (client) guards the authenticated areas: it redirects to `/login`
when signed out and to the other role's home on a role mismatch, and it gates
rendering on store hydration.

## Server vs. Client Components

Server Components are the default. Client Components are used where there is real
interactivity: the app shell + navigation, every form, dialogs, tabs, charts,
and any view that reads the persisted store.

Pattern for interactive pages: a **thin Server Component `page.tsx`** (exports
`metadata`, awaits `params`) renders a **client feature component** from
`components/`.

Public read pages (`/discover`, `/playtests/[id]`) fetch seed data in the Server
Component and pass it to the client component as `initialData`. The client uses
that value until the store has hydrated, then switches to live store state — so
the page shows content immediately with no SSR/CSR mismatch.

## Data flow (read)

```
Server Component  ──►  data/index.ts (seed)  ──►  props
Client Component  ──►  lib/hooks/use-grogu   ──►  useGroguStore selector + useMemo derive
```

## Data flow (write)

```
Component event ──► lib/services/<entity>.<verb>()  (async, ~simulated latency)
                      └─► useGroguStore.getState().<action>()  (immutable update)
                            └─► persist middleware writes localStorage
                                  └─► subscribed hooks re-render
```

## Future API integration

Every service function is already `async` and returns a domain type. Swap the
body for `fetch` / an SDK call — the signatures and every call site stay the
same. Reads would move to TanStack Query (already a documented dependency in
`AGENTS.md`); the selector hooks in `lib/hooks/*` are the seam for that.

See `docs/mock-data.md` and `docs/state-management.md` for specifics.

## Conventions

- Path alias `@/*` → repo root.
- No raw hex or magic strings in components — colours are design tokens
  (`docs/design-system.md`), labels come from `lib/constants.ts`.
- `cn()` merges class names; every primitive accepts `className`.
- Dates are ISO strings; format with `lib/utils.ts` helpers.
- No `any`. Strict TypeScript. ESLint (`eslint-config-next`) must pass clean.
