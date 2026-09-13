# Design System

Direction: **premium · modern · dark · gaming-oriented · sophisticated.**
It should read as a serious gaming product, not a generic dashboard. No neon, no
glow, minimal gradients, no glassmorphism, no decorative animation.

All raw colour/spacing values live in **one file**: [`app/globals.css`](../app/globals.css).
Components only ever use the semantic Tailwind utilities generated from those
tokens (`bg-surface`, `text-muted-foreground`, `border-border`, …).

## Colours

Built around the reference palette:

| Reference  | Hex       | Role in the system            |
| ---------- | --------- | ----------------------------- |
| Primary    | `#6C37C3` | `--primary` (actions, brand)  |
| Secondary  | `#B0B3D7` | `--secondary` (accents, eyebrows, links) |
| Background | `#0F0D19` | `--background` (app canvas)   |
| Dark       | `#080D0A` | `--dark` (footer, deepest surfaces) |

### Semantic tokens

| Token | Value | Use |
| --- | --- | --- |
| `background` / `foreground` | `#0F0D19` / `#F0EEF7` | Page canvas + default text |
| `surface` / `surface-foreground` | `#15121F` / `#F0EEF7` | Cards, panels |
| `elevated` / `elevated-foreground` | `#1C1829` / `#F7F5FC` | Raised surfaces, popovers, secondary buttons |
| `dark` | `#080D0A` | Footer, deep wells, artwork scrims |
| `border` / `border-strong` | `#262138` / `#3A3355` | Hairlines / emphasized dividers |
| `input` | `#1A1626` | Form field background |
| `ring` | `#8B5CF0` | Focus outline |
| `primary` / `primary-foreground` | `#6C37C3` / `#F8F5FF` | Primary actions |
| `primary-hover` / `primary-active` | `#7C46D6` / `#5E2CAD` | Primary button interaction |
| `primary-soft` / `primary-line` | `primary` @16% / @38% | Selected filters, active nav, soft washes |
| `secondary` / `secondary-foreground` | `#B0B3D7` / `#14111F` | Accents, quiet emphasis |
| `muted` / `muted-foreground` | `#1E1A2B` / `#9C96B3` | Subtle fills / secondary text |
| `subtle-foreground` | `#6F6987` | Metadata keys, labels, tertiary text |
| `accent` / `accent-foreground` | `#272134` / `#F7F5FC` | Hover states |
| `success` | `#3FB984` | Recruiting, accepted, positive |
| `warning` | `#E0A73B` | In review, pending |
| `destructive` | `#E5555A` | Rejected, destructive actions |
| `info` | `#5B8DFF` | In progress, informational |

Status colours are used at ~15% opacity for badge fills (`bg-success/15`
`text-success`) so the UI stays calm.

The theme is **dark-only** for the prototype (`color-scheme: dark` on `:root`).
Tokens are structured so a light theme could be added later by overriding
`:root` values under a `[data-theme="light"]` selector.

## Typography

Two families, loaded via `next/font/google` (self-hosted, no layout shift):

| Family | Variable | Applied to |
| --- | --- | --- |
| **Space Grotesk** (500/600/700) | `--font-space-grotesk` → `--font-display` | `h1`–`h4`, logo wordmark, stat figures (`.font-display`) |
| **Inter** | `--font-inter` → `--font-sans` | All body text, UI, controls |

Rationale: Space Grotesk is geometric with a slightly technical character that
suits a gaming product, used **only** for headings and numeric display so it
never hurts readability. Inter carries everything else — it is the most legible
UI typeface available and keeps long-form content (playtest goals, feedback)
comfortable. A monospace stack (`--font-mono`) is defined for future
code/build-version display but no monospace webfont is loaded.

Headings use `letter-spacing: -0.022em` and `text-wrap: balance`; body copy uses
`text-wrap: pretty`.

Three utilities carry the expressive end of the scale:

| Utility | Use |
| --- | --- |
| `.text-display` | Landing hero only. Fluid `clamp(2.5rem … 4.75rem)`. |
| `.text-display-sm` | Section and page-level headlines. Fluid `clamp(1.875rem … 2.75rem)`. |
| `.text-label` | 11px uppercase, `0.1em` tracking — metadata keys and eyebrows. |

## Spacing & layout

- Page gutter: the `.container-page` utility (`max-width: 82rem`, responsive
  inline padding `1.25rem` → `2rem`). Exposed as `<Container />`.
- Section vertical rhythm: `py-20` (`py-16` for compact headers).
- Grid gaps: `gap-4`/`gap-5` for card grids, `gap-3` for inline groups.

## Border radius

`--radius: 0.625rem` base, with the shadcn-style scale:
`--radius-sm` (−4px) · `--radius-md` (−2px) · `--radius-lg` (base) ·
`--radius-xl` (+4px) · `--radius-2xl` (+10px).

One rule, applied everywhere: **cards `rounded-xl`, controls `rounded-md`,
badges and chips `rounded-full`, large feature panels `rounded-2xl`.** Nothing
else. If a new element doesn't fit one of those four, it is probably a card.

## Elevation

Restrained, shadow-only (no glow):

- `--shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / .4)` — resting buttons
- `--shadow-md`: `0 10px 30px -12px rgb(0 0 0 / .65)` — menus, popovers, apply rail
- `--shadow-lg`: `0 30px 70px -24px rgb(0 0 0 / .75)` — dialogs, sheets, toasts

Primary separation comes from `border` + `surface` contrast, not shadow.

## Motion

Fast, subtle, purposeful — nothing exceeds 240ms.

| Token | Value | Use |
| --- | --- | --- |
| `--duration-fast` | 120ms | Colour / border transitions on controls |
| `--duration-base` | 180ms | Card hover lift, toasts |
| `--duration-slow` | 240ms | Entrances (`.animate-rise`) |
| `--ease-out-soft` | `cubic-bezier(.22,1,.36,1)` | All of the above |

Utilities: `.lift` (2px card hover raise), `.animate-rise` (above-the-fold
entrance), `.animate-shimmer` (skeletons), `.glass` (sticky bar blur).

**`prefers-reduced-motion: reduce` collapses every animation and transition to
0.01ms and disables the hover lift** — state changes stay visible, movement does
not.

## Cards vs. sections

The quickest way a product starts looking like a generic dashboard is wrapping
every group in a card. The rule here:

- **Use a card** for a repeated unit in a list or grid (playtest, game, tester,
  feedback report), for a side rail, or for a genuinely bounded panel.
- **Use a section** — heading, hairline, whitespace — for page structure.
  `SectionTitle`, `SectionHeading`, and the `border-t border-border pt-*` pattern
  cover this.
- `StatCard` is deliberately a hairline tile rather than a `Card`, so a four-up
  stat row above a list of cards doesn't read as eight stacked boxes.

## Game artwork

The prototype ships no image assets, so `components/games/game-cover.tsx`
generates cover art:

- The **motif** comes from the game's first genre — `ridge` (adventure / RPG /
  platformer), `shards` (action / shooter), `grid` (puzzle / strategy),
  `contour` (simulation), `orbit` (roguelike), `fog` (horror).
- The **colour** comes from `game.accentHue`; the **layout** is jittered by a
  seeded PRNG keyed on the title, so art is fully deterministic — identical on
  server and client, and stable for a given game forever.
- `GameArt` wraps `GameCover` in a fixed ratio (`16/9`, `16/10`, `3/2`, `21/9`)
  with an optional bottom `scrim`. **Always use `GameArt`** instead of a
  hand-rolled `aspect-*` wrapper, so every game image crops identically.
- A real `coverImageUrl` on a `Game` always wins over the generator.

## Component conventions

| Component | File | Notes |
| --- | --- | --- |
| `Button` / `buttonVariants` | `components/ui/button.tsx` | Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `success`, `link`. Sizes: `sm`, `md`, `lg`, `icon`, `icon-sm`. `asChild` (Radix Slot) styles a `<Link>` as a button; `loading` shows a spinner and disables. |
| `Card` (+ Header/Title/Description/Content/Footer) | `components/ui/card.tsx` | Variants: `default`, `elevated`, `interactive` (hover lift), `plain` (grouping with no frame). |
| `Badge` | `components/ui/badge.tsx` | Tones: `default`, `muted`, `primary`, `success`, `warning`, `destructive`, `info`, `outline`, `overlay` (sits on artwork). Sizes `sm`/`md`, optional leading `dot`. Tone names match the metadata maps in `lib/constants.ts`. |
| `StatusBadge` | `components/ui/status-badge.tsx` | One badge for every domain status (`kind`: `playtest` / `application` / `test` / `game`) — keeps label + tone consistent. |
| `Input` / `Textarea` | `components/ui/*` | `input` background, focus moves the border to `ring`. |
| `Field` | `components/ui/field.tsx` | Label + hint + control + error, wired for a11y (`htmlFor` / `aria-describedby`). Use it for every form control. |
| Radix wrappers | `checkbox`, `radio-group`, `select`, `dialog`, `sheet`, `dropdown-menu`, `tabs`, `avatar`, `progress`, `separator` | Themed to the tokens; animations from `tw-animate-css`. |
| `states.tsx` | `EmptyState`, `ErrorState`, `LoadingState`, `PageSkeleton` | Every list/async view uses these for the non-happy paths. |
| `Container` | `components/ui/container.tsx` | Wraps `.container-page`. |
| `SectionHeading` | `components/ui/section-heading.tsx` | Eyebrow + title + lead, left or centered. |
| `Logo` | `components/ui/logo.tsx` | Wordmark + radar-sweep mark; `compact` renders the mark alone. |
| `MetaItem` / `MetaRow` / `MetaStat` / `MetaStatGrid` | `components/ui/meta.tsx` | Compact metadata (reward, duration, slots, deadline). Defined once so every card states the same facts the same way. |
| `Tooltip` | `components/ui/tooltip.tsx` | Hover/focus tooltip with `role="tooltip"` + `aria-describedby`. Hand-written — Radix's tooltip isn't a project dependency and doesn't justify adding one. |
| `ToastProvider` / `useToast` | `components/ui/toast.tsx` | Transient confirmations. Mounted once in the root layout so every route group has it; `useToast()` no-ops outside a provider. |
| `Pagination` | `components/ui/pagination.tsx` | Client-side paging for Discover; renders nothing at a single page. |

### Focus states

Global rule in `globals.css`: every `:focus-visible` gets
`outline: 2px solid var(--color-ring)` with `2px` offset. Interactive elements
are real `<button>` / `<a>` so they are keyboard-reachable by default.

### Primitives & shadcn/ui

`components.json` is configured (new-york, Tailwind v4, `@/components/ui`, lucide).
The primitives in `components/ui/` are hand-written but shadcn-compatible and
built on Radix where accessibility demands it (dialog, dropdown-menu, tabs,
select, checkbox, radio-group, label, avatar, progress, separator). New
primitives can be added with `npx shadcn@latest add <component>` — retheme
the generated CSS variables to the tokens above.

### States

Loading, empty, and error states are first-class: `components/ui/states.tsx`
provides `LoadingState`, `EmptyState`, `ErrorState`, `SuccessState`, and
skeletons (`PlaytestCardSkeleton`, `CardGridSkeleton`, `ListSkeleton`,
`StatsSkeleton`, `PageSkeleton`). Persisted-store views render `PageSkeleton`
until `useHydrated()` is true.
