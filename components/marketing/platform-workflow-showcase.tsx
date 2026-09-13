"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Cpu,
  Download,
  Filter,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

type AudienceMode = "developers" | "testers";

const DEV_STEPS = [
  {
    step: "01",
    title: "Target Your Ideal Playtesters",
    subtitle: "No generic feedback. Recruit players who actually play your genre.",
    bullets: [
      "Filter by genre preferences (Action, RPG, Strategy, Indie)",
      "Target specific platforms (PC, PlayStation, Xbox, Mobile)",
      "Select experience tiers from casual players to QA pros",
    ],
    widget: {
      title: "Audience Target Filters",
      icon: Filter,
      eyebrow: "RECRUITING SIGNAL",
      metric: "48 matched",
      metricLabel: "players fit this brief",
      progress: 72,
      footer: "Audience quality improves when the brief is specific.",
      items: [
        { label: "Target Genre", val: "Sci-Fi Action / RPG", active: true, detail: "High intent" },
        { label: "Hardware Specs", val: "RTX 3060+, 16GB RAM", active: true, detail: "Verified" },
        { label: "Experience Level", val: "Regular to Hardcore", active: true, detail: "Best fit" },
      ],
    },
  },
  {
    step: "02",
    title: "Distribute Builds & Define Test Tasks",
    subtitle: "Set clear objectives so playtesters focus on what matters most.",
    bullets: [
      "Share private Steam keys or secure build download links",
      "Specify quest objectives (e.g., 'Test Level 3 boss mechanics')",
      "Collect structured bug logs, crash reports, and survey responses",
    ],
    widget: {
      title: "Active Playtest Mission",
      icon: Download,
      eyebrow: "MISSION CONTROL",
      metric: "03 tasks",
      metricLabel: "ready for your first session",
      progress: 64,
      footer: "Clear tasks turn playtime into feedback your team can use.",
      items: [
        { label: "Task 1", val: "Complete Prologue Chapter (20 mins)", active: true, detail: "Objective" },
        { label: "Task 2", val: "Evaluate UI & Control Customization", active: true, detail: "Guided" },
        { label: "Task 3", val: "Rate Combat Difficulty (1 - 10)", active: true, detail: "Survey" },
      ],
    },
  },
  {
    step: "03",
    title: "Actionable Telemetry & Analytics",
    subtitle: "Turn qualitative gameplay feedback into game-changing updates.",
    bullets: [
      "Visual rating distributions & satisfaction breakdowns",
      "Categorized feedback (Bugs, Balance, Graphics, Audio)",
      "Manage applicant roster with one-click approval",
    ],
    widget: {
      title: "Feedback Telemetry",
      icon: BarChart3,
      eyebrow: "WHAT SHIPPED",
      metric: "94% positive",
      metricLabel: "sentiment across 42 reports",
      progress: 88,
      footer: "Patterns surface faster when every report follows the same shape.",
      items: [
        { label: "Overall Satisfaction", val: "94% Positive", active: true, detail: "Trending up" },
        { label: "Completion Rate", val: "88% (42 / 48 Testers)", active: true, detail: "On track" },
        { label: "Top Rated Feature", val: "Boss Combat AI", active: true, detail: "4.8 / 5" },
      ],
    },
  },
];

const TESTER_STEPS = [
  {
    step: "01",
    title: "Discover Exclusive Playtests",
    subtitle: "Get early access to unreleased indie gems and studio prototypes.",
    bullets: [
      "Personalized recommendations matching your gaming rig",
      "Filter playtests by reward, platform, and play duration",
      "Apply in 1-click with your saved gaming specs profile",
    ],
    widget: {
      title: "Discover Feed",
      icon: Gamepad2,
      eyebrow: "MATCHED FOR YOU",
      metric: "12 new",
      metricLabel: "playtests match your profile",
      progress: 76,
      footer: "Your profile does the filtering before you start browsing.",
      items: [
        { label: "Aetheria: Eclipse", val: "PC · Sci-Fi RPG · 2h Test", active: true, detail: "₹3,000 reward" },
        { label: "Neon Drift 2088", val: "Console · Racing · 1h Test", active: true, detail: "New today" },
        { label: "Rogue Dungeon", val: "PC · Action · 30m Test", active: true, detail: "92% match" },
      ],
    },
  },
  {
    step: "02",
    title: "Play Builds & Test Objectives",
    subtitle: "Experience unreleased builds while fulfilling testing objectives.",
    bullets: [
      "Access private game builds & testing guidelines",
      "Log bugs, performance issues, and UI quirks easily",
      "Play on your own schedule within the playtest window",
    ],
    widget: {
      title: "Testing Workspace",
      icon: Cpu,
      eyebrow: "YOUR SESSION",
      metric: "2 / 3",
      metricLabel: "tasks complete this session",
      progress: 67,
      footer: "A focused workspace keeps your notes tied to the build you played.",
      items: [
        { label: "Build Status", val: "v0.8.4 Ready for Test", active: true, detail: "Verified" },
        { label: "Current Mission", val: "Boss Fight Telemetry", active: true, detail: "In progress" },
        { label: "Time Remaining", val: "3 Days 14 Hours", active: true, detail: "On schedule" },
      ],
    },
  },
  {
    step: "03",
    title: "Submit Reviews & Level Up Rank",
    subtitle: "Earn a trusted reputation as a top-tier playtester.",
    bullets: [
      "Submit structured feedback & detailed bug reports",
      "Earn tester badges and unlock VIP high-priority playtests",
      "Build a verified playtester profile showcasing your impact",
    ],
    widget: {
      title: "Tester Reputation Badge",
      icon: Trophy,
      eyebrow: "YOUR IMPACT",
      metric: "Gold tier",
      metricLabel: "top 5% of verified testers",
      progress: 92,
      footer: "Detailed feedback compounds into better access and better rewards.",
      items: [
        { label: "Rank Tier", val: "Gold Playtester (Top 5%)", active: true, detail: "Verified" },
        { label: "Tests Completed", val: "14 Verified Playtests", active: true, detail: "+3 this month" },
        { label: "Developer Rating", val: "4.9 / 5.0 Stars", active: true, detail: "Trusted" },
      ],
    },
  },
];

export function PlatformWorkflowShowcase() {
  const [activeTab, setActiveTab] = useState<AudienceMode>("developers");

  const steps = activeTab === "developers" ? DEV_STEPS : TESTER_STEPS;

  return (
    <section
      id="explore-sections"
      className="relative border-b border-border/60 bg-background py-24 lg:py-32 overflow-hidden scroll-mt-12"
    >
      <Container className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-secondary">
            <Sparkles className="size-3.5" />
            PlaytestCloud-Inspired Architecture
          </span>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            How Grogu Powers{" "}
            <span className="text-secondary">Game Playtesting</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A seamless bridge between game studios seeking telemetry and passionate players
            eager to test unreleased builds.
          </p>

          {/* Interactive Audience Switcher Tabs */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center rounded-xl border border-border bg-surface/80 p-1.5 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab("developers")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "developers"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                )}
              >
                <Users className="size-4" />
                <span>For Game Studios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("testers")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "testers"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                )}
              >
                <Gamepad2 className="size-4" />
                <span>For Playtesters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-Step Workflow Presentation */}
        <div className="mt-16 sm:mt-24 space-y-16 lg:space-y-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-16 lg:space-y-24"
            >
              {steps.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const WidgetIcon = item.widget.icon;

                return (
                  <div
                    key={item.step}
                    className={cn(
                      "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
                      !isEven && "lg:grid-flow-dense"
                    )}
                  >
                    {/* Step Text Details */}
                    <div
                      className={cn(
                        "space-y-4",
                        !isEven && "lg:col-start-2"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display text-3xl sm:text-4xl font-extrabold text-secondary/40">
                          {item.step}
                        </span>
                        <span className="h-px flex-1 bg-border/60" />
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {item.subtitle}
                      </p>

                      <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-subtle-foreground">
                        {item.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="size-4 text-secondary shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step Animated Mockup Widget Box */}
                    <div
                      className={cn(
                        "relative rounded-2xl border border-primary/30 bg-surface/90 p-6 shadow-2xl shadow-primary/5",
                        !isEven && "lg:col-start-1"
                      )}
                    >
                      {/* Ambient card top border glow */}
                      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                      <div className="flex items-center justify-between border-b border-border/60 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-secondary">
                            <WidgetIcon className="size-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-foreground">
                            {item.widget.title}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                          <span className="size-1.5 rounded-full bg-success" />
                          Live signal
                        </span>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-label text-secondary-muted">{item.widget.eyebrow}</p>
                          <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                            {item.widget.metric}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.widget.metricLabel}</p>
                        </div>
                        <div className="text-right text-[10px] text-subtle-foreground">
                          <span>{item.widget.progress}% ready</span>
                          <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.widget.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: 0.15 }}
                              className="h-full rounded-full bg-secondary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2.5">
                        {item.widget.items.map((wItem, wIdx) => (
                          <motion.div
                            key={wIdx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: wIdx * 0.1 }}
                            className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 text-xs"
                          >
                            <span className="grid size-6 shrink-0 place-items-center rounded-md border border-primary-line bg-primary-soft font-display text-[10px] text-secondary">
                              0{wIdx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                <span className="font-medium text-foreground">{wItem.label}</span>
                                <span className="text-[10px] text-success">{wItem.detail}</span>
                              </div>
                              <p className="mt-1 truncate text-[11px] text-muted-foreground">{wItem.val}</p>
                            </div>
                            <ShieldCheck className="size-3.5 shrink-0 text-secondary" />
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-5 flex items-start gap-2 border-t border-border/50 pt-4 text-[11px] leading-relaxed text-subtle-foreground">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-secondary" />
                        <span>{item.widget.footer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
