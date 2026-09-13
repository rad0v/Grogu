# App Status

Last updated: 2026-09-09 · Phase: **frontend-first MVP + edit flows — complete**

This is a **frontend prototype**. There is no backend, database, or auth
provider. Data is seeded mock data; auth and every mutation are simulated on the
client with a persisted Zustand store (`docs/state-management.md`).

## Validation

| Check | Result |
| --- | --- |
| `npm run lint` | ✅ clean (2026-09-09) |
| `npm run typecheck` | ✅ clean (2026-09-09) |
| `npm run build` | ✅ 26 routes, static where possible (2026-09-09) |
| Headless-browser flow test (scratchpad, not committed) | ✅ 23/23 — apply → accept → test → feedback → analytics |

## Screens — all implemented

| Area | Screen | State |
| --- | --- | --- |
| Marketing | Landing (`/`) | ✅ |
| Marketing | How it works, For developers | ✅ |
| Marketing | Discover (`/discover`) — working search + filters | ✅ |
| Marketing | Playtest detail (`/playtests/[id]`) + apply | ✅ |
| Auth | Login — demo accounts + email (mock) | ✅ |
| Auth | Signup — role selection + role forms (RHF + Zod) | ✅ |
| Tester | Dashboard | ✅ |
| Tester | Applications (with withdraw) | ✅ |
| Tester | My tests | ✅ |
| Tester | Test workspace (build → tasks → feedback) | ✅ |
| Tester | Feedback form | ✅ |
| Tester | Profile | ✅ |
| Developer | Dashboard | ✅ |
| Developer | Games + Create game | ✅ |
| Developer | Edit game | ✅ |
| Developer | Playtests + 4-step Create playtest wizard | ✅ |
| Developer | Edit draft playtest | ✅ |
| Developer | Manage playtest — Overview / Applicants / Testers / Feedback / Analytics | ✅ |
| Developer | Analytics (cross-playtest) | ✅ |
| Developer | Studio profile | ✅ |

The full product workflow runs end to end on mock state and survives refresh.

## Known limitations (by design, this phase)

- **No backend.** Auth is a `Session` object in `localStorage` — no provider, no
  token, no real password check. Anyone can "log in" as any seed user.
- **State is per-browser.** The persisted store is local to one browser; nothing
  syncs. Clearing site data resets it. Two people can't see each other's changes.
- **Simulated latency** on service calls (~200–900ms) so loading states show.
- **Procedural art.** Game covers and avatars are generated from a hue + initials
  — no real image upload/hosting (`GameCover`, `UserAvatar`).
- **No email / notifications delivery.** Notifications are store rows only.
- **No file handling.** "Download build" just flips a flag; build URLs are fake.
- **Lifecycle editing is intentionally constrained.** Games can be edited;
  playtest drafts can be edited while published, active, completed, closed, and
  archived playtests are protected from content edits. `recruiting` is the
  existing published/open status in this model.
- **No pagination / virtualization.** Fine at mock-data scale.
- **`/tests/[id]` and `/developer/playtests/[id]`** render on demand (not
  prerendered) because they're session-gated.
- **First load of an authenticated page** shows a skeleton until the persisted
  store hydrates (public pages are server-rendered with content).

## Not started (explicitly out of scope for this phase)

Real authentication · database / API · payments / rewards fulfilment · real-time
chat · AI feedback analysis · recommendation engine beyond a simple filter ·
admin tools · email. See `AGENTS.md` §5.

## What to replace when the backend arrives

| Mock | Replace with |
| --- | --- |
| `lib/services/auth.ts` (+ `lib/mock-auth.ts`) | Real auth provider — the only files that know auth is fake. `useSession()` stays. |
| `lib/services/*` bodies | `fetch` / SDK calls. Signatures and call sites unchanged. |
| `lib/store/grogu-store.ts` | Shrinks to session/UI state; server data moves to TanStack Query behind the existing `lib/hooks/*` names. |
| `data/*.ts` + `data/index.ts` | Server-side API reads (or delete once all reads are client-side query). |
| `GameCover` / `UserAvatar` fallbacks | Real uploaded images via `coverImageUrl` / `avatarUrl` (already optional fields). |
| Simulated `delay()` in `lib/services/http.ts` | Remove. |

## Visual system (redesign pass)

The whole frontend was re-skinned against a single design system; no routes,
services, hooks, store, or mock-data shapes changed.

- **Navigation** moved from a sidebar to a role-aware top nav (`AppNavBar`),
  with a mobile drawer. Sidebars read as an admin console; this product should
  read as a gaming platform.
- **Game art** is now genre-driven and deterministic (`GameCover`), framed by
  `GameArt` so every game image in the product crops identically.
- **Cards are rationed.** Page structure uses headings, hairlines and
  whitespace; cards are reserved for repeated units and side rails. See
  `docs/design-system.md` § Cards vs. sections.
- **New primitives:** `meta.tsx`, `toast.tsx`, `tooltip.tsx`, `pagination.tsx`,
  plus `SuccessState` and four skeleton shapes in `states.tsx`.
- **Multi-step flows:** playtest creation is 5 steps, feedback is 3, both with a
  progress bar.
- **Motion** is token-driven and fully disabled under `prefers-reduced-motion`.

## Next tasks (suggested)

1. Tester ↔ developer messaging on a playtest.
2. Real image upload for covers/avatars.
3. Wire a backend: start with auth + read APIs behind TanStack Query.
