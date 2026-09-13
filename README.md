# Project Grogu — Frontend

A game **playtesting platform** prototype connecting indie developers with
dedicated playtesters. College minor-project, **frontend-first**: no backend —
auth, persistence, and every mutation are simulated on the client with a
persisted store, structured so a real API drops in cleanly.

## Quick start

```bash
npm install
npm run dev         # http://localhost:3000
```

Then: **Log in** → "Continue as Priya Nair · Tester" (or Mara Okafor · Developer).
"Reset demo data" (avatar menu) reseeds everything.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript (strict) · Tailwind CSS v4 ·
Radix UI + shadcn-compatible primitives · lucide-react · React Hook Form + Zod ·
Zustand (persisted mock DB) · Recharts · npm.

## What's built

The full MVP for both roles:

- **Marketing**: landing, how-it-works, developers, public **Discover** (working
  filters) and **playtest detail**.
- **Auth** (mock): login with demo accounts / any seed email, role-select signup.
- **Tester**: dashboard, applications (with withdraw), my tests, test workspace
  (build → tasks → feedback), structured feedback form, profile.
- **Developer**: dashboard, games + create-game, playtests + 4-step create-playtest
  wizard, manage playtest (overview / applicants / testers / feedback / analytics),
  cross-playtest analytics, studio profile.
- The complete workflow runs end to end on mock state and survives refresh —
  apply → accept → test → feedback → analytics.

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (+ type check) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Documentation

| Doc | |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | Layers, App Router structure, data flow, future API |
| [`docs/state-management.md`](docs/state-management.md) | The Zustand store, mock auth, service layer, full workflow |
| [`docs/design-system.md`](docs/design-system.md) | Colours, typography, spacing, component conventions |
| [`docs/routes.md`](docs/routes.md) | Every route, its purpose and user type |
| [`docs/components.md`](docs/components.md) | Reusable components and where they live |
| [`docs/mock-data.md`](docs/mock-data.md) | Seed entities, relationships, consumption |
| [`docs/development.md`](docs/development.md) | Install, run, conventions, walkthrough |
| [`docs/status.md`](docs/status.md) | What's built, known limitations, what's left |

## Not real

There is no backend, database, or authentication provider. This is a frontend
prototype driven by mock data and simulated client state.
