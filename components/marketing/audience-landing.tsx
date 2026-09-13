import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  Gamepad2,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PlatformStats } from "@/components/marketing/audience-sections";

interface AudienceLandingProps {
  kind: "developers" | "gametesters";
  stats: {
    games: number;
    activePlaytests: number;
    testers: number;
    feedbackSubmitted: number;
  };
}

const CONTENT = {
  developers: {
    eyebrow: "FOR STUDIOS",
    title: "Know what to fix before players find it for you.",
    description:
      "Grogu gives small teams a focused way to recruit players, run structured sessions, and turn messy reactions into decisions.",
    primary: { href: "/signup", label: "Create a studio account" },
    secondary: { href: "/discover", label: "See live playtests" },
    metric: "42 reports",
    metricLabel: "ready to turn into your next build",
    accent: "Recruit the signal you need",
    steps: [
      { icon: Users, title: "Define the audience", body: "Set the genre, platform, experience, and time commitment that make a tester useful for this build." },
      { icon: ClipboardList, title: "Run a focused session", body: "Give players a build, a task list, and the exact questions your team needs answered." },
      { icon: BarChart3, title: "Ship with confidence", body: "See ratings, pain points, bugs, and recurring themes in one place." },
    ],
    proof: ["Applicant review with reputation and platform context", "Per-task feedback with reproducible bug details", "Analytics that show patterns, not just quotes"],
  },
  gametesters: {
    eyebrow: "FOR GAMETESTERS",
    title: "Play the next great game before everyone else.",
    description:
      "Grogu helps thoughtful players find the right builds, understand the assignment, and get credit for feedback that makes a difference.",
    primary: { href: "/discover", label: "Find a playtest" },
    secondary: { href: "/signup", label: "Create a tester profile" },
    metric: "14 verified",
    metricLabel: "tests completed by a top tester",
    accent: "Make your playtime count",
    steps: [
      { icon: Search, title: "Find your match", body: "Browse by genre, platform, reward, and time so every application starts with a good fit." },
      { icon: Gamepad2, title: "Play with a purpose", body: "Follow a clear brief, test the build, and capture the moments that matter while you play." },
      { icon: ShieldCheck, title: "Build your reputation", body: "Submit useful feedback on time and unlock more trusted, higher-impact opportunities." },
    ],
    proof: ["Know the reward and time commitment upfront", "Keep tasks, builds, and notes together", "Build a profile developers can trust"],
  },
} as const;

export function AudienceLanding({ kind, stats }: AudienceLandingProps) {
  const content = CONTENT[kind];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-dark py-20 sm:py-24 lg:py-32">
        <div aria-hidden className="surface-grid pointer-events-none absolute inset-0 opacity-35" />
        <div aria-hidden className="pointer-events-none absolute -right-32 top-10 size-[32rem] rounded-full bg-primary/15 blur-[120px]" />
        <Container className="relative z-10 grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.62fr)] lg:gap-20">
          <div className="max-w-3xl">
            <p className="text-label text-secondary">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={content.primary.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
                {content.primary.label}
                <ArrowRight />
              </Link>
              <Link href={content.secondary.href} className={buttonVariants({ variant: "outline", size: "lg" })}>
                {content.secondary.label}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface/80 p-6 shadow-2xl shadow-black/25 sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-secondary">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">Grogu signal</span>
              </div>
              <span className="text-label text-success">LIVE</span>
            </div>
            <p className="mt-8 text-label text-secondary-muted">{content.accent}</p>
            <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground">{content.metric}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.metricLabel}</p>
            <div className="mt-8 space-y-3">
              {content.proof.map((point) => (
                <div key={point} className="flex items-start gap-3 border-t border-border/50 pt-3 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface/35 py-24 lg:py-32">
        <Container>
          <div className="max-w-2xl">
            <p className="text-label text-secondary">THE WORKFLOW</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">A clear next step at every stage.</h2>
          </div>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {content.steps.map((step, index) => (
              <li key={step.title} className="relative border-t border-border-strong/70 pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg border border-primary-line bg-primary-soft text-secondary">
                    <step.icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="font-display text-sm font-semibold tabular-nums text-secondary">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <PlatformStats stats={stats} />
    </>
  );
}
