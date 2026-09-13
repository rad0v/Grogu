import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gamepad2,
  LineChart,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const AUDIENCES = [
  {
    label: "For gamers",
    title: "Play early. Make your feedback matter.",
    description:
      "Find unreleased games that fit your taste, play with a clear brief, and build a reputation studios can trust.",
    icon: Gamepad2,
    tone: "primary",
    href: "/discover",
    action: "Explore playtests",
    points: ["Match by genre, platform, and time", "Know the reward before you apply", "Turn thoughtful notes into reputation"],
  },
  {
    label: "For studios",
    title: "Replace guesswork with player signal.",
    description:
      "Bring the right players into your build, give them focused objectives, and see the patterns worth shipping against.",
    icon: LineChart,
    tone: "secondary",
    href: "/developers",
    action: "See the studio workflow",
    points: ["Define the audience you actually need", "Ship tasks with every build", "Turn feedback into a clear next move"],
  },
] as const;

export function HowItWorksAudience() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60 bg-dark py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="surface-grid pointer-events-none absolute inset-0 opacity-35" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[28rem] rounded-full bg-primary/12 blur-[110px]" />
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <p className="text-label text-secondary">THE PLAYTEST LOOP</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
            One platform. Two ways to move a game forward.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Grogu gives players a better way to discover and contribute, while studios get a focused signal before launch day.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <article
              key={audience.label}
              className="group relative overflow-hidden rounded-2xl border border-border/80 bg-surface/80 p-6 shadow-2xl shadow-black/20 sm:p-8"
            >
              <div
                aria-hidden
                className={cn(
                  "absolute -right-20 -top-20 size-56 rounded-full blur-3xl",
                  audience.tone === "primary" ? "bg-primary/20" : "bg-secondary/10",
                )}
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-xl border border-primary-line bg-primary-soft text-secondary">
                    <audience.icon className="size-5" aria-hidden />
                  </div>
                  <span className="text-label text-subtle-foreground">{audience.label}</span>
                </div>
                <h2 className="mt-10 max-w-md font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-4xl">
                  {audience.title}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {audience.description}
                </p>
                <ul className="mt-8 grid gap-3 border-t border-border/60 pt-6 text-sm text-foreground">
                  {audience.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                        <Check className="size-3" aria-hidden />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={audience.href}
                  className={cn(buttonVariants({ variant: "outline", size: "md" }), "mt-8 w-fit gap-2")}
                >
                  {audience.action}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs text-subtle-foreground">
          <Users className="size-4 text-secondary" aria-hidden />
          <span>Both sides meet in one shared loop: a clear brief, a real session, and feedback that lands.</span>
        </div>
      </Container>
    </section>
  );
}