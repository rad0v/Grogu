import { ClipboardList, MessageSquareText, Search, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  audience: "Testers" | "Developers";
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: "Discover a playtest",
    description:
      "Browse open playtests filtered by platform, genre, time commitment, and the skills the developer is looking for.",
    audience: "Testers",
  },
  {
    icon: UserCheck,
    title: "Apply and get accepted",
    description:
      "Send a short pitch. Developers review applicants against their requirements and build a focused tester group.",
    audience: "Testers",
  },
  {
    icon: ClipboardList,
    title: "Complete structured tasks",
    description:
      "Work through the developer's objectives, surveys, and bug-report tasks — with time estimates so nothing is a surprise.",
    audience: "Testers",
  },
  {
    icon: MessageSquareText,
    title: "Submit feedback that ships",
    description:
      "Ratings, highlights, pain points, and repro steps land in one place. Developers see analytics; testers build reputation.",
    audience: "Developers",
  },
];

/**
 * The four-step loop. Numbered rail rather than four cards — the steps are a
 * sequence, and boxing each one hides that.
 */
export function HowItWorks() {
  return (
    <section className="border-b border-border bg-surface/35 py-24 lg:py-32">
      <Container className="flex flex-col gap-12">
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="The shared loop"
            title="From first brief to feedback you can act on"
            lead="Four steps keep the session focused for players and useful for the people building the game."
          />
        </div>

        <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex flex-col gap-5 border-t border-border-strong/70 pt-5">
              {/* Connector rail — desktop only, and not after the last step. */}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-11 top-5 hidden h-px w-[calc(100%-1rem)] bg-linear-to-r from-border-strong to-transparent lg:block"
                />
              )}

              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary-line bg-primary-soft text-secondary">
                  <step.icon className="size-4.5" aria-hidden />
                </span>
                <span className="font-display text-sm font-semibold tabular-nums text-secondary">
                  0{index + 1}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>

              <span className="text-label mt-auto text-secondary-muted">
                {step.audience}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
