# Project Grogu — Agent Instructions

## 1. Project Overview

Project Grogu is a college minor-project prototype for a game playtesting platform.

Grogu connects:

1. Game developers who need players to test their games.
2. Playtesters who discover games, participate in playtests, and submit structured feedback.

The current phase is FRONTEND-FIRST.

The application currently uses dummy/mock data.

Do not implement real backend infrastructure unless explicitly requested.

---

## 2. Current Development Goal

The immediate goal is to build a polished, responsive frontend using:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

The UI should feel like a real production product even though the underlying data is currently mocked.

Prioritize:

* UX
* visual hierarchy
* responsive behavior
* reusable components
* accessibility
* maintainable architecture
* consistent design system

---

## 3. Core Product Flows

### Playtester

Landing
→ Signup/Login
→ Discover Playtests
→ Playtest Details
→ Apply
→ Dashboard
→ Accepted Playtest
→ Playtest Workspace
→ Feedback Form
→ Profile

### Developer

Landing
→ Signup/Login
→ Developer Dashboard
→ My Games
→ Create Playtest
→ Manage Playtest
→ Applicants
→ Feedback
→ Analytics

---

## 4. MVP Screens

The MVP currently consists of approximately 15 primary screens:

1. Landing Page
2. Login
3. Signup / Role Selection
4. Playtester Discover
5. Playtest Details
6. Apply for Playtest
7. Tester Dashboard
8. Playtest Workspace
9. Feedback Form
10. Tester Profile
11. Developer Dashboard
12. My Games
13. Create Playtest
14. Manage Playtest / Applicants
15. Feedback Analytics

Do not unnecessarily expand the MVP.

---

## 5. Explicitly Out of Scope for Current Frontend Phase

Do not implement these unless explicitly requested:

* Real authentication
* Real payments
* Stripe
* Production database
* Prisma
* PostgreSQL
* Firebase
* Supabase
* Real game hosting
* Real-time chat
* AI feedback analysis
* Advanced recommendation engine
* Production notification infrastructure
* Admin dashboard
* Complex backend APIs

Frontend flows may simulate these behaviors using mock data.

---

## 6. Technology Rules

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Hook Form
* Zod
* Zustand only when global client state is actually required
* TanStack Query when real API/server state is introduced
* Recharts for analytics visualizations
* Motion for purposeful animations

Prefer native Next.js capabilities before introducing another dependency.

Do not install a package simply because it is convenient.

Before adding a dependency, determine whether the functionality can reasonably be implemented with existing project tools.

---

## 7. Next.js Rules

Use the App Router.

Prefer Server Components by default.

Use `"use client"` only when client-side behavior is required, such as:

* interactive forms
* dialogs
* dropdowns
* tabs requiring client state
* browser APIs
* interactive charts
* client-side state

Do not turn entire route trees into Client Components unnecessarily.

Use layouts for shared navigation and page shells.

Use dynamic routes for entities such as:

* `/playtests/[id]`
* `/tests/[id]`
* `/developer/playtests/[id]`

---

## 8. Component Architecture

Components should be reusable and domain-oriented.

Preferred structure:

```text
components/
├── ui/
├── layout/
├── navigation/
├── games/
├── playtests/
├── feedback/
├── dashboard/
└── charts/
```

Do not create massive components.

If a component becomes difficult to understand or contains multiple independent UI responsibilities, split it.

Avoid premature abstraction.

Only extract a component when:

* it is reused,
* it represents a meaningful UI concept,
* or extraction materially improves readability.

---

## 9. Mock Data

Mock data belongs in:

```text
data/
```

Example:

```text
data/
├── games.ts
├── playtests.ts
├── users.ts
├── applications.ts
└── feedback.ts
```

Do not scatter hardcoded business data throughout JSX.

Components should consume typed data.

Create TypeScript types/interfaces for important domain entities.

Example entities:

* User
* Game
* Playtest
* Application
* Feedback
* TesterProfile
* DeveloperProfile

Mock data should be realistic enough to demonstrate the product.

---

## 10. Design System

Current Grogu reference palette:

* Primary: `#6C37C3`
* Secondary: `#B0B3D7`
* Background: `#0F0D19`
* Dark: `#080D0A`

Do not use these colors blindly.

Establish a coherent semantic design system around them.

Define semantic tokens for:

* background
* foreground
* surface
* surface elevated
* border
* primary
* primary foreground
* muted
* muted foreground
* success
* warning
* destructive
* info

The final design should feel:

* premium
* modern
* gaming-oriented
* sophisticated
* dark
* visually controlled

Avoid excessive neon effects, gradients, glow effects, and decorative elements.

---

## 11. UI Principles

Grogu should feel closer to:

Steam + modern SaaS + UserTesting

than:

LinkedIn + generic dashboard template.

Prioritize:

* strong game imagery
* large visual cards
* clear status indicators
* tester reputation
* progress indicators
* structured feedback
* meaningful empty states
* clear calls to action

Do not over-design.

Every visual element should support usability.

---

## 12. Responsive Design

Every page must work at:

* mobile
* tablet
* desktop
* large desktop

Use Tailwind responsive utilities.

Do not design desktop first and ignore mobile.

Navigation, cards, grids, tables, forms, and dashboards must have intentional responsive behavior.

---

## 13. Accessibility

Follow accessible HTML and UI patterns.

Requirements:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* proper labels for form inputs
* accessible buttons
* meaningful alt text
* ARIA only where necessary

Do not use clickable `<div>` elements when a semantic button/link is appropriate.

---

## 14. Forms

Use React Hook Form + Zod for meaningful forms.

Forms should include:

* validation
* useful error messages
* loading/submission states
* disabled states
* success states where applicable

Do not create fake validation logic that contradicts the intended product behavior.

---

## 15. Loading / Empty / Error States

Do not design only the happy path.

Important pages should account for:

* loading
* empty
* error
* disabled
* success
* pending
* rejected
* completed states

Use skeletons where appropriate.

---

## 16. Images and Assets

Use assets from:

```text
public/
```

Do not invent external image URLs inside components unless explicitly requested.

If an image asset is missing, use a clear placeholder abstraction rather than hardcoding random external URLs.

Keep image usage intentional.

---

## 17. Documentation

Project documentation belongs in:

```text
docs/
```

Maintain:

```text
docs/
├── architecture.md
├── design-system.md
├── routes.md
├── components.md
├── mock-data.md
└── development.md
```

Documentation should be updated when architecture or major implementation decisions change.

Do not create unnecessary documentation files.

---

## 18. Coding Style

Prefer:

* small readable functions
* descriptive names
* typed props
* early returns
* composition
* reusable primitives
* simple data flow

Avoid:

* `any`
* giant components
* deeply nested conditionals
* duplicated UI
* magic numbers
* unexplained constants
* unnecessary abstractions
* unnecessary dependencies

Use TypeScript strictly.

Do not suppress TypeScript errors unless there is a documented reason.

---

## 19. Before Making Changes

Before implementing a feature:

1. Inspect the existing project structure.
2. Read relevant files.
3. Check existing components before creating new ones.
4. Check existing design tokens before introducing new styles.
5. Check documentation when relevant.
6. Follow the existing architecture.
7. Avoid rewriting working code unnecessarily.

---

## 20. After Making Changes

After implementation:

1. Run lint.
2. Run type checking.
3. Run the relevant build/test commands.
4. Fix errors introduced by the changes.
5. Check responsive behavior.
6. Check accessibility basics.
7. Update documentation if the architecture changed.

Do not claim a feature is complete if the project does not build.

---

## 21. Agent Behavior

Do not blindly follow instructions if they conflict with the architecture or create unnecessary technical debt.

If there is a better implementation, explain the tradeoff briefly before making a significant architectural change.

Do not introduce backend infrastructure during the frontend phase.

Do not redesign unrelated pages while implementing a specific feature unless required for consistency.

Do not replace existing working components without a clear reason.

When requirements are ambiguous, prefer the simplest implementation consistent with the product specification.

---

## 22. Current Priority

The current implementation priority is:

1. Project setup
2. Global design system
3. Landing page
4. Authentication UI
5. Playtester discovery
6. Playtest details
7. Application flow
8. Tester dashboard
9. Playtest workspace
10. Feedback
11. Developer dashboard
12. Game management
13. Playtest creation
14. Playtest management
15. Analytics
16. Final responsive/accessibility polish

Build incrementally.

Do not implement the entire application in one pass.
