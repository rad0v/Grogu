# Components

Import via `@/components/...`. Reads come from `lib/hooks/*`; writes go through
`lib/services/*`. Check `components/ui/` before writing anything new.

## `components/ui/` — primitives

No domain knowledge. Every component takes `className` (merged via `cn()`).

| File | Exports |
| --- | --- |
| `button.tsx` | `Button` (variants, `asChild`, `loading`), `buttonVariants` |
| `card.tsx` | `Card`, `CardHeader/Title/Description/Content/Footer` |
| `badge.tsx` | `Badge` (tones match `lib/constants` metadata) |
| `input.tsx` `textarea.tsx` | text controls |
| `label.tsx` | `Label` (Radix) |
| `field.tsx` | `Field` — label + hint + control + error, wired for a11y |
| `checkbox.tsx` `radio-group.tsx` `select.tsx` | Radix form controls |
| `dialog.tsx` `sheet.tsx` `dropdown-menu.tsx` `tabs.tsx` | Radix overlays / tabs |
| `avatar.tsx` | `Avatar*` + `UserAvatar` (initials fallback) |
| `progress.tsx` `separator.tsx` `skeleton.tsx` | misc |
| `container.tsx` | `Container` — max-width page gutter |
| `meta.tsx` | `MetaItem`, `MetaRow`, `MetaStat`, `MetaStatGrid` — compact metadata rows/tiles |
| `tooltip.tsx` | `Tooltip` — hand-written hover/focus tooltip (Radix's isn't a dependency) |
| `toast.tsx` | `ToastProvider` + `useToast` — transient confirmations, mounted in the root layout |
| `pagination.tsx` | `Pagination` — client-side paging, hidden at one page |
| `section-heading.tsx` | `SectionHeading` — eyebrow + title + lead |
| `logo.tsx` | `Logo` — wordmark + mark |
| `status-badge.tsx` | `StatusBadge` — one component for playtest / application / test-stage / game status |
| `states.tsx` | `EmptyState`, `ErrorState`, `LoadingState`, `SuccessState`, `PlaytestCardSkeleton`, `CardGridSkeleton`, `ListSkeleton`, `StatsSkeleton`, `PageSkeleton` |

## `components/layout/`

| File | Responsibility |
| --- | --- |
| `app-shell.tsx` | Authenticated shell: **top nav** + mobile drawer. Route-guards by role, gates on hydration. Client |
| `page-header.tsx` | `PageHeader` (breadcrumbs + eyebrow + title + description + actions) and `SectionTitle` (in-page section heading) |
| `site-footer.tsx` | Marketing footer |

## `components/navigation/`

| File | Responsibility |
| --- | --- |
| `site-header.tsx` | Public header; shows auth CTAs or account controls by session. Client |
| `user-menu.tsx` | Avatar dropdown: profile, reset demo, sign out |
| `notification-menu.tsx` | Bell + unread count + notification list, mark read / all read |
| `app-nav.tsx` | `AppNavBar` (top nav with underline active rail), `AppNavList` (mobile drawer), `isNavItemActive` |

## `components/marketing/` (server)

`hero.tsx` (headline + live playtest art stack), `featured-playtests.tsx`,
`how-it-works.tsx`, `featured-games.tsx`, and `audience-sections.tsx`
(`WhyTesters`, `WhyDevelopers`, `PlatformStats`, `DeveloperCta`) — the
landing-page sections, composed by `app/(marketing)/page.tsx`.

## `components/games/`

| File | Responsibility |
| --- | --- |
| `game-cover.tsx` | `GameCover` — genre-driven procedural SVG cover art (deterministic from genre + `accentHue` + title); `GameArt` — the fixed-ratio frame every game image uses. Renders `coverImageUrl` if set |
| `game-card.tsx` | Game summary card (featured games, catalogues) |
| `developer-card.tsx` | Studio summary (playtest detail sidebar) |
| `game-form.tsx` | Create/edit game form + live preview. Client |

## `components/playtests/`

| File | Responsibility |
| --- | --- |
| `playtest-card.tsx` | Playtest summary card — Discover + dashboards |
| `playtest-detail.tsx` | Full detail view (client; `initialPlaytest` prop until hydrated) |
| `requirements-list.tsx` | Reward + tester requirements `<dl>` |
| `task-list.tsx` | Task list — read-only, or interactive checklist with `onToggle` |
| `apply-panel.tsx` | Right-rail CTA: resolves session / application / capacity state |
| `apply-dialog.tsx` | Application form dialog (RHF + Zod) with success state |
| `discover-explorer.tsx` / `discover-filters.tsx` | Discover: search, sort, filter rail (mobile sheet), featured lead, paged results |
| `featured-playtest.tsx` | Wide editorial treatment of one playtest — leads Discover |
| `playtest-form.tsx` | 5-step create/edit-draft wizard — Game, Test information, Requirements, Tasks & reward, Review (`useFieldArray` for tasks). Client |
| `applicant-row.tsx` | One applicant with accept / reject actions |

## `components/tests/`

| File | Responsibility |
| --- | --- |
| `workspace.tsx` | Tester workspace: build → tasks → feedback, with stepper |
| `workflow-stepper.tsx` | Three-step progress rail (build → tasks → feedback), derived from real progress |
| `test-progress-card.tsx` | A tester's test with progress (dashboard + My tests) |
| `tests-list-view.tsx` | `/tests` page body |

## `components/feedback/`

| File | Responsibility |
| --- | --- |
| `rating.tsx` | `RatingStars` (read), `RatingInput` (interactive radio), `RatingBar` (analytics) |
| `feedback-form.tsx` | 3-step structured feedback form (Ratings → Report → Wrap up) → `testsService.submitFeedback` |
| `feedback-card.tsx` | One feedback report (developer views, tester history) |

## `components/dashboard/`

`stat-card.tsx` (`StatCard`, `StatCardGrid` — hairline tiles, deliberately not
cards), `tester-card.tsx` (accepted tester progress).

## `components/charts/` (Recharts, client)

`chart-theme.ts` (palette from tokens), `ratings-bar-chart.tsx`,
`sentiment-donut.tsx`.

## `components/tester/` and `components/developer/`

Page-level feature components — one per authenticated route
(`tester-dashboard`, `applications-view`, `tester-profile-view`,
`developer-dashboard`, `games-view`, `playtests-view`, `manage-playtest`,
`analytics-view`, `developer-profile-view`). Each is the client body rendered by
a thin `page.tsx`. `developer/playtest-row.tsx` is the shared playtest list row
used by both the developer dashboard and the Playtests page.

## `components/auth/`

`auth-card.tsx` (shell), `login-form.tsx`, `signup-form.tsx`.

## Adding components

1. No domain meaning → `components/ui/`.
2. One domain, reused → `components/<domain>/`.
3. One page only → co-locate as the page's feature component under the domain
   folder, promote if it spreads.
