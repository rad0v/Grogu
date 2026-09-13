# Project Grogu

Read `AGENTS.md` before making changes.

`AGENTS.md` is the canonical source of project architecture, frontend rules, design principles, scope, and development conventions.

## Important

Grogu is currently a frontend-first college project prototype.

Current stack:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Hook Form
* Zod

Use dummy/mock data for now.

Do not introduce backend infrastructure, authentication providers, databases, payments, AI services, or real-time systems unless explicitly requested.

Before changing code:

1. Inspect the existing implementation.
2. Reuse existing components.
3. Follow the established design system.
4. Avoid unnecessary dependencies.
5. Keep components maintainable and responsive.

After changes:

1. Run lint.
2. Run type checking.
3. Run the production build or relevant checks.
4. Fix issues introduced by the change.

Read relevant files inside `docs/` before making architectural changes.
