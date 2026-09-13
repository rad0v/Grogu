# Development

## Prerequisites

- **Node.js** ≥ 20 (developed on Node 24)
- **npm** (bundled with Node.js)

## Install & run

```bash
npm install
npm run dev         # http://localhost:3000 (next free port if taken)
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack, Fast Refresh) |
| `npm run build` | Production build — also runs full type checking |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |

Run before committing:

```bash
npm run lint && npm run typecheck && npm run build
```

## Trying the prototype

1. `/` → **Log in** → "Continue as Priya Nair · Tester".
2. **Discover** → open a playtest → **Apply**.
3. Sign out (avatar menu) → log in as **Mara Okafor · Developer**.
4. **Playtests** → open one → **Applicants** tab → **Accept** your tester.
5. Sign back in as the tester → **My tests** → download build, tick tasks →
   **feedback form** → submit.
6. Back as the developer → the playtest's **Feedback** / **Analytics** tabs
   update.

"Reset demo data" in the avatar menu reseeds everything.

## Project layout

```
app/            Routes. Route groups: (marketing) (auth) (tester) (developer)
components/      ui/ layout/ navigation/ marketing/ games/ playtests/
                tests/ feedback/ dashboard/ charts/ tester/ developer/ auth/
data/           Seed data + data/index.ts (Server-Component reads)
lib/
  types.ts      Domain models
  constants.ts  Labels, nav config
  domain.ts     Pure join/filter/aggregate helpers
  utils.ts      cn() + formatters
  store/        Zustand persisted store (mock DB)
  services/     Async mock service layer (writes + auth)
  hooks/        Reactive selector hooks (reads)
  mock-auth.ts  Public mock-auth entry point
docs/           This documentation
public/images/  Placeholder dir — cover art + avatars are procedural
```

See `docs/architecture.md` and `docs/state-management.md`.

## Conventions

- **Server Components by default.** `"use client"` only for real interactivity.
  Interactive pages = thin server `page.tsx` + client feature component.
- **Reads via `lib/hooks/*`, writes via `lib/services/*`.** Components never
  import the store or raw seed arrays.
- **Types centralized** in `lib/types.ts`. No `any`. Strict TS.
- **No raw hex / magic strings** — design tokens + `lib/constants.ts`.
- **Reuse `components/ui/`** before adding primitives.
- **Accessibility**: semantic elements, `aria-current` on active nav, labelled
  inputs (`Field`), `aria-label` on icon-only controls, visible focus rings,
  Radix for dialogs / menus / tabs. State is never colour-only (icon + text).
- **Responsive**: mobile → large desktop; no horizontal overflow; tables/charts
  scroll inside their container.

## Adding a route

1. `app/(group)/<segment>/page.tsx` — pick the group whose shell fits.
2. Export `metadata`; `await params` / wrap `useSearchParams` consumers in
   `<Suspense>`.
3. Put the UI in a client feature component under the matching `components/`
   folder.
4. Update `docs/routes.md`.

## Dependencies

Current runtime set: `next`, `react`, `zustand`, `recharts`, `lucide-react`,
`react-hook-form`, `zod`, `@hookform/resolvers`,
`class-variance-authority` / `clsx` / `tailwind-merge`, and `@radix-ui/react-*`
(dialog, dropdown-menu, tabs, label, checkbox, radio-group, select, slot, avatar,
progress, separator, scroll-area).

Do **not** add: Prisma, Postgres clients, Firebase, Supabase, Auth.js, Stripe,
Socket.io, AI SDKs. TanStack Query comes in with the real API. Discuss anything
else first (`AGENTS.md` §6).
